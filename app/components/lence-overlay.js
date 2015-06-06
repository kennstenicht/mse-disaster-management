import Ember from 'ember';

const {
  Component,
  observer
} = Ember;

export default Component.extend({
  classNames: ['lence-overlay'],
  classNameBindings: ['settings.active:lence-overlay--active'],

  setPosition: observer('settings.point.x', 'settings.point.y', function() {
    this.$().css({'top': this.get('settings.point.y'), 'left': this.get('settings.point.x')});
  })
});
