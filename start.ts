import path from "path";
import {
  zipAndMoveProject,
  unzipAndInstallDependencies,
} from "./file-management";
import { LocalCloud, JobData } from "zkcloudworker";
import { execSync } from "child_process";

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

  const projectDirPath = "folder2";
  const currDir = process.cwd();
  const sourceDir = path.dirname(currDir);
  const targetDir = path.join(path.dirname(sourceDir), projectDirPath)

  console.log("Folder1:  ", sourceDir)
  console.log("Folder2: ", targetDir)

  // Zipping and moving
  const zipFileName = await zipAndMoveProject(
    job.repo,
    sourceDir,
    targetDir,
  ).catch(console.error);
  const currentDir = await unzipAndInstallDependencies(job.repo, targetDir).catch(
    console.error,
  );

  console.log("Importing worker from:", currentDir);
  const zkcloudworker = await import(currentDir);
  console.log("Getting zkCloudWorker object...");

  const worker = await zkcloudworker[functionName](cloud);
  console.log("Executing job...");
  const result = await worker.execute();
  console.log("Job result:", result);
}

main().catch((error) => {
  console.error(error);
});
