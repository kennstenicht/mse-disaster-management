import Ember from 'ember';


const {
  View,
  inject,
  on
} = Ember;

export default View.extend({
  classNames: ['application'],

  tuio: inject.service('tuio'),

  didInsertElement: function() {
    this.get('tuio').setupClient();
  },

  touchStart: function(e) {

  },

  touchMove: function(e) {

  },

  touchEnd: function(e) {

  },

  onAddLence: on('addLence', function(object) {
    this.get('controller').set('lence'+object.symbolId+'.active', true);
  }),

  onRemoveLence: on('removeLence', function(object) {
    this.get('controller').set('lence'+object.symbolId+'.active', false);
  }),

  onUpdateLence: on('updateLence', function(object) {
    var screenW = $(window).width();
    var screenH = $(window).height();

    this.get('controller').set('lence'+object.symbolId+'.point.x', object.getScreenX(screenW));
    this.get('controller').set('lence'+object.symbolId+'.point.y', object.getScreenY(screenH));
  })
});