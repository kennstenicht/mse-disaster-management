import Ember from 'ember';

export default Ember.Route.extend({
  lences: function() {

  },

  actions: {
    addLence: function(id) {
      this.controllerFor('application').toggleProperty('lence'+id+'.active');
    },

    moveLence: function() {
      var selected = this.store.all('lences').filterBy('zoom');
      console.log(selected);
    }
  }
});