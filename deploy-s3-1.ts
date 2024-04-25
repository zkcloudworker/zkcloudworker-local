import config from "./deploy.config";
import { deployWorkerToS3 } from "./src/deployWorkerToS3";

/**
 * @param repo - the source code repo name
 * @param targetDir - the folder where we will deploy the worker
 */
deployWorkerToS3(process.argv.slice(2), config).catch((error) => {
  console.error(error);
});
