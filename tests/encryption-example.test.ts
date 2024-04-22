/**
 * TODO: This test does not yet pass due to some diffs between jest and tsx.
 * Run `yarn start encryption-example` instead of this test.
 */

// import { describe, expect, it } from "@jest/globals";
import path from "path";
import { PrivateKey, PublicKey } from "o1js";
import { LocalCloud, Cloud, JobData } from "zkcloudworker";
import config from "../deploy.config";
import { deployWorker } from "../src/deployWorker";

//const exampleRepo = 'encryption-example';
const exampleRepo = 'encryption-example';
let workersDir: string | void = "";
let zkcloudworker: any;
let localCloud: any;

describe('Deploy `encryption-example`', () => {
  beforeAll(async () => {});

  it('deploys the repo', async () => {
    workersDir = await deployWorker([exampleRepo], config);
  });
});

describe('Run the `encryption-example`', () => {
  beforeAll(async () => {});

  it('import and execute method on worker', async () => {
    console.log("Executing zkCloudWorker code...");
    const projectDir = path.join(config.workersDir, exampleRepo);
    const currDir = process.cwd();
    const workerDir = path.join(path.dirname(currDir), projectDir);
    console.log(`Worker dir: ${workerDir}`);

    console.log("Importing worker from:", workerDir);
    const { zkcloudworker } = await import(workerDir);
    console.log("Getting zkCloudWorker object...");
    
    const functionName = "zkcloudworker";
    const timeCreated = Date.now();
    const job: JobData = {
      id: "local",
      jobId: "jobId",
      developer: "@dfst",
      repo: "simple-example",
      task: "example",
      userId: "userId",
      args: undefined, // using param 'encrypedPayload' when execute()
      metadata: "simple-example",
      txNumber: 1,
      timeCreated,
      timeCreatedString: new Date(timeCreated).toISOString(),
      timeStarted: timeCreated,
      jobStatus: "started",
      maxAttempts: 0,
    } as JobData;
  
    const localCloud = new LocalCloud({ job, chain: "local", localWorker: zkcloudworker });
  
    // create some client address, this will be done by 
    // the web API when calling a worker
    const clientSecret = PrivateKey.random();
    const clientAddress = clientSecret.toPublicKey().toBase58();
  
    // create the worker instance and bind it to this client
    const worker = await zkcloudworker(localCloud, clientAddress);
  
    // get the worker's public key so we can encrypt the payload
    const workerAddress = worker.getAddress();
  
    // encrypt the  payload 
    const encryptedPayload = worker.encrypt(
      JSON.stringify({ value: Math.ceil(Math.random() * 100).toString() }),
      workerAddress
    );
  
    // now we can execute 
    console.log("Executing job...");
    const encryptedResult = await worker.execute(encryptedPayload);
  
    // decrypt the received result, using the client private key
    const result = worker.decrypt(
      encryptedResult,
      clientSecret.toBase58()
    )
    console.log("Result: ", result)
  });
});
