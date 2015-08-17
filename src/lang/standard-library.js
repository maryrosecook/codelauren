var _ = require("underscore");
var langUtil = require("./lang-util");

var createStandardLibrary = module.exports = function () {
  var lib = {
    add: function(meta) {
      return _.reduce(_.rest(arguments), function(a, n) { return a + n; });
    },

    subtract: function(meta) {
      return _.reduce(_.rest(arguments), function(a, n) { return a - n; });
    },

    multiply: function(meta) {
      return _.reduce(_.rest(arguments), function(a, n) { return a * n; });
    },

    divide: function(meta) {
      return _.reduce(_.rest(arguments), function(a, n) { return a / n; });
    },

    modulus: function(meta, a, b) {
      return a % b;
    },

    sine: function(meta, x) {
      return Math.sin(lib.radians(x));
    },

    cosine: function(meta, x) {
      return Math.cos(lib.radians(x));
    },

    tangent: function(meta, x) {
      return Math.tan(lib.radians(x));
    },

    radians: function(meta, x) {
      return 0.01745 * x;
    },

    degrees: function(meta, x) {
      return x / 0.01745;
    },

    "new-dictionary": function(meta) {
      var args = _.rest(arguments);
      return _.object(_.filter(args, function(_, i) { return i % 2 === 0; }),
                      _.filter(args, function(_, i) { return i % 2 === 1; }));
    },

    "less-than": function(meta, a, b) {
      return a < b;
    },

    "greater-than": function(meta, a, b) {
      return a > b;
    },

    equal: function(meta) {
      var args = _.toArray(_.rest(arguments));
      if (args.length < 2 || args[0] !== args[1]) {
        return false;
      } else if (args.length === 2) {
        return true;
      } else {
        return lib.equal.apply(null, args.slice(1));
      }
    },

    set: function(meta, dict, key, value) {
      dict[key] = value;
      return dict;
    },

    get: function(meta, dict, key) {
      return dict[key];
    },

    print: langUtil.hasSideEffects(function(meta) {
      var output = _.map(_.rest(arguments), function(x) { return x.toString(); }).join(" ");
      console.log(output);
      return output + "\n";
    })
  };

  return lib;
};
