import Ember from 'ember';
import Notify from 'ember-notify';

const {
  Component,
  computed,
  observer,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['task-item'],
  classNameBindings: ['isLarge:task-item--large', 'modifierStatus'],
  formMode: 'overview',

  modifierStatus: computed('task.status', function() {
    if (this.get('task.status')) {
      return 'task-item--'+this.get('task.status');
    }
  }),

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
  },

  taskOptions: computed(function() {
    return this.store.all('task-option');
  }),

  task: computed('selectedFeature', 'selectedAddShape', function() {
    if(this.get('selectedFeature')) {
      return this.store.find('task', this.get('selectedFeature.layer.id') );
    }

    if(this.get('selectedAddShape')) {
      return this.get('selectedAddShape');
    }
  }),

  priorityString: computed('task.priority', function() {
    switch(this.get('task.priority')) {
      case 2:
        return "sofort";
        break;
      case 1:
        return "dringend";
        break;
      default :
        return "";
        break;
    }
  }),

  setIndicator: observer('formMode', function() {
    var posX = this.$().position().left,
        posY = this.$().position().top,
        width = this.$().outerWidth(),
        height = this.$().outerHeight(),
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
  }),

  actions: {
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
      this.get('task').then( (task) => {
        task.set('geoPoints', this.get('shape.geoPoints')).save();

        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Alle Informationen wurden in der Datenbank <b>gespeichert</b>.',
          closeAfter: 6000
        });
      });
    },

    deleteTask: function() {
      this.get('task').then( (task) => {
        task.destroyRecord();

        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Die Aufgabe wurde erfolgreich <b>gelöscht</b>.',
          closeAfter: 6000
        });
      });
    },

    addShape: function() {
      this.get('task').then((task) => {
        task.set('geoPoints', this.get('shape.geoPoints'));
        task.set('layerType', this.get('shape.layerType'));
        task.set('sourceType', this.get('shape.sourceType'));

        task.save();

        this.sendAction('removeTaskShape');
        Notify.success({
          raw: 'Die Geoposition wurde der Aufgabe erfolgreich <b>hinzugefügt</b>.',
          closeAfter: 6000
        });
      });
    },

    setFormMode: function(value) {
      this.set('formMode', value);
      return false;
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
        27: 'cancelTask',
        13: 'saveTask'
      };
    } else if(this.get('taskMode') === "addShape"){
      keyMap = {
        27: 'cancelTask',
        13: 'addShape'
      };
    }

    let fn = keyMap[event.keyCode];

    if (fn) {
      this.send(fn);
    }
  }
});
