import DS from 'ember-data';

export default DS.Model.extend({
  markerId: DS.attr('number'),
  title: DS.attr('string'),
  isActive: DS.attr('boolean'),
  lat: DS.attr('number'),
  lng: DS.attr('number'),
  posX: DS.attr('number'),
  posY: DS.attr('number'),
  zoom: DS.attr('number')
});
