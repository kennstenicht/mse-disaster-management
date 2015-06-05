import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  title       : DS.attr('string'),
  isActive    : DS.attr('boolean')
});