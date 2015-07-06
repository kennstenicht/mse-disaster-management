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
            raw: 'Die Aufgabe <b>"Das '+task.get('actions.string_start')+' '+task.get('location')+' muss '+task.get('actions.string')+' werden"</b> wurde ohne Geoposition hinzugefügt.',
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

    addShapeToTask: function() {
      console.log('check action');
    }
  }
});
