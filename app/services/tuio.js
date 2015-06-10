import Ember from 'ember';


const {
  Service,
  $,
  run: {
    bind
  }
} = Ember;

export default Service.extend({
  setupClient: function() {
    var client = new Tuio.Client({
        host: "http://localhost:5000"
    });
    client.connect();

    client.on('addTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent("mousedown", cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));

    client.on('updateTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent('mousemove', cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));

    client.on('removeTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent('mouseup', cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));
  },

  createEvent: function(name, cursor) {
    return event = new MouseEvent(name, {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'screenX': this.getScreenX(cursor.xPos),
      'screenY': this.getScreenY(cursor.yPos),
      'clientX': this.getClientX(cursor.xPos),
      'clientY': this.getClientY(cursor.yPos),
      'target': this.getElement(cursor)
    });
  },

  getElement: function(cursor) {
    return document.elementFromPoint(
      this.getClientX(cursor.xPos),
      this.getClientX(cursor.yPos)
    );
  },

  getClientX: function(point) {
    return Math.round( point * $(window).width() );
  },

  getClientY: function(point) {
    return Math.round( point * $(window).height() );
  },

  getScreenX: function(point) {
    return Math.round( point * screen.width );
  },

  getScreenY: function(point) {
    return Math.round( point * screen.height );
  }
});