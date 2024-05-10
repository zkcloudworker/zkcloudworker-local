import { zkCloudWorkerClient } from "zkcloudworker";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTkwMzQ5NDYiLCJpYXQiOjE3MDEzNTY5NzEsImV4cCI6MTczMjg5Mjk3MX0.r94tKntDvLpPJT2zzEe7HMUcOAQYQu3zWNuyFFiChD0";

async function main() {
  const api = new zkCloudWorkerClient({
    jwt: JWT,
    chain: "local",
  });

  /* package.json
    "name": "zkcloudworker-local",
    "version": "0.1.1",
    "author": "DFST",
  */

  const result = await api.deploy({
    repo: "simple-example", //  name from package.json
    developer: "DFST", // author from package.json
    packageManager: "yarn", // npm or yarn, probably also from package.json
  });

  console.log("deploy job", result);
  const jobId = result.jobId;
  if (jobId === undefined) {
    console.log("No jobId found in result");
    return;
  }
  if( jobId.success === false ) {

    const waitResult = await api.waitForJobResult({ jobId });
    console.log("deploy result", waitResult);
  }
}

main().catch((error) => {
  console.error(error);
});