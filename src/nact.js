'use strict';

var Nact             = require("nact");
var Curry            = require("bs-platform/lib/js/curry.js");
var Immutable        = require("immutable-re/src/Immutable.js");
var Caml_exceptions  = require("bs-platform/lib/js/caml_exceptions.js");
var JsMap$ReasonNact = require("./jsMap.js");

function mapSender(sender) {
  if (sender == null) {
    return /* None */0;
  } else {
    return /* Some */[/* ActorRef */[sender]];
  }
}

function createUntypedRef(x) {
  return /* UntypedActorRef */[x];
}

function mapCtx(untypedCtx) {
  return /* record */[
          /* sender */mapSender(untypedCtx.sender),
          /* parent : ActorRef */[untypedCtx.parent],
          /* path : ActorPath */[untypedCtx.path],
          /* self : ActorRef */[untypedCtx.self],
          /* children */Curry._1(Immutable.HashMap[/* toMap */29], JsMap$ReasonNact.toImmutableHashMap(JsMap$ReasonNact.mapValues(createUntypedRef, untypedCtx.children))),
          /* name */untypedCtx.name
        ];
}

function mapPersistentCtx(untypedCtx) {
  var partial_arg = untypedCtx.persist;
  return /* record */[
          /* sender */mapSender(untypedCtx.sender),
          /* parent : ActorRef */[untypedCtx.parent],
          /* path : ActorPath */[untypedCtx.path],
          /* self : ActorRef */[untypedCtx.self],
          /* name */untypedCtx.name,
          /* persist */Curry.__1(partial_arg),
          /* children */Curry._1(Immutable.HashMap[/* toMap */29], JsMap$ReasonNact.toImmutableHashMap(JsMap$ReasonNact.mapValues(createUntypedRef, untypedCtx.children))),
          /* recovering */untypedCtx.recovering
        ];
}

function spawn(name, param, func) {
  var parent = param[0];
  var f = function (state, msg, ctx) {
    return Curry._3(func, state, msg, mapCtx(ctx));
  };
  var untypedRef = name ? Nact.spawn(parent, f, name[0]) : Nact.spawn(parent, f, undefined);
  return /* ActorRef */[untypedRef];
}

function spawnStateless(name, param, func) {
  var parent = param[0];
  var f = function (msg, ctx) {
    return Curry._2(func, msg, mapCtx(ctx));
  };
  var untypedRef = name ? Nact.spawnStateless(parent, f, name[0]) : Nact.spawnStateless(parent, f, undefined);
  return /* ActorRef */[untypedRef];
}

function spawnPersistent(key, name, param, func) {
  var parent = param[0];
  var f = function (state, msg, ctx) {
    return Curry._3(func, state, msg, mapPersistentCtx(ctx));
  };
  var untypedRef = name ? Nact.spawnPersistent(parent, f, key, name[0]) : Nact.spawnPersistent(parent, f, key, undefined);
  return /* ActorRef */[untypedRef];
}

function stop(param) {
  Nact.stop(param[0]);
  return /* () */0;
}

function start() {
  var untypedRef = Nact.start();
  return /* ActorRef */[untypedRef];
}

function dispatch(sender, param, msg) {
  var actor = param[0];
  if (sender) {
    Nact.dispatch(actor, msg, sender[0][0]);
    return /* () */0;
  } else {
    Nact.dispatch(actor, msg, undefined);
    return /* () */0;
  }
}

var QueryTimeout = Caml_exceptions.create("Nact-ReasonNact.QueryTimeout");

function query(timeout, param, msg) {
  return Nact.query(param[0], msg, timeout).catch((function () {
                return Promise.reject([
                            QueryTimeout,
                            timeout
                          ]);
              }));
}

exports.spawn           = spawn;
exports.spawnStateless  = spawnStateless;
exports.spawnPersistent = spawnPersistent;
exports.stop            = stop;
exports.start           = start;
exports.dispatch        = dispatch;
exports.QueryTimeout    = QueryTimeout;
exports.query           = query;
/* nact Not a pure module */