import TuioService from 'mse-disaster-management/services/tuio';

export default {
  name: 'tuio-service',

  initialize: function(container, application) {
    application.register('service:tuio', TuioService);
  }
};

