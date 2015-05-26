import { default as log } from './logger';
import  logRotateStream  from 'logrotate-stream';
import { PassThrough } from 'stream';

let fileStream = logRotateStream({ file: './appium.log', size: '1G' });

log.enableColor();
log.stream = new PassThrough();
log.stream.pipe(process.stdout);
log.stream.pipe(fileStream);

log.info("hi!");

