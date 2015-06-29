import Ember from 'ember';

const {
  Controller,
  computed,
  computed: {
    filterBy
  }
} = Ember;

export default Controller.extend({
  // init: function() {
  //    var model = this.store.createRecord('task-option', {
  //      title: 'Gebiet Sichern',
  //    });
  //    model.save();
  // },

  actions: {
    addLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', true).save();
    },

    removeLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', false).save();
    },

    updateLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence
        .set('posX', object.clientX)
        .set('posY', object.clientY)
      .set('angle', object.angle);
    },
  }
});
