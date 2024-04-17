import path from "path";
import {
  zipAndMoveProject,
  unzipAndInstallDependencies,
} from "./file-management";
import { LocalCloud, JobData } from "zkcloudworker";

export async function deployWorker(
  args: string[], 
  config: any
): Promise<string | void> {
  const repo = args[0]; // "simple-example"
  const projectDirPath = args[1] || path.join(config.workersDir);

  console.log("Building zkCloudWorker code...");
  const currDir = process.cwd();
  const sourceDir = path.dirname(currDir);
  const targetDir = path.join(sourceDir, projectDirPath);
  console.log(`Source repo: ${path.join(sourceDir, repo)}`);
  console.log(`Target dir: ${targetDir}/${repo}`);

  // Zipping and moving
  const zipFileName = await zipAndMoveProject(
    repo,
    sourceDir,
    targetDir,
  ).catch(console.error);

  const currentDir = await unzipAndInstallDependencies(
    repo,
    targetDir,
  ).catch(console.error);

  console.log(`Worker deployed to: ${currentDir}`)
  return currentDir;
}
