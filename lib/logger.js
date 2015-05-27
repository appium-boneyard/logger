import npmlog from 'npmlog';

const npmLevels = ['silly', 'verbose', 'debug', 'info', 'http', 'warn', 'error'];
let mockLog = {};
for (let l of npmLevels) {
  mockLog[l] = () => {};
}

export function patchLogger(logger) {
  if (!logger.debug) {
    logger.addLevel('debug', 1000, { fg: 'blue', bg: 'black' }, 'dbg');
  }
}

function _getLogger () {
  const testingMode = parseInt(process.env._TESTING, 10) === 1;
  const forceLogMode = parseInt(process.env._FORCE_LOGS, 10) === 1;
  let logger = (testingMode && !forceLogMode) ? mockLog :
    (global._global_npmlog || npmlog);
  patchLogger(logger);
  return logger;
}

export function getLogger(prefix=null) {
  let logger = _getLogger();
  let wrappedLogger = {};
  Object.defineProperty(wrappedLogger, 'level', {
    get: function() { return logger.level; },
    set: function(newValue) { logger.level = newValue; },
    enumerable: true,
    configurable: true
  });
  for(let k of npmLevels) {
    wrappedLogger[k] = logger[k].bind(logger, prefix);
  }
  return wrappedLogger;
}

const log = getLogger();

export default log;
