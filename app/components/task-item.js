import Ember from 'ember';

const {
  Component,
  computed,
  run: {
    bind
  }
} = Ember;

export default Component.extend({
  classNames: ['task-item'],

  didInsertElement: function() {
    this.set('targetX', this.get('shape.anchor').x);
    this.set('targetY', this.get('shape.anchor').y);
    this.$().css({
      'top': this.get('shape.anchor').y,
      'left': this.get('shape.anchor').x
    });

    this.setIndicator();

    this.$().draggable();
    this.$().on('drag', bind(this, this.setIndicator));


    this.$().attr('tabindex', 0);
    this.$().focus();
  },

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
    createTask: function() {
      console.log(this.get('shape.geoPoints'));
      var task = this.store.createRecord('task', {
        title: 'Neue Aufgabe ohne Titel',
        description: '',
        priority: 3,
        progress: 0,
        timestamp: moment().format('DD.MM.YYYY HH:mm:ss'),
        date: moment().format('x'),
        status: 'new',
        unit: 'firefighter',
        parent: '0',
        geoPoints: this.get('shape.geoPoints'),
        layerType: this.get('shape.layerType'),
        sourceType: this.get('shape.sourceType'),
      });
      task.save();

      this.sendAction('removeTaskShape');
    },

    cancelTask: function() {
      this.sendAction('removeTaskShape');
    },

    saveTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.set('geoPoints', this.get('shape.geoPoints')).save();
        this.sendAction('addTaskLayer', task);
      });

      this.sendAction('removeTaskShape');
    },

    deleteTask: function() {
      this.store.find('task', this.get('selectedFeature.layer.id') ).then( (task) => {
        task.destroyRecord()
      });
      this.sendAction('removeTaskShape');
    },

    addShape: function() {
      this.store.find('task', this.get('selectedAddShape.id') ).then((task) => {
        task.set('geoPoints', this.get('shape.geoPoints'));
        task.save();
        task.set('layerType', this.get('shape.layerType'));
        task.save();
        task.set('sourceType', this.get('shape.sourceType'));
        task.save();


        this.sendAction('removeTaskShape');
      });
    }
  },

  keyUp: function (e) {
    e.preventDefault();
    e.stopPropagation();

    const keyMap = {
      27: 'cancelTask',
      13: 'createTask'
    };
    let fn = keyMap[event.keyCode];

    if (fn) {
      this.send(fn);
    }
  }
});
