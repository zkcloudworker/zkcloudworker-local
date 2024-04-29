import path from "path";
import { PrivateKey, PublicKey, initializeBindings } from "o1js";
import { LocalCloud, JobData } from "zkcloudworker";
import config from "../deploy.config";
import { listen } from "./nats-client"

async function startNATSClient() {
  // create some client address, this will be done by 
  // the web API BEFORE calling a worker
  const clientSecret = PrivateKey.random();
  let clientAddress = clientSecret.toPublicKey().toBase58();
  console.log("Cliente address ", clientAddress);

   // now subscribe and listen in this Address
   // we use the 'zkcw' prefix for zkCloudWorkers subscriptions
  await listen(`zkcw:${clientAddress}`);

  return clientAddress;
}

async function runWorker(workerDir: string, clientAddress: string) {
  const functionName = "zkcloudworker";
  const timeCreated = Date.now();
  const job: JobData = {
    id: "local",
    jobId: "jobId",
    developer: "@dfst",
    repo: "simple-example",
    task: "example",
    userId: "userId",
    args: clientAddress, // using param 'encrypedPayload' when execute()
    metadata: "encryption-example",
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
  const localCloud = new LocalCloud({ 
    job, 
    chain: "local", 
    localWorker: zkcloudworker 
  });

  // create the worker instance and bind it to this client
  const worker = await zkcloudworker(localCloud);
  console.log("Created worker instance ", worker);

  // now we can execute 
  console.log("Executing job...");
  const encryptedResult = await worker.execute();

  return encryptedResult;
}

export async function run(args: string[]) {
  const projectDir = path.join(config.workersDir, args[0]);
  console.log("Executing zkCloudWorker "+projectDir);
  const currDir = process.cwd();
  const workerDir = path.join(path.dirname(currDir), projectDir);
  console.log(`Worker dir: ${workerDir}`);

  // start a NATS client to simulate the web API calling the worker
  // the caller web API instance will have a unique publicKey 
  let clientAddress = await startNATSClient();

  // we call the worker sending the caller's publicKey 
  // the worker will use it to send messages to the web API instance
  // and will encrypt responses from the worker to the web API instance
  let encryptedResult = await runWorker(workerDir, clientAddress); 

  console.log("Encrypted result: ", encryptedResult);
}
