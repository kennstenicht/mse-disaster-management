import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  markerId    : DS.attr('number'),
  title       : DS.attr('string'),
  isActive    : DS.attr('boolean'),
  geoPointLat : DS.attr('number'),
  geoPointLng : DS.attr('number'),
  pointX      : DS.attr('number'),
  pointY      : DS.attr('number'),
  zoom        : DS.attr('number'),
});