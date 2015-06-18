import Ember from 'ember';

const {
  Controller,
  computed,
  computed: {
    filterBy
  }
} = Ember;

export default Controller.extend({
  actions: {
    addLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', true).save();
      // var map = this.store.createRecord('map', {
      //   title: 'Map '+object.symbolId,
      //   lat: 51.279023,
      //   lng: 6.764510,
      //   posX: 0,
      //   posY: 0,
      //   zoom: 13,
      //   baseMap: true,
      //   active: true,
      //   markerId: object.symbolId
      // });
      // map.save();
    },

    removeLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', false).save();
    },

    updateLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence
        .set('posX', object.clientX)
        .set('posY', object.clientY);
    },
  }
});
