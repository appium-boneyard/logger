appium-logger
===================

[![Build Status](https://travis-ci.org/appium/logger.svg?branch=master)](https://travis-ci.org/appium/logger)

Basic logger defaulting to `npmlog` with special consideration for running
tests (doesn't output logs when run with `_TESTING=1` in the env).

```js
import { default as log } from 'appium-logger';

log.info("hi!");
```
