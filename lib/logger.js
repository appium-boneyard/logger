import npmlog from 'npmlog';

const npmLevels = ['silly', 'verbose', 'info', 'http', 'warn', 'error'];
let mockLog = {};
for (let l of npmLevels) {
  mockLog[l] = () => {};
}

export function getLogger () {
  const testingMode = parseInt(process.env._TESTING, 10) === 1;
  const forceLogMode = parseInt(process.env._FORCE_LOGS, 10) === 1;
  return (testingMode && !forceLogMode) ? mockLog :
                                          (global._global_npmlog || npmlog);
}

const log = getLogger();

export default log;
