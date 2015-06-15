import Ember from 'ember';

const {
  Mixin,
  String: {
    fmt
  },
  run: {
    bind
  }
} = Ember;


export default Mixin.create({
  didInsertElement: function() {
    // Get a reference to the canvas object
    var drawingArea = this.$('.draw-overlay__drawing-area').get(0);
    drawingArea.width = this.$().innerWidth();
    drawingArea.height = this.$().innerHeight();

    // Create an paperjs project
    paper.setup(drawingArea);
    paper.settings.handleSize = 10;

    // Setup Tool for paperjs
    this.set('tool', new paper.Tool() );

    // Trigger Paperjs Events
    this.get('tool').onMouseDown = bind(this, this.onMouseDown);
    this.get('tool').onMouseDrag = bind(this, this.onMouseDrag);
    this.get('tool').onMouseUp = bind(this, this.onMouseUp);
  },

  onMouseDown: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Down');
    this.trigger(fn, e);
  },

  onMouseUp: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Up');
    this.trigger(fn, e);
  },

  onMouseDrag: function(e) {
    let fn = fmt(this.get('paperMode')+"%@", 'Drag');
    this.trigger(fn, e);
  },
});
