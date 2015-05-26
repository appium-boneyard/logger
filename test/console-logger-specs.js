// transpile:mocha

import './clear-npm-cache.js';

import sinon from 'sinon';
import chai from 'chai';
chai.should();
import { resetLogger, configureLogger, getLogger } from '../lib/logger';
import utils from '../lib/utils';
import { EOL } from 'os';

describe('console logger', () => {
  let log;
  describe('basic', () => {
    before(() => {
      resetLogger();
      sinon.spy(process.stdout, 'write');
      configureLogger({console: {}});
      log = getLogger();
    });

    after(() => {
      process.stdout.write.restore();
    });

    it('should log at all levels', () => {
      log.silly('silly content');
      process.stdout.write.calledWith('silly'.cyan + ': silly content' + EOL).should.be.ok;
      log.verbose('verbose content');
      process.stdout.write.calledWith('verbose'.cyan + ': verbose content' + EOL).should.be.ok;
      log.info('info content');
      process.stdout.write.calledWith('info'.cyan + ': info content' + EOL).should.be.ok;
      log.http('http content');
      process.stdout.write.calledWith('http'.cyan + ': http content' + EOL).should.be.ok;
      log.warn('warn content');
      process.stdout.write.calledWith('warn'.cyan + ': warn content' + EOL).should.be.ok;
      log.error('error content');
      // npmlog adds a space before and a newline after error messages
      process.stdout.write.calledWith('error'.cyan + ': error content' + EOL).should.be.ok;
    });
  });
  describe('global no colors', () => {
    before(() => {
      resetLogger();
      sinon.spy(process.stdout, 'write');
      configureLogger({colored: false, console: {}});
      log = getLogger();
    });

    after(() => {
      process.stdout.write.restore();
    });

    it('should be black and white', () => {
      log.silly('silly content');
      process.stdout.write.calledWith('silly: silly content' + EOL).should.be.ok;
    });
  });
  describe('utc timestamp', () => {
    before(() => {
      resetLogger();
      sinon.spy(process.stdout, 'write');
      sinon.spy(utils, 'utcTimeStamp');
      configureLogger({console: { timestamp: true }});
      log = getLogger();
    });

    after(() => {
      process.stdout.write.restore();
      utils.utcTimeStamp.restore();
    });

    it('should prepend timestamp', () => {
      log.silly('something');
      utils.utcTimeStamp.calledOnce.should.be.ok;
      utils.stripColors(process.stdout.write.getCall(0).args[0]).should.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3} - silly: something/);
    });
  });
  describe('local timestamp', () => {
    before(() => {
      resetLogger();
      sinon.spy(process.stdout, 'write');
      sinon.spy(utils, 'localTimeStamp');
      configureLogger({console: { timestamp: 'local' }});
      log = getLogger();
    });

    after(() => {
      process.stdout.write.restore();
      utils.localTimeStamp.restore();
    });

    it('should prepend timestamp', () => {
      log.silly('something');
      utils.localTimeStamp.calledOnce.should.be.ok;
      utils.stripColors(process.stdout.write.getCall(0).args[0]).should.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3} - silly: something/);
    });
  });
  describe('higher loglevel', () => {
    before(() => {
      resetLogger();
      sinon.spy(process.stdout, 'write');
      configureLogger({console: { loglevel: 'warn' }});
      log = getLogger();
    });

    after(() => {
      process.stdout.write.restore();
    });

    it('should print warnings', () => {
      log.warn('something');
      process.stdout.write.calledWith('warn'.cyan + ': something' + EOL).should.be.ok;
    });

    it('should not print debug', () => {
      log.debug('something');
      process.stdout.write.calledWith('debug'.cyan + ': something' + EOL).should.not.be.ok;
    });
  });
});

