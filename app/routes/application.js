import Ember from 'ember';

const {
  Route,
  observer,
  run: {
    bind
  }
} = Ember;

export default Route.extend({
  model: function() {
    return Em.RSVP.hash({
      maps: this.store.find('map'),
      tasks: this.store.find('task'),
      tasksOptions: this.store.find('task-option')
    });
  },

  setupController: function(controller, models) {
    this.controllerFor('application').set('maps', models.maps);
    this.controllerFor('application').set('tasks', models.tasks);
  }
});