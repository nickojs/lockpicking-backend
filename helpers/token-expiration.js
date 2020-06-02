const moment = require('moment');

const expirationDates = () => {
  const startTime = moment();
  const expiresIn = moment().add(1, 'hour'); // 1 hour from now
  const diff = moment.duration(expiresIn.diff(startTime));

  const timeDiff = {
    seconds: diff.get('seconds'),
    hours: diff.get('hours')
  };

  const timeSulfix = {
    hours: timeDiff.hours > 1 ? 'hours' : 'hour',
    seconds: timeDiff.seconds > 1 ? 'seconds' : 'second'
  };

  const dateLimits = {
    init: startTime.format(),
    expiration: expiresIn.format()
  };

  return [dateLimits, timeDiff, timeSulfix];
};

module.exports = expirationDates;
