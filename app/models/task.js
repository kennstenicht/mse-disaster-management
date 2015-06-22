import DS from 'ember-data';

export default DS.Model.extend({
  title:        DS.attr('string'),
  description:  DS.attr('string'),
  sourceType:   DS.attr('string'),
  layerType:    DS.attr('string'),
  geoPoints:    DS.attr('array'),
  points:       DS.attr('array'),
  subtask:      DS.hasMany('subtask'),
  units:        DS.hasMany('unit'),
  category:     DS.attr('string'),
  taskName:     DS.attr('string'),
  status:       DS.attr('string'),
  progress:     DS.attr('number'),
  priority:     DS.attr('string')
});