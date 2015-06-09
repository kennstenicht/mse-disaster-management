import Ember from 'ember';


const {
  Mixin,
  inject,
  on,
  $,
  Evented: {
    trigger
  },
  run: {
    bind
  }
} = Ember;

export default Mixin.create({
  tuio: inject.service('tuio'),

  initializeTuio: on('init', function() {
    this.set('windowW', $(window).width());
    this.set('windowH', $(window).height());

    this.get('tuio').setupClient();
    var client = this.get('tuio').client;

    const symbolMap = {
      0: 'Lence',
      1: 'Lence',
      2: 'Lence',
      35: 'MapController'
    };

    client.on('addTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'add');

      if (fn) {
        this.trigger(fn, object);
      }
    }));

    client.on('updateTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'update');

      if (fn) {
        this.trigger(fn, object);
      }
    }));

    client.on('removeTuioObject', bind(this, function(object) {
      let fn = Ember.String.fmt("%@"+symbolMap[object.symbolId], 'remove');

      if (fn) {
        this.trigger(fn, object);
      }
    }));

    client.on('addTuioCursor', bind(this, function(cursor) {
      this.trigger('addTuioCursor', cursor);
    }));

    client.on('updateTuioCursor', bind(this, function(cursor) {
      this.trigger('updateTuioCursor', cursor);
    }));

    client.on('removeTuioCursor', bind(this, function(cursor) {
      this.trigger('removeTuioCursor', cursor);
    }));

    client.on('refresh', bind(this, function() {
      // this.trigger('refresh');
    }));
  }),

  getX: function(point) {
    return Math.round( point * this.get('windowW') );
  },

  getY: function(point) {
    return Math.round( point * this.get('windowH') );
  }
});