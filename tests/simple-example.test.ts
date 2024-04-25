import path from "path";
import { LocalCloud, Cloud, JobData, zkCloudWorker } from "zkcloudworker";
import config from "../deploy.config";
import { deployWorker } from "../src/deployWorker";

describe('Deploy and run `simple-example`', () => {
  
  const exampleRepo = 'simple-example';
  let workersDir: string | void = "";
  let zkcloudworker: any;
  let localCloud: any;

  beforeAll(async () => {});

  it('deploys the simple-example', async () => {
    workersDir = await deployWorker([exampleRepo], config);;    
  });

  it('import the worker', async () => {
    // const currDir = process.cwd();
    // const projectDir = path.join(config.workersDir, exampleRepo);
    // const workersDir = path.join(currDir, projectDir);
    console.log("Importing worker factory from:", workersDir);
    console.log("this should expose a 'createWorker() method");
    const example = await import(workersDir!);
    zkcloudworker = example.zkcloudworker;
  });

  it('create `local` context', async () => {
    console.log("Getting zkCloudWorker object...");
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
    console.log("Job:", JSON.stringify(job, null, 2));

    localCloud = new LocalCloud({ 
      job, 
      chain: "local", 
      localWorker: zkcloudworker 
    });
  });

  it('execute method on worker', async () => {
    const worker = await zkcloudworker(localCloud);
    console.log("Executing job...");
    const result = await worker.execute();
  });
});
