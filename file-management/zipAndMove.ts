import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function zipAndMoveProject(
  projectName: any,
  _sourceDir: any,
  _targetDir: any,
) {
  const sourceDir = path.join(_sourceDir);
  const globDir = path.join(sourceDir, `./${projectName}`);
  const targetDir = path.join(_targetDir);
  const zipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(sourceDir, zipFileName);
  const filePath = path.join(targetDir, projectName);
  const targetZipPath = path.join(targetDir, zipFileName)

  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath);
    console.log(`Existing zip file deleted: ${zipFilePath}`);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Existing zip file deleted: ${filePath}`);
  }

  if (fs.existsSync(targetZipPath)) {
    fs.unlinkSync(targetZipPath);
    console.log(`Existing zip file deleted: ${targetZipPath}`)
  }

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const streamFinished = new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
  });

  archive.pipe(output);

  await archive.glob("**/*", {
    cwd: globDir,
    ignore: ["node_modules/**", "yarn.lock"],
  });

  await new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
    archive.finalize();
  });

  await streamFinished;
  const newZipPath = path.join(targetDir, zipFileName);
  fs.renameSync(zipFilePath, newZipPath);

  console.log(`Zip file moved to: ${newZipPath}`);
  return zipFileName;
}
