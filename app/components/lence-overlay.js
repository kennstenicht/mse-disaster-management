import Ember from 'ember';

const {
  Component,
  observer,
  $,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['lence-overlay'],

  didInsertElement: function() {
    this.setPosition();
    $( ".lence-overlay" ).resizable({
      handles: "e, s, se",
    })
    .on('resize', bind(this, function() {
      this.get('map').resize();
    }))
    .on('resizestop', bind(this, function(event, ui) {
      this.get('settings')
        .set('width', ui.size.width)
        .set('height', ui.size.height)
      .save();
    }));
  },

  setPosition: observer('settings.posY', 'settings.posX', 'settings.angle', function() {
    this.$().css({
      'top': this.get('settings.posY'),
      'left': this.get('settings.posX'),
      'width': this.get('settings.width'),
      'height': this.get('settings.height'),
      'transform': 'rotate('+this.get('settings.angle')+'rad)',
    });
    this.get('map').resize();
  }),

  actions: {
    setMap: function(map) {
      this.set('map', map);
    }
  }
});
