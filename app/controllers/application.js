import Ember from 'ember';
import Notify from 'ember-notify';


const {
  Controller,
  observer,
  run: {
    bind
  }
} = Ember;

export default Controller.extend({
  // init: function() {
  //    var model = this.store.createRecord('task-option', {
  //      title: 'Erste Hilfe leisten',
  //    });
  //    model.save();
  // },

  tasksWithoutShape: observer('tasks.@each', function() {
    if(this.get('tasks')) {
      this.get('tasks').filter(bind(this, function(task) {
        if(!task.get('geoPoints')) {
          Notify.info({
            raw: 'Die Aufgabe <b>'+task.get('actions.string')+' '+task.get('location')+'"</b> wurde ohne Geoposition hinzugefügt.',
            closeAfter: null,
            action: 'addShapeToTask',
            value: task
          });
        }
      }));
    }
  }),

  actions: {
    addLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', true).save();
    },

    removeLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence.set('active', false).save();
    },

    updateLence: function(object) {
      var lence = this.get('maps').filterBy('markerId', object.symbolId).objectAt(0);
      lence
        .set('posX', object.clientX)
        .set('posY', object.clientY)
      .set('angle', object.angle);
    },

    reloadWindow: function() {
      document.location.reload(true);
    }
  }
});
