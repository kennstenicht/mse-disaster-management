import Ember from 'ember';


const {
  Mixin,
  $
} = Ember;

export default Mixin.create({
  getWidth: function(element) {
    if(element) {
      return $(element).width();
    } else {
      this.$().innerWidth();
    }
  },

  getHeight: function(element) {
    if(element) {
      return $(element).height();
    } else {
      this.$().innerHeight();
    }
  }
});