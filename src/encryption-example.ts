import path from "path";
import { PrivateKey, PublicKey } from "o1js";
import config from "../deploy.config";
import { LocalCloud, JobData } from "zkcloudworker";

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
    args: undefined, // using param 'encrypedPayload' when execute()
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
  const localCloud = new LocalCloud({ job, chain: "local", localWorker: zkcloudworker });

  // create some client address, this will be done by 
  // the web API when calling a worker
  const clientSecret = PrivateKey.random();
  const clientAddress = clientSecret.toPublicKey().toBase58();
  console.log("Cliente address ", clientAddress);

  // create the worker instance and bind it to this client
  const worker = await zkcloudworker(localCloud, clientAddress);
  console.log("Created worker instance ", worker);

  // get the worker's public key so we can encrypt the payload
  const workerAddress = worker.getAddress();
  console.log("Worker address: ", workerAddress);

  // encrypt the  payload 
  const encryptedPayload = worker.encrypt(
    JSON.stringify({ value: Math.ceil(Math.random() * 100).toString() }),
    workerAddress
  );
  console.log("Encrypted payload: ", encryptedPayload);

  // now we can execute 
  console.log("Executing job...");
  const encryptedResult = await worker.execute(encryptedPayload);

  // decrypt the received result, using the client private key
  const result = worker.decrypt(
    encryptedResult,
    clientSecret.toBase58()
  )
  console.log("Decrypted result: ", result)
}
