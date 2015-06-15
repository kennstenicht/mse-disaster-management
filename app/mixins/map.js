import Ember from 'ember';

const {
  Mixin,
  inject,
  computed
} = Ember;


export default Mixin.create({
  mapboxGl: inject.service('mapboxGl'),
  map: computed(function() {
    return this.get('mapboxGl').maps[
      this.get('mapId')
    ];
  }),
});
