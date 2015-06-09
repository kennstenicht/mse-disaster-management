import Ember from 'ember';
import Tuio from 'mse-disaster-management/mixins/tuio';


const {
  View,
  on
} = Ember;

export default View.extend(Tuio, {
  classNames: ['application'],

  onAddLence: on('addLence', function(object) {
    this.get('controller').set('lence'+object.symbolId+'.active', true);
  }),

  onRemoveLence: on('removeLence', function(object) {
    this.get('controller').set('lence'+object.symbolId+'.active', false);
  }),

  onUpdateLence: on('updateLence', function(object) {
    var screenW = $(window).width();
    var screenH = $(window).height();

    this.get('controller').set('lence'+object.symbolId+'.point.x', object.getScreenX(screenW));
    this.get('controller').set('lence'+object.symbolId+'.point.y', object.getScreenY(screenH));
  })
});