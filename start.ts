import path from "path";
import { LocalCloud, JobData } from "zkcloudworker";

export async function main(args: string[]) {
  const projectDir = args[0];

  console.log("Executing zkCloudWorker code...");
  const currDir = process.cwd();
  const workerDir = path.join(path.dirname(currDir), projectDir);
  console.log(`Worker dir: ${workerDir}`);

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
  const cloud = new LocalCloud({ job, chain: "local" });

  console.log("Importing worker from:", workerDir);
  const zkcloudworker = await import(workerDir);
  console.log("Getting zkCloudWorker object...");

  const worker = await zkcloudworker[functionName](cloud);
  console.log("Executing job...");
  const result = await worker.execute();
  console.log("Job result:", result);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
