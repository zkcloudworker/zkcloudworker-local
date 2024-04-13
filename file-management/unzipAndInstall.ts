import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { execSync } from "child_process";
import config from "../deploy.config";

export async function unzipAndInstallDependencies(
  projectName: any,
  _targetDir: any,
): Promise<string> {
  const targetDir = path.join(_targetDir);
  const unzipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(targetDir, unzipFileName);
  const extractPath = path.join(targetDir, projectName);

  try {
    await fs
    .createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();
  } catch (error) {
    console.log(error)
  }
  
  console.log(`File unzipped to: ${extractPath}`);

  process.chdir(extractPath);
  const currentDir = process.cwd();
  console.log(`Current directory: ${process.cwd()}`);

  console.log("Installing dependencies...");
  execSync(config.installScript, { stdio: "inherit" });

  console.log("Dependencies installed successfully.");

  return currentDir.toString();
}
