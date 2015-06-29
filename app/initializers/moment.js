import moment from 'moment';

export function initialize() {
  moment.locale('de');
}

export default {
  name: 'momentjs',
  after: 'store',
  initialize: initialize
};
