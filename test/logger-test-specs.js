// transpile:mocha

import { getDynamicLogger, restoreWriters, setupWriters,
         assertOutputDoesntContain } from './helpers';

describe('test logger', () => {
  let writers, log;
  before(() => {
    writers = setupWriters();
    log = getDynamicLogger(true);
  });

  after(() => {
    restoreWriters(writers);
  });

  it('should rewrite npmlog levels during testing', () => {
    const text = 'hi';
    log.silly(text);
    log.verbose(text);
    log.info(text);
    log.http(text);
    log.warn(text);
    log.error(text);
    (() => { log.errorAndThrow(text); }).should.throw(text);
    assertOutputDoesntContain(writers, text);
  });
});
