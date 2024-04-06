import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import unzipper from 'unzipper';
import { execSync } from 'child_process';

import { LocalCloud, JobData } from "zkcloudworker";

export async function main() {
  console.log("executing zkCloudWorker code...");
  const functionName = "zkcloudworker";
  const timeCreated = Date.now();
  const job: JobData = {
    id: "local",
    jobId: "jobId",
    developer: "@dfst",
    repo: "simple-example",
    task: "example",
    userId: "userId",
    args: Math.ceil(Math.random() * 100).toString(),
    metadata: "simple-example",
    txNumber: 1,
    timeCreated,
    timeCreatedString: new Date(timeCreated).toISOString(),
    timeStarted: timeCreated,
    jobStatus: "started",
    maxAttempts: 0,
  } as JobData;
  console.log("job:", job);
  const cloud = new LocalCloud({ job, chain: "local" });
 
  // Zipping and moving
  const zipFileName = await zipAndMoveProject(job.repo).catch(console.error);
  const currentDir = await unzipAndInstallDependencies(job.repo).catch(console.error);

  console.log("Importing worker from:", currentDir);
  const zkcloudworker = await import(currentDir);
  console.log("Getting zkCloudWorker object...");

  const worker = await zkcloudworker[functionName](cloud);
  console.log("Executing job...");
  const result = await worker.execute();
  console.log("Job result:", result);
}

async function zipAndMoveProject(projectName: any) {
  const sourceDir = path.join(__dirname, `../${projectName}`);
  const targetDir = path.join(__dirname, '../../folder2');
  const zipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(sourceDir, zipFileName);
  const filePath = path.join(sourceDir, projectName)

  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath);
    console.log(`Existing zip file deleted: ${zipFilePath}`);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Existing zip file deleted: ${filePath}`);
  }

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  const streamFinished = new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);
  });

  archive.pipe(output);

  archive.glob('**/*', {
    cwd: sourceDir,
    ignore: ['node_modules/**', 'yarn.lock']
  });

  await archive.finalize();
  await streamFinished;

  const newZipPath = path.join(targetDir, zipFileName);
  fs.renameSync(zipFilePath, newZipPath);

  console.log(`Zip file moved to: ${newZipPath}`);
  return zipFileName
}

async function unzipAndInstallDependencies(projectName: any): Promise<string> {
  const targetDir = path.join(__dirname, '../../folder2');
  const unzipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(targetDir, unzipFileName);
  const extractPath = path.join(targetDir, projectName);

  try {
    await fs.createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();

    console.log(`File unzipped to: ${extractPath}`);

    process.chdir(extractPath);
    const currentDir = process.cwd()
    console.log(`Current directory: ${process.cwd()}`);

    console.log('Installing dependencies...');
    execSync('yarn', { stdio: 'inherit' });

    console.log('Dependencies installed successfully.');

    return currentDir.toString()
  } catch (error) {
    console.log(error)
  }

  
}

main().catch((error) => {
  console.error(error);
});
