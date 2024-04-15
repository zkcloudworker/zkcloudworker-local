# zkCloudWorker : local development

## Installation

You need to install node and git
and clone this repo and simple-example repo:

```
git clone https://github.com/zkcloudworker/zkcloudworker-local
git clone https://github.com/zkcloudworker/simple-example
cd simple-example
yarn
cd ../zkcloudworker-local
yarn
```

## Deploy the example

From the zkcloudworker-local folder, run:
```
yarn deploy simple-example
```

The output will be:
~~~
Building zkCloudWorker code...
Source repo: ../simple-example
Target dir: ../workers/simple-example
Existing target dir deleted: ../workers/simple-example
Existing target zip file deleted: ../workers/simple-example.zip
Zip file moved to: ../workers/simple-example.zip
File unzipped to: ../workers/simple-example
Current directory: ../workers/simple-example
Installing dependencies...
➤ YN0000: · Yarn 4.1.1
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + @types/jest@npm:29.5.12, jest@npm:29.7.0, o1js@npm:0.17.0, ts-jest@npm:29.1.2, and 373 more.
➤ YN0000: └ Completed in 3s 25ms
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed in 0s 252ms
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed in 0s 739ms
➤ YN0000: · Done in 4s 73ms
Dependencies installed successfully.
Worker deployed to: ../workers/simple-example
~~~

## Running the example

From the zkcloudworker-local folder, run:
```
yarn start simple-example
```

The output would be:
~~~
Importing worker from: ../workers/simple-example
Getting zkCloudWorker object...
Executing job...
Job: {
  "id": "local",
  "jobId": "jobId",
  "developer": "@dfst",
  "repo": "simple-example",
  "task": "example",
  "userId": "userId",
  "args": "73",
  "metadata": "simple-example",
  "txNumber": 1,
  "timeCreated": 1713195925847,
  "timeCreatedString": "2024-04-15T15:45:25.847Z",
  "timeStarted": 1713195925847,
  "jobStatus": "started",
  "maxAttempts": 0
}
LocalCloud: Generating the proof for value 85
LocalCloud: Verification result: true
Job result: {
  "publicInput": [],
  "publicOutput": [],
  "maxProofsVerified": 0,
  "proof": "KChzdGF0ZW1l...KSkp"
}
~~~

## Config options

The file `deploy.config.ts` contains the deploy options:

- `installScript`: the script that it will use to install the worker dependencies. You can use your preferred package mgr command: `yarn install`, `pnpm install`or `npm install`. 
    Note that it is now configured to use `yarn`.
- `workersDir`: the folder (relative to your working dir) where we will locally deploy the workers.
  Note that it is now configured to use `workers` so the worker will be created in this folder.




