import Ember from 'ember';

export default Ember.Route.extend({
  lences: function() {

  },

  actions: {
    createLence: function() {
      var newLence = this.store.createRecord('lences', {
        markerId: 12,
        isActive: true,
        title: "Rails is omakase",
        geoPointLat: 51.282785,
        geoPointLng: 6.762270,
        pointX: 200,
        pointY: 200,
        zoom: 16
      });

      newLence.save();
    },

    moveLence: function() {
      var selected = this.store.all('lences').filterBy('zoom');
      console.log(selected);
    }
  }
});