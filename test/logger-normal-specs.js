// transpile:mocha

import { getDynamicLogger, restoreWriters, setupWriters,
         assertOutputContains } from './helpers';

describe('logger', () => {
  let writers, log;
  before(() => {
    writers = setupWriters();
    log = getDynamicLogger(false);
    log.level = 'silly';
  });

  after(() => {
    restoreWriters(writers);
  });

  it('should not rewrite log levels outside of testing', () => {
    log.silly('silly');
    assertOutputContains(writers, 'silly');
    log.verbose('verbose');
    assertOutputContains(writers, 'verbose');
    log.info('info');
    assertOutputContains(writers, 'info');
    log.http('http');
    assertOutputContains(writers, 'http');
    log.warn('warn');
    assertOutputContains(writers, 'warn');
    log.error(null, 'error');
    // npmlog adds a space before and a newline after error messages
    assertOutputContains(writers, ' error\n');
  });
});

