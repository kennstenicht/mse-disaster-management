import Ember from 'ember';


const {
  View,
  inject
} = Ember;

export default View.extend({
  classNames: ['application'],

  tuio: inject.service('tuio'),

  didInsertElement: function() {
    this.get('tuio').setupClient();
  },

  addLence: function(e) {
    var object = e.originalEvent.detail;
    this.get('controller').set('lence'+object.symbolId+'.active', true);
  },

  removeLence: function(e) {
    var object = e.originalEvent.detail;
    this.get('controller').set('lence'+object.symbolId+'.active', false);
  },

  updateLence: function(e) {
    var object = e.originalEvent.detail;
    this.get('controller').set('lence'+object.symbolId+'.point.x', object.clientX);
    this.get('controller').set('lence'+object.symbolId+'.point.y', object.clientY);
  }
});