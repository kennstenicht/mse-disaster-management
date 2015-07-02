import Ember from 'ember';
import Notify from 'ember-notify';

const {
  Component,
  computed,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['task-item'],
  classNameBindings: ['isLarge:task-item--large'],
  units: [],
  category: null,
  taskName: null,
  isLarge: false,


  didInsertElement: function() {
    this.set('targetX', this.get('shape.anchor').x);
    this.set('targetY', this.get('shape.anchor').y);
    this.$().css({
      'top': this.get('shape.anchor').y,
      'left': this.get('shape.anchor').x
    });

    this.setIndicator();

    this.$().draggable({
      cancel: ".cancel-drag"
    });
    this.$().on('drag', bind(this, this.setIndicator));

    this.$().attr('tabindex', 0);
    this.$().focus();

    if(this.get('selectedFeature')) {
      console.log('check');
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        this.set('selectedPriority', task.get('priority'));
        this.set('selectedOption', task.get('taskOption.id'));
      });
    }

  },

  taskOptions: computed(function() {
    return this.store.all('task-option');
  }),

  task: computed('selectedFeature', function() {
    if(this.get('selectedFeature')){
      return this.store.find('task', this.get('selectedFeature.layer.id') );
    }
  }),

  setIndicator: function() {
    var posX = this.$().position().left,
        posY = this.$().position().top,
        width = this.$().outerWidth(),
        height = this.$().outerHeight(),
        targetX = this.get('targetX'),
        targetY = this.get('targetY');

     if(posY+(height/2) > targetY) {
       this.set('position', 'top');
       this.set('shape.anchor.x', posX+(width/2));
       this.set('shape.anchor.y', posY-12);
     } else {
       this.set('position', 'bottom');
       this.set('shape.anchor.x', posX+(width/2));
       this.set('shape.anchor.y', posY+height+12);
     }
  },

  actions: {
    selectUnit: function(unit) {
      this.get('units').push(unit);
    },

    selectCatgory: function(category) {
      this.set('category', category);
    },

    selectTaskName: function(taskName) {
      this.set('taskName', taskName);
    },

    createTask: function() {
      var task = this.store.createRecord('task', {
        description: '',
        priority: this.get('selectedPriority'),
        progress: 0,
        location: "Gate A1/A2",
        timestamp: moment().format('DD.MM.YYYY HH:mm:ss'),
        date: moment().format('x'),
        status: 'new',
        parent: '0',
        geoPoints: this.get('shape.geoPoints'),
        layerType: this.get('shape.layerType'),
        sourceType: this.get('shape.sourceType'),
      });
      task.save();

      this.store.find('task-option', this.get('selectedOption') ).then( (taskOption) => {
        task.set('taskOption', taskOption).save();
      });

      this.sendAction('removeTaskShape');
      Notify.success({
        raw: 'Die neue Aufgabe wurde <b>erfolgreich</b> erstellt und gespeichert.',
        closeAfter: 6000
      });
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
      Notify.alert({
        raw: 'Der Vorgang wurde <b>abgebrochen</b>!',
        closeAfter: 6000
      });
    },

    saveTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.set('geoPoints', this.get('shape.geoPoints')).save();
        task.set('priority', this.get('selectedPriority')).save();

        this.store.find('task-option', this.get('selectedOption') ).then( (taskOption) => {
          task.set('taskOption', taskOption).save();
        });

        // TODO add title and Co
        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Alle Informationen wurden in der Datenbank <b>gespeichert</b>.',
          closeAfter: 6000
        });
      });
    },

    deleteTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.destroyRecord();

        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Die Aufgabe wurde erfolgreich <b>gelöscht</b>.',
          closeAfter: 6000
        });
      });
    },

    addShape: function() {
      this.store.find('task', this.get('selectedAddShape.id') ).then((task) => {
        task.set('geoPoints', this.get('shape.geoPoints')).save();
        task.set('layerType', this.get('shape.layerType')).save();
        task.set('sourceType', this.get('shape.sourceType')).save();

        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Die Geoposition wurde der Aufgabe <b>hinzugefügt</b>.',
          closeAfter: 6000
        });
      });
    },

    toggleSize: function() {
      this.toggleProperty('isLarge');
      this.setIndicator();
    }
  },

  keyUp: function (e) {
    e.preventDefault();
    e.stopPropagation();
    var keyMap;

    if(this.get('taskMode') === "newTask") {
      keyMap = {
        27: 'cancelTask',
        13: 'createTask'
      };
    } else if(this.get('taskMode') === "editTask") {
      keyMap = {
        27: 'deleteTask',
        13: 'saveTask'
      };
    } else if(this.get('taskMode') === "addShape"){
      keyMap = {
        27: 'deleteTask',
        13: 'addShape'
      };
    }

    let fn = keyMap[event.keyCode];

    if (fn) {
      this.send(fn);
    }
  }
});
