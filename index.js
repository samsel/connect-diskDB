'use strict';

var debug = require('debuglog')('connect:diskdb'),
    DiskDB = require('diskdb'),
    _ = require('lodash'),
    DiskDBStore;

module.exports = function (connect) {

    var Store = connect.Store;

    DiskDBStore = function DiskDBStore (options) {
        options = options || {};
        Store.call(this, options);
        this.db = options.db || DiskDB.connect(options.path, [options.name])[options.name];
        this.prefix = this.prefix || 'sess:';
    };

    /**
    * Inherit from `Store`.
    *
    */
    DiskDBStore.prototype.__proto__ = Store.prototype;

    /**
    * Attempt to fetch session by the given `sessionId`.
    *
    * @param {String} sessionId
    * @param {Function} callback
    * @api public
    */
    DiskDBStore.prototype.get = function (sessionId, callback) {
        sessionId = this.prefix + sessionId;
        debug('GET "%s"', sessionId);
        var data = this.db.findOne({
            sessionId:sessionId
        });
        debug('GOT %j', data);
        callback(null, data);
    };

    /**
    * Commit the given `session` object associated with the given `sessionId`.
    *
    * @param {String} sessionId
    * @param {Session} session
    * @param {Function} callback
    * @api public
    */
    DiskDBStore.prototype.set = function (sessionId, session, callback) {
        sessionId = this.prefix + sessionId;
        debug('SET "%s" : %j', sessionId, session);
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
    DiskDBStore.prototype.destroy = function(sessionId, callback) {
        debug('DESTROY %s', sessionId);
        sessionId = this.prefix + sessionId;
        callback(null, this.db.remove({
            sessionId:sessionId
        }, false));
    };  

    return DiskDBStore;
};