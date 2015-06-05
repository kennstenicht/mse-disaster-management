import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

var db = new PouchDB('mse-database');
// var remote = new PouchDB('http://127.0.0.1:5984/mse-database');

// db.sync(remote, {
//    live: true,   // do a live, ongoing sync
//    retry: true   // retry if the conection is lost
// });

export default Adapter.extend({
  db: db
});