import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    setBaseMap: function(elementId) {
      this.get('controller').set('baseMap', elementId);
    }
  }
});