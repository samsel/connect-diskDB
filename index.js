'use strict';

var Store = require('express-session').Store,
    DiskDB = require('diskdb'),
    _ = require('lodash'),
    DiskDBSessionStore;

DiskDBSessionStore = module.exports = function DiskDBSessionStore (options) {
    options = options || {};

    this.db = DiskDB.connect(options.path, [options.db]);
    this.prefix = this.prefix || 'session';
    Store.call(this, options);
};

/**
* Inherit from `Store`.
*
*/
//DiskDBSessionStore.prototype.__proto__ = Store.prototype;

/**
* Attempt to fetch session by the given `sid`.
*
* @param {String} sid
* @param {Function} fn
* @api public
*/
DiskDBSessionStore.prototype.get = function (sid, fn) {
    sid = this.prefix + sid;
    fn(null, this.db.findOne({sid:sid}));
};

/**
* Commit the given `sess` object associated with the given `sid`.
*
* @param {String} sid
* @param {Session} sess
* @param {Function} fn
* @api public
*/
DiskDBSessionStore.prototype.set = function (sid, sess, fn) {
    sid = this.prefix + sid;
    fn(null, this.db.update({sid: sid}, _.extend({sid: sid}, sess), {upsert: true}));
};

/**
* Destroy the session associated with the given `sid`.
*
* @param {String} sid
* @api public
*/
DiskDBSessionStore.prototype.destroy = function(sid, fn) {
    sid = this.prefix + sid;
    fn(null, this.db.remove({sid:sid}, false));
};