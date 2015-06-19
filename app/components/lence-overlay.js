import Ember from 'ember';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  classNames: ['lence-overlay'],

  didInsertElement: function() {
    this.setPosition();
  },

  setPosition: observer('settings.posY', 'settings.posX', function() {
    this.$().css({'top': this.get('settings.posY'), 'left': this.get('settings.posX')});
  })
});
