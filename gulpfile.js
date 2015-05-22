"use strict";

var gulp = require('gulp'),
    boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp);

boilerplate({
  build: 'appium-logger',
  jscs: false,
  testReporter: process.env.TRAVIS ? 'spec' : 'nyan'
});
