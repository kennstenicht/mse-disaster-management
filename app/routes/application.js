import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  actions: {
    setBaseMap: function(elementId) {
      this.get('controller').set('baseMap', elementId);
    }
  }
});