export default function () {

  //the DOM event will be all lowercase (doubletap)
  //the Ember event will be camelCase (doubleTap)
  //the key in this.Recognizers will be SnakeCase (DoubleTap)

  this.recognize({

    name : 'doubleTap', //always camelCase this

    gesture : 'tap', //the base Hammer recognizer to use

    tune : { //the settings to pass to the recognizer, event will be added automatically
      taps : 2
    },

    'with' : ['tap'], //an array of recognizers to recognize with.

    without : [] //an array of recognizers that must first fail
  });

}