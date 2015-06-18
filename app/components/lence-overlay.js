import Ember from 'ember';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  classNames: ['lence-overlay'],

  setPosition: observer('settings.posY', 'settings.posX', function() {
    this.$().css({'top': this.get('settings.posY'), 'left': this.get('settings.posX')});
  })
});
