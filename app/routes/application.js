import Ember from 'ember';

const {
  Route,
  observer,
  run: {
    bind
  }
} = Ember;

export default Route.extend({
  beforeModel: function() {
    return this.store.find('map').then((maps) => {
      this.controllerFor('application').set('maps', maps);
    });
  },

  model: function() {
    return this.store.find('task').then((tasks) => {
      this.controllerFor('application').set('tasks', tasks);
    });
  },

  afterModel: function() {
    return this.store.find('task-option');
  }
});