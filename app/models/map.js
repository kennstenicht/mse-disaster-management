import DS from 'ember-data';

export default DS.Model.extend({
  markerId: DS.attr('number'),
  title: DS.attr('string'),
  active: DS.attr('boolean'),
  baseMap: DS.attr('boolean'),
  lat: DS.attr('number'),
  lng: DS.attr('number'),
  posX: DS.attr('number'),
  posY: DS.attr('number'),
  width: DS.attr('number'),
  height: DS.attr('number'),
  angle: DS.attr('number'),
  zoom: DS.attr('number')
});
