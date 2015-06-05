import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['task-item'],

  didInsertElement: function() {
    this.$().css({'top': this.get('anchor').y, 'left': this.get('anchor').x});
    this.$().attr('tabindex',0);
    this.$().focus();
  },

  actions: {
    createTask: function() {
      this.sendAction('addTaskShape');
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    }
  },

  keyUp: function (e) {
    e.preventDefault();
    e.stopPropagation();

    const keyMap = {
      27: 'cancelTask',
      13: 'createTask'
    };
    let fn = keyMap[event.keyCode];

    if (fn) {
      this.send(fn);
    }
  }
});
