import path from "path";
import {
  zipAndMoveProject,
  unzipAndInstallDependencies,
} from "./file-management";
import { LocalCloud, JobData } from "zkcloudworker";

export async function deployWorkerToS3(config: any): Promise<string | void> {
  const repo = "simple-example";
  const projectDirPath = path.join(config.workersDir);

  console.log("Building zkCloudWorker code...");
  const currDir = process.cwd();
  const sourceDir = path.dirname(currDir);
  const targetDir = path.join(sourceDir, projectDirPath);
  console.log(`Source repo: ${path.join(sourceDir, repo)}`);
  console.log(`Target dir: ${targetDir}/${repo}`);

  // Zipping and moving
  const zipFileName = await zipAndMoveProject(repo, sourceDir, targetDir).catch(
    console.error
  );

  console.log(`Zip file created: ${zipFileName}`);
  /*
  const currentDir = await unzipAndInstallDependencies(repo, targetDir).catch(
    console.error
  );

  console.log(`Worker deployed to: ${currentDir}`);
  */
  return zipFileName;
}
