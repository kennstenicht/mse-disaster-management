import DS from 'ember-data';

export default DS.Model.extend({
  taskName:     DS.attr('string'),
  unit:         DS.hasMany('unit')
});
