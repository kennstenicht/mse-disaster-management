import DS from 'ember-data';

const {
  computed
} = Ember;

export default DS.Model.extend({
  title:        DS.attr('string'),
  description:  DS.attr('string'),
  priority:     DS.attr('number'),
  progress:     DS.attr('number'),
  timestamp:    DS.attr('string'),
  date:         DS.attr('string'),
  status:       DS.attr('string'),
  unit:         DS.attr('string'),
  parent:       DS.attr('string'),
  sourceType:   DS.attr('string'),
  layerType:    DS.attr('string'),
  geoPoints:    DS.attr('array'),
  location:     DS.attr('string'),
  taskOption:   DS.belongsTo('task-option')
});