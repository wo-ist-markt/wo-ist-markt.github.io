'use strict';

/*
 * Node module with development utilities for wo-ist-markt.
 */

/* jslint node: true */

var e = module.exports = {};


var fs = require('fs');


/*
 * Wrap a callback-style async function in a Promise.
 *
 * `f` is an async function that takes a callback as the last parameter. It
 * is called inside a newly created Promise with the arguments from the list
 * `args` (the callback argument is automatically added). If `f` returns an
 * error (by calling the callback with a first, true argument) then the promise
 * is rejected. Otherwise it is resolved with the value passed to the callback
 * by `f`.
 *
 * If `f` calls the callback with two or more values (excluding the error flag)
 * then the promise is resolved with a list of these values. If `f` calls the
 * callback with a single value then the Promise is resolved with that value.
 * Finally, if `f` calls the callback with just the error flag then the Promise
 * is resolved with `undefined`.
 *
 * Returns the promise.
 */
e.promisify = function(f, args) {
    return new Promise((resolve, reject) => {
        args = args.slice();
        args.push(function (err /* , args */) {
            // Cannot be an arrow function, since those don't have `arguments`
            if (err) {
                reject(err);
            } else {
                switch (arguments.length) {
                    case 1:
                        resolve(undefined);
                        break;
                    case 2:
                        resolve(arguments[1]);
                        break;
                    default:
                        resolve(Array.prototype.slice.call(arguments, 1));
                }
            }
        });
        f.apply(f, args);
    });
};


/*
 * Load JSON from a file.
 *
 * Returns a promise that resolves to the parsed JSON data.
 */
e.loadJSON = function(filename) {
    return e.promisify(fs.readFile, [filename])
        .then(data => JSON.parse(data));
};


/*
 * Write data to a file as JSON.
 *
 * Returns a promise that resolves to the filename when the data has been
 * written.
 */
e.saveJSON = function(data, filename) {
    return e.promisify(fs.writeFile, [filename, JSON.stringify(data)])
        .then(value => filename);
};


/*
 * Make sure that a directory exists.
 *
 * If the directory doesn't exist it is created. If it already exists nothing
 * is done.
 *
 * Returns a promise that resolves to the directory's path once the directory
 * exists.
 */
e.ensureDir = function(dirname) {
    return e.promisify(fs.mkdir, [dirname])
        .catch(err => {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        })
        .then(value => dirname);
};

