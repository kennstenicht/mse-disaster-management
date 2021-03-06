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
  actions:      DS.belongsTo('task-option'),

  excerpt: computed('description', function() {
    var excerpt = this.get('description').substring(0, 70)
    if(this.get('description').length > 70) {
      excerpt += "...";
    }
    return excerpt;
  }),

  excerpt_short: computed('description', function() {
    var excerpt = this.get('description').substring(0, 20);
    if(this.get('description').length > 20) {
      excerpt += "...";
    }
    return excerpt;
  })
});