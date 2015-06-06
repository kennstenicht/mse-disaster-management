import Ember from 'ember';

export default Ember.Service.extend({
  availableIn: ['controllers', 'components'],
  client: null,

  setupClient: function() {
    var client = new Tuio.Client({
        host: "http://localhost:5000"
    });
    client.connect();
    this.set('client', client);
  }
});


    //client.on("addTuioCursor", onAddTuioCursor);
    //client.on("updateTuioCursor", onUpdateTuioCursor);
    //client.on("removeTuioCursor", onRemoveTuioCursor);
    //client.on("addTuioObject", onAddTuioObject);
    // client.on("updateTuioObject", function() {
//       console.log("trigger");
//     });
    //client.on("removeTuioObject", onRemoveTuioObject);
    //client.on("refresh", onRefresh);
    // client.connect();