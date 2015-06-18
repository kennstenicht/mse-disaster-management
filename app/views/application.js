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
    this.get('controller').send('addLence', object);
  },

  removeLence: function(e) {
    var object = e.originalEvent.detail;
    this.get('controller').send('removeLence', object);
  },

  updateLence: function(e) {
    var object = e.originalEvent.detail;
    this.get('controller').send('updateLence', object);
  }
});