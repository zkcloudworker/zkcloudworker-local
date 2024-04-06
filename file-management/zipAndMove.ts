import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function zipAndMoveProject(projectName: any) {
  const sourceDir = path.join(__dirname, `../${projectName}`);
  const targetDir = path.join(__dirname, "../../folder2");
  const zipFileName = `${projectName}.zip`;
  const zipFilePath = path.join(sourceDir, zipFileName);
  const filePath = path.join(sourceDir, projectName);

  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath);
    console.log(`Existing zip file deleted: ${zipFilePath}`);
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Existing zip file deleted: ${filePath}`);
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

  archive.glob("**/*", {
    cwd: sourceDir,
    ignore: ["node_modules/**", "yarn.lock"],
  });

  await archive.finalize();
  await streamFinished;

  const newZipPath = path.join(targetDir, zipFileName);
  fs.renameSync(zipFilePath, newZipPath);

  console.log(`Zip file moved to: ${newZipPath}`);
  return zipFileName;
}
