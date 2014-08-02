'use strict';

var DiskDB = require('diskdb'),
    _ = require('lodash'),
    DiskDBSessionStore;

module.exports = function (connect) {

    var Store = connect.Store;

    DiskDBSessionStore = function DiskDBSessionStore (options) {
        options = options || {};

        this.db = DiskDB.connect(options.path, [options.name])[options.name];
        this.prefix = this.prefix || 'session';
        Store.call(this, options);
    };

    /**
    * Inherit from `Store`.
    *
    */
    DiskDBSessionStore.prototype.__proto__ = Store.prototype;

    /**
    * Attempt to fetch session by the given `sessionId`.
    *
    * @param {String} sessionId
    * @param {Function} callback
    * @api public
    */
    DiskDBSessionStore.prototype.get = function (sessionId, callback) {
        sessionId = this.prefix + sessionId;
        callback(null, this.db.findOne({
            sessionId:sessionId
        }));
    };

    /**
    * Commit the given `session` object associated with the given `sessionId`.
    *
    * @param {String} sessionId
    * @param {Session} session
    * @param {Function} callback
    * @api public
    */
    DiskDBSessionStore.prototype.set = function (sessionId, session, callback) {
        sessionId = this.prefix + sessionId;
        callback(null, this.db.update(
            {sessionId: sessionId}, 
            _.extend({sessionId: sessionId}, session), 
            {upsert: true}
        ));
    };

    /**
    * Destroy the session associated with the given `sessionId`.
    *
    * @param {String} sessionId
    * @api public
    */
    DiskDBSessionStore.prototype.destroy = function(sessionId, callback) {
        sessionId = this.prefix + sessionId;
        callback(null, this.db.remove({
            sessionId:sessionId
        }, false));
    };  

    return DiskDBSessionStore;
};