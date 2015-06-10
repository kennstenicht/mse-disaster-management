import Ember from 'ember';


const {
  Service,
  $,
  run: {
    bind
  }
} = Ember;

export default Service.extend({
  availableIn: ['controllers', 'components'],
  client: null,

  setupClient: function() {
    this.set('windowW', $(window).width());
    this.set('windowH', $(window).height());

    var client = new Tuio.Client({
        host: "http://localhost:5000"
    });
    client.connect();

    client.on('addTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent('touchstart', cursor);
      $(event.target).trigger(event);
    }));

    client.on('updateTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent('touchmove', cursor);
      $(event.target).trigger(event);
    }));

    client.on('removeTuioCursor', bind(this, function(cursor) {
      var event = this.createEvent('touchend', cursor);
      $(event.target).trigger(event);
    }));

    this.set('client', client);
  },

  createEvent: function(name, cursor) {
    var event = $.Event(name);
    var element = document.elementFromPoint(
      this.getPageX(cursor.xPos),
      this.getPageX(cursor.yPos)
    );

    event.pageX = this.getPageX(cursor.xPos);
    event.pageY = this.getPageY(cursor.yPos);
    event.offsetX = this.getOffsetX(element, cursor.xPos);
    event.offsetY = this.getOffsetY(element, cursor.yPos);
    event.target = element;
    event.data = cursor;
    event.bubble = true;
    event.sid = cursor.sessionId;

    return event;
  },

  getPageX: function(point) {
    return Math.round( point * this.get('windowW') );
  },

  getPageY: function(point) {
    return Math.round( point * this.get('windowH') );
  },

  getOffsetX: function(element, point) {
    return this.getPageX(point) - $(element).offset().left;
  },

  getOffsetY: function(element, point) {
    return this.getPageY(point) - $(element).offset().top;
  }
});