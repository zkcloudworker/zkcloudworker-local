import path from "path";
import config from "../deploy.config";
import { LocalCloud, JobData, zkCloudWorker } from "zkcloudworker";

export async function run(args: string[]) {
  const projectDir = path.join(config.workersDir, args[0]);

  console.log("Executing zkCloudWorker "+projectDir);
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
  
  console.log("Importing worker from:", workerDir);
  const { zkcloudworker } = await import(workerDir);
  console.log("Getting zkCloudWorker object...");
  
  const cloud = new LocalCloud({ job, chain: "local", localWorker: zkcloudworker });

  const worker = await zkcloudworker(cloud);
  console.log("Executing job...");
  console.log("Job:", JSON.stringify(job, null, 2));
  const result = await worker.execute();
  console.log("Job result:", result);
}
