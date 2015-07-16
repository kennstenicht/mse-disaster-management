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
  },

  tap: function(e) {
    var e = e.originalEvent.gesture.pointers[0];
    $('.application').append('<div class="pointer" style="top: '+e.pageY+'px; left: '+e.pageX+'px; display:none;"></div>');
    $('.pointer').fadeIn(100).fadeOut(100, function() {
      $('.pointer').remove();
    });
  },

  press: function(e) {
    var e = e.originalEvent.gesture.pointers[0];
    $('.application').append('<div class="pointer pointer--press" style="top: '+e.pageY+'px; left: '+e.pageX+'px; display:none;"></div>');
    $('.pointer').fadeIn(100).fadeOut(100, function() {
      $('.pointer').remove();
    });
  }
});