"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Hidmin API starts here.
 * @author Johan Svensson
 */
var express_1 = __importDefault(require("express"));
var init_1 = __importDefault(require("./db/init"));
var _db;
exports.db = function () { return _db; };
var app = express_1.default();
var config = {
    port: 8003
};
init_1.default().then(function (db) {
    _db = db;
    app.listen(config.port, function () { return console.log("API listening on port " + config.port + "!"); });
});
/**
 * Accepts any request but returns a 405 response if the method mismatches.
 */
var handleWith405 = function (req, res, method, handler) {
    if (req.method.toLowerCase() != method) {
        //  Method not allowed
        return res.status(405).end();
    }
    return handler(req, res);
};
/**
 * Accepts any requests but returns a 405 response if the method mismatches.
 * @param handlers An object of handlers mapped to their respective method, e.g. { "post": require(...) }
 */
var handleMultipleWith405 = function (req, res, handlers) {
    var methods = Object.keys(handlers);
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        if (req.method == method) {
            return handlers[method];
        }
    }
    return res.status(405).end();
};
var baseApiUrl = "/api";
app.all(baseApiUrl + "/game/token", function (req, res) { return handleWith405(req, res, 'post', require('./post/token')); });
app.all(baseApiUrl + "/score", function (req, res) { return handleMultipleWith405(req, res, {
    'post': require('./post/score'),
    'delete': require('./delete/score')
}); });
