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
    interact('.lence-overlay')
      .resizable({
        edges: { left: false, right: '.lence-overlay__right-handler', bottom: '.lence-overlay__bottom-handler', top: false }
      })
      .on('resizemove', bind(this, function (event) {
        var target = event.target;
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        this.get('map').resize();
      }))
      .on('resizeend', bind(this, function() {
        this.get('settings')
          .set('width', this.$().width())
          .set('height', this.$().height())
        .save();
      }));
  },

  setPosition: observer('settings.posY', 'settings.posX', function() {
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
