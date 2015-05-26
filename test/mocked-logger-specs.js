// transpile:mocha

import './clear-npm-cache.js';

import sinon from 'sinon';
import chai from 'chai';
chai.should();
import { getMockedLogger } from '../lib/logger';

describe('mocked logger', () => {
  let log;
  let channels = ['stdout', 'stderr'];
  before(() => {
    for(let ch of channels){
      sinon.spy(process[ch], 'write');
    }
    log = getMockedLogger();
  });

  after(() => {
    for(let ch of channels){
      process[ch].write.restore();
    }
  });

  it('should rewrite npmlog levels during testing', () => {
    const text = 'hi';
    log.silly(text);
    log.verbose(text);
    log.info(text);
    log.http(text);
    log.warn(text);
    log.error(text);
    for(let ch of channels){
      process[ch].write.called.should.not.be.ok;
    }
  });
});

