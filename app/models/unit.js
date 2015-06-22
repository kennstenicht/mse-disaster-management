import DS from 'ember-data';

export default DS.Model.extend({
  name:       DS.attr('string'),
  taskList:   DS.hasMany('task-list'),
  task:       DS.hasMany('task'),
});