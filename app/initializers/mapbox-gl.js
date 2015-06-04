import MapboxGlService from 'mse-disaster-management/services/mapbox-gl';

export default {
  name: 'mapbox-gl-service',

  initialize: function(container, application) {
    application.register('service:mapboxGl', MapboxGlService);
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VubnN0ZW5pY2h0IiwiYSI6InQtOTF2NFEifQ.BA8aIiRcBFIAGV7Rry9Egw';
  }
};
