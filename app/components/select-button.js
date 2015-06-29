import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['select-button'],
  classNameBindings: ['selected:select-button--active'],

  selected: false,

  click: function() {
    this.toggleProperty('selected');
    this.sendAction('callback', this.get('value'));
  }
});
