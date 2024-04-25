export default {
  // the script to install the worker dependencies 
  // installScript: 'pnpm install',
  installScript: 'echo "nodeLinker: node-modules" > .yarnrc.yml; yarn install',

  // folder where we will deploy the zipped workers, ready to be started 
  workersDir: 'workers'
}