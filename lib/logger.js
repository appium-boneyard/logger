import npmlog from 'npmlog';
import split from 'split';
import _ from 'lodash';
import { PassThrough } from 'stream';
import { EOL } from 'os';
import utils from './utils';

const DEFAULT_CONFIG = {
  loglevel: 'silly',
  colored: true,
  console: {}
};

function getLinePatcher(streamOpts) {
  return function(line) {
    if(streamOpts.timestamp === 'local') {
      line = utils.localTimeStamp() + ' - ' + line;
    } else if(streamOpts.timestamp) {
      line = utils.utcTimeStamp() + ' - ' + line;
    }
    return line + EOL;
  };
}

function getLineSkipper(loglevel, streamOpts) {
  return function(line) {
    if(!streamOpts.loglevel) {
      return false;
    }
    let m = utils.stripColors(line).match(/([\w\!]+):\s/);
    return npmlog.levels[m[1]] < npmlog.levels[streamOpts.loglevel];
  };
}

function wrapLogger(logger) {
  // removes the prefix field
  // TODO: next major release, make use of prefix field
  var wrappedLog = {};
  for (let l of _.keys(logger.levels)) {
    /*jshint loopfunc: true */
    wrappedLog[l] = function (...args) {
      args.unshift(null);
      return logger[l](...args);
    };
  }
  return wrappedLog;
}

export function configureLogger (opts) {
  opts = _.clone(opts);
  _.defaults(opts, _.pick(DEFAULT_CONFIG, 'loglevel', 'colored'));
  // {
  //   console: {
  //     timestamp: true
  //     colors: true
  //     loglevel: true
  //   },
  //   file: {
  //   }
  // }
  // opts.logTimestamp
  // opt.logColors
  // opts.logFile
  // opt.logLevels
  //
  //

  // adding debug level similar to verbose
  npmlog.addLevel('debug', 1000, { fg: 'blue', bg: 'black' }, 'debug');

  // not using fancy line headers
  for(let k of _.keys(npmlog.disp)) {
    if(opts.colored) {
      npmlog.disp[k] = k.cyan + ':';
    } else {
      npmlog.disp[k] = k + ':';
    }
  }
  npmlog.level = opts.loglevel;
  npmlog.disableColor(); // using homecook coloring while simulating winston style
  npmlog.stream = new PassThrough();
  npmlog.stream.setEncoding('utf8');
  if(opts.console) {
    let skipLine = getLineSkipper(opts.loglevel, opts.console);
    let patchLine = getLinePatcher(opts.console);
    npmlog.stream
      .pipe(split())
      .on('data', (line) => {
        if(skipLine(line)) { return; }
        line = patchLine(line);
        process.stdout.write(line);
      });
  }
}

export function resetLogger() {
  configureLogger(DEFAULT_CONFIG);
}

export function getLogger () {
  return wrapLogger(global._global_npmlog || npmlog);
}

export function getMockedLogger() {
  let mockLog = {};
  for (let l of _.keys(npmlog.levels)) {
    mockLog[l] = () => {};
  }
  return mockLog;
}

resetLogger();
