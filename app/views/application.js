import Ember from 'ember';

const {
  View,
  inject
} = Ember;

export default View.extend({
  classNames: ['application'],
  tuio: inject.service('tuio'),

  didInsertElement: function() {
    var self = this
    this.get('tuio').client.on("addTuioObject", function(object) {
      if ([0,1,2].indexOf(object.symbolId) != '-1') {
        self.send('addLence', object);
      }
    });

    this.get('tuio').client.on("updateTuioObject", function(object) {
      if ([0,1,2].indexOf(object.symbolId) != '-1') {
        self.send('moveLence', object);
      }
    });

    this.get('tuio').client.on("removeTuioObject", function(object) {
      if ([0,1,2].indexOf(object.symbolId) != '-1') {
        self.send('removeLence', object);
      }
    });

    this.get('tuio').client.on("addTuioCursor", function(object) {
      console.log('touch');
      //self._create_event('touchstart', touch, {});
    });
  },

  actions: {
    addLence: function(object) {
      this.get('controller').set('lence'+object.symbolId+'.active', true);
      this.send('moveLence', object);
    },

    removeLence: function(object) {
      this.get('controller').set('lence'+object.symbolId+'.active', false);
    },

    moveLence: function(object) {
      var screenW = $(window).width();
      var screenH = $(window).height();

      this.get('controller').set('lence'+object.symbolId+'.point.x', object.getScreenX(screenW));
      this.get('controller').set('lence'+object.symbolId+'.point.y', object.getScreenY(screenH));
    }
  }
});