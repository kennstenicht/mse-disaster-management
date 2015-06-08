import Ember from 'ember';


const {
  Service
} = Ember;

export default Service.extend({
  availableIn: ['controllers', 'components'],
  client: null,

  setupClient: function() {
    var client = new Tuio.Client({
        host: "http://localhost:5000"
    });
    client.connect();
    this.set('client', client);
  },
});