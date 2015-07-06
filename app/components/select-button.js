import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNames: ['select-button','cancel-drag'],
  classNameBindings: ['isSelected:select-button--active'],

  isSelected: computed('buttonId', 'selected', function() {
    if(this.get('buttonId') === this.get('selected')) {
      return true;
    }
  }),

  tap: function() {
    this.set('selected', this.get('buttonId'));
    this.sendAction('callback', this.get('buttonId'));
    return false;
  }
});
