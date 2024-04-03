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

## Running the example

From the zkcloudworker-local folder, run:

```
yarn start
```

## Log

```
zkcloudworker-local % yarn start
executing zkCloudWorker code...
job: {
  id: 'local',
  jobId: 'jobId',
  developer: '@dfst',
  repo: 'simple-example',
  task: 'example',
  userId: 'userId',
  args: '51',
  metadata: 'simple-example',
  txNumber: 1,
  timeCreated: 1712167994172,
  timeCreatedString: '2024-04-03T18:13:14.172Z',
  timeStarted: 1712167994172,
  jobStatus: 'started',
  maxAttempts: 0
}
Importing worker from: ../simple-example
Getting zkCloudWorker object...
Executing job...
LocalCloud: Generating the proof for value 51
LocalCloud: Verification result: true
Job result: {
  "publicInput": [],
  "publicOutput": [],
  "maxProofsVerified": 0,
  "proof": "KChzdGF0ZW1lbnQoKHByb29mX3N0YXRlKChkZWZlcnJlZF92YWx1ZXMoKHBsb25rKChhbHBoYSgo...
  DUzOThEMjQ1NEJEMEFGOUY0QjZBNjI4RTIyRjFGQjk3NjA3Q0E5QkVBMjcpKSkpKSkp"
}

```
