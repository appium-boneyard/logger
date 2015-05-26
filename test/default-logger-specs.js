// transpile:mocha

import './clear-npm-cache.js';

import sinon from 'sinon';
import chai from 'chai';
chai.should();
import { getLogger, resetLogger } from '../lib/logger';
import { EOL } from 'os';
import 'colours';

describe('default logger', () => {
  let log;
  before(() => {
    resetLogger();
    sinon.spy(process.stdout, 'write');
    log = getLogger();
  });

  after(() => {
    process.stdout.write.restore();
  });

  it('should log at all levels', () => {
    log.silly('silly content');
    process.stdout.write.calledWith('silly'.cyan + ': silly content' + EOL).should.be.ok;
    log.debug('debug content');
    process.stdout.write.calledWith('debug'.cyan + ': debug content' + EOL).should.be.ok;
    log.verbose('verbose content');
    process.stdout.write.calledWith('verbose'.cyan + ': verbose content' + EOL).should.be.ok;
    log.info('info content');
    process.stdout.write.calledWith('info'.cyan + ': info content' + EOL).should.be.ok;
    log.http('http content');
    process.stdout.write.calledWith('http'.cyan + ': http content' + EOL).should.be.ok;
    log.warn('warn content');
    process.stdout.write.calledWith('warn'.cyan +  ': warn content' + EOL).should.be.ok;
    log.error('error content');
    // npmlog adds a space before and a newline after error messages
    process.stdout.write.calledWith('error'.cyan + ': error content' + EOL).should.be.ok;
  });
});

