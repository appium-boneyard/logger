import chai from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { getLogger } from '../lib/logger';
chai.should();

function setupWriters () {
  return {'stdout': sinon.spy(process.stdout, 'write'),
          'stderr': sinon.spy(process.stderr, 'write')};
}

function getDynamicLogger (testingMode) {
  process.env._TESTING = testingMode ? '1' : '0';
  return getLogger();
}

function restoreWriters (writers) {
  for (let w of _.values(writers)) {
    w.restore();
  }
}

function assertOutputContains (writers, output) {
  let someoneHadOutput = false;
  for (let w of _.values(writers)) {
    if (w.calledWith) {
      someoneHadOutput = w.calledWith(output);
      if (someoneHadOutput) break;
    }
  }
  if (!someoneHadOutput) {
    throw new Error("Expected someone to have been called with: '" + output + "'");
  }
}

function assertOutputDoesntContain (writers, output) {
  for (let w of _.values(writers)) {
    _.flatten(w.args).should.not.contain(output);
  }
}

export { setupWriters, restoreWriters, assertOutputContains,
         assertOutputDoesntContain, getDynamicLogger };
