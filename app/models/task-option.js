import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  string: DS.attr('string'),
  string_start: DS.attr('string')
});
