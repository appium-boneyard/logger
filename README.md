appium-logger
===================

[![Build Status](https://travis-ci.org/appium/logger.svg?branch=master)](https://travis-ci.org/appium/logger)
[![Coverage Status](https://coveralls.io/repos/appium/logger/badge.svg?branch=master)](https://coveralls.io/r/appium/logger?branch=master)

Basic logger defaulting to `npmlog` with special consideration for running
tests (doesn't output logs when run with `_TESTING=1` in the env).

```js
import { getLogger } from 'appium-logger';
let log = getLogger('mymodule');
log.info("hi!");
```
