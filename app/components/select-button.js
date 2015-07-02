import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  classNames: ['select-button','cancel-drag'],
  classNameBindings: ['isSelected:select-button--active'],

  isSelected: computed('id', 'selected', function() {
    if(this.get('id') === this.get('selected')) {
      return true;
    }
  }),

  click: function(e) {
    e.preventDefault();
    this.sendAction('callback', this.get('id'));
  }
});
