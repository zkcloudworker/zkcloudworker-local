import path from "path";
import {
  zipAndMoveProject,
  unzipAndInstallDependencies,
} from "./file-management";
import { LocalCloud, JobData } from "zkcloudworker";

export async function main(args: string[]) {
  const repo = args[0]; // "simple-example"
  const projectDirPath = args[1]; // "folder10";

  console.log("Building zkCloudWorker code...");
  const currDir = process.cwd();
  const sourceDir = path.dirname(currDir);
  //const targetDir = path.join(path.dirname(sourceDir), projectDirPath);
  const targetDir = path.join(path.dirname(currDir), projectDirPath);
  console.log(`Source repo: ${path.join(sourceDir, repo)}`);
  console.log(`Target dir: ${targetDir}`);

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
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
