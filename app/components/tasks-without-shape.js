import Ember from 'ember';
import Notify from 'ember-notify';

const {
  Component,
  computed,
  observer,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['tasks-without-shape'],
  parentId: '0',



  actions: {
    addShapeToTask: function(value) {
      console.log('jaja');
      this.sendAction('addShapeToTask', value);
    }
  }
});
