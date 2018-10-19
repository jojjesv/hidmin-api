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
var cors_1 = __importDefault(require("cors"));
var _db;
exports.db = function () { return _db; };
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
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
    console.log("Method", method, req.method);
    if (req.method.toLowerCase() != method.toLowerCase()) {
        //  Method not allowed
        return res.status(405).end(JSON.stringify({
            result: 'error',
            message: req.method + " method not allowed"
        }));
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
        var m = method.toLowerCase();
        if (req.method.toLowerCase() == m) {
            return handlers[m](req, res);
        }
    }
    return res.status(405).end(JSON.stringify({
        result: 'error',
        message: req.method + " method not allowed"
    }));
};
var baseApiUrl = "/api";
app.all(baseApiUrl + "/games", function (req, res) { return handleWith405(req, res, 'get', require('./get/games').default); });
app.all(baseApiUrl + "/game", function (req, res) { return handleWith405(req, res, 'post', require('./post/game').default); });
app.all(baseApiUrl + "/game/token", function (req, res) { return handleWith405(req, res, 'post', require('./post/token').default); });
app.all(baseApiUrl + "/score", function (req, res) { return handleMultipleWith405(req, res, {
    'post': require('./post/score').default
}); });
app.all(baseApiUrl + "/score/:scoreId", function (req, res) {
    return handleWith405(req, res, 'delete', require('./delete/score').default);
});
