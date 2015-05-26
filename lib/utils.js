import moment from 'moment';

export default {
  utcTimeStamp: () => {
    return moment().utc().format("YYYY-MM-DD hh:mm:ss:SSS");
  },
  localTimeStamp: () => {
    return moment().format("YYYY-MM-DD hh:mm:ss:SSS");
  },
  stripColors: (s) => {
    var code = /\u001b\[(\d+(;\d+)*)?m/g;
    return s.replace(code, '');
  }
};
