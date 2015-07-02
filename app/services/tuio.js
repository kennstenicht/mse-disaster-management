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

    const symbolMap = {
      0: 'Lence',
      1: 'Lence',
      2: 'Lence',
      35: 'MapController'
    };

    client.on('addTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'add');
      if (fn) {
        var event = this.createCustomEvent(fn, object);
        this.getElement(object).dispatchEvent(event);
      }
    }));

    client.on('updateTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'update');

      if (fn) {
        var event = this.createCustomEvent(fn, object);
        this.getElement(object).dispatchEvent(event);
      }
    }));

    client.on('removeTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'remove');

      if (fn) {
        var event = this.createCustomEvent(fn, object);
        this.getElement(object).dispatchEvent(event);
      }
    }));

    client.on('addTuioCursor', bind(this, function(cursor) {
      var event = this.createMouseEvent("mousedown", cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));

    client.on('updateTuioCursor', bind(this, function(cursor) {
      var event = this.createMouseEvent('mousemove', cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));

    client.on('removeTuioCursor', bind(this, function(cursor) {
      var event = this.createMouseEvent('mouseup', cursor);
      this.getElement(cursor).dispatchEvent(event);
    }));
  },

  createMouseEvent: function(name, cursor) {
    return event = new MouseEvent(name, {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'screenX': this.getScreenX(cursor.xPos),
      'screenY': this.getScreenY(cursor.yPos),
      'clientX': this.getClientX(cursor.xPos),
      'clientY': this.getClientY(cursor.yPos),
      'target': this.getElement(cursor),
      detail: cursor.sessionId
    });
  },

  createCustomEvent: function(name, object) {
    object.screenX = this.getScreenX(object.xPos);
    object.screenY = this.getScreenY(object.yPos);
    object.clientX = this.getClientX(object.xPos);
    object.clientY = this.getClientY(object.yPos);

    return event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: object
    });
  },

  getElement: function(cursor) {
    return document.elementFromPoint(
      this.getClientX(cursor.xPos),
      this.getClientY(cursor.yPos)
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