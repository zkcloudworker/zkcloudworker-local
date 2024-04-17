import config from "./deploy.config"
import { deployWorker } from "./src/deployWorker";

/**
 * @param repo - the source code repo name 
 * @param targetDir - the folder where we will deploy the worker
 */
deployWorker(process.argv.slice(2), config).catch((error) => {
  console.error(error);
});
