import DS from 'ember-data';

export default DS.Model.extend({
  title:        DS.attr('string'),
  description:  DS.attr('string'),
  sourceType:   DS.attr('string'),
  layerType:    DS.attr('string'),
  geoPoints:    DS.attr('array'),
  points:       DS.attr('array'),
  subtask:      DS.hasMany('subtask')
});