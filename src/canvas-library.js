var _ = require("underscore");
var im = require("immutable");

var util = require("./util");
var langUtil = require("./lang/lang-util");
var heapLib = require("./lang/heap");
var programState = require("./lang/program-state");
var chk = require("./lang/check-args");
var env = require("./env");

var OPERATIONS_TO_SAVE = 40000;

var screen;
var step = 0;
var allDrawOperations = [];
var drawOperationsSinceLastRepaint = [];

function makeOperation(fn, name, isClearScreen) {
  return {
    fn: fn,
    step: step,
    name: name,
    isClearScreen: isClearScreen === true ? true : false
  };
};

function addOperation(op) {
  allDrawOperations.push(op);
  drawOperationsSinceLastRepaint.push(op);

  if (allDrawOperations.length > OPERATIONS_TO_SAVE) {
    allDrawOperations.shift();
  }
};

var program = {
  flush: function() {
    drawOperationsSinceLastRepaint
      .filter(function(o) { return o.isClearScreen === false;  })
      .forEach(function(o) { o.fn(); });
    drawOperationsSinceLastRepaint = [];
  },

  runDrawOperationsSinceLastRepaint: function() {
    drawOperationsSinceLastRepaint.forEach(function(o) { o.fn(); });
    drawOperationsSinceLastRepaint = [];
  },

  play: function() {
    // the thing where you see a drawing part reappear after stepping
    // back past it then pressing play is because the current
    // instruction is inside code where the draw is already a foregone
    // conclusion eg if current instruction is one of the args to
    // draw-circle in code below
    // if mouse-button-is-down { draw-circle(1 1 1 1 "filled" "red") }

    drawOperationsSinceLastRepaint = []
    for (var i = allDrawOperations.length - 1; i >= 0; i--) {
      if (allDrawOperations[i].step < step) {
        break;
      }
    }

    allDrawOperations.splice(i + 1);
  },

  stepForwards: function() {
    step++;
  },

  stepBackwards: function() {
    step--;
    program.redraw();
  },

  pause: function() {
    program.redraw();
  },

  hitClearScreen: function() {
    return _.find(drawOperationsSinceLastRepaint,
                  function(o) { return o.isClearScreen === true; }) !== undefined;
  },

  clearScreen: function() {
    screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
  },

  redraw: function() {
    var ops = [];
    var foundClearScreen = false;
    for (var i = allDrawOperations.length - 1; i >= 0; i--) {
      if (allDrawOperations[i].step < step) {
        ops.push(allDrawOperations[i]);
        if(allDrawOperations[i].isClearScreen === true) {
          foundClearScreen = true;
          break;
        }
      }
    }

    if (!foundClearScreen) {
      ops.push(makeOperation(function() {
        program.clearScreen();
      }, "clear-screen", true));
    }

    ops.reverse().forEach(function(o) { o.fn(); });
  },

  reset: function() {
    step = 0;
    allDrawOperations = [];
    drawOperationsSinceLastRepaint = [];

    // clear screen to handle broken program add clear-screen() to ops
    // to handle initial clear screen on program execution when
    // stepping backwards through programs without an explicit
    // clear-screen()
    screen.clearRect(0, 0, screen.canvas.width, screen.canvas.height);
    user.getIn(["clear-screen", "fn"])();
  }
};

var user = im.Map({
  "clear-screen": langUtil.createBuiltinOutputting(function(p) {
    addOperation(makeOperation(function () {
      program.clearScreen();
    }, "clear-screen", true));

    return { p: p, v: undefined };
  }),

  draw: langUtil.createBuiltinOutputting(function(p, drawablePointer) {
    chk(arguments,
        chk.pointer("a shape or some words to draw"));

    chk([p, programState.getFromHeap(p, drawablePointer)],
        chk.anyValueAtKey("_drawableType", ["rectangle", "circle", "words"], "a shape or some words to draw"));

    addOperation(makeOperation(function () {
      var drawable = programState.getFromHeap(p, drawablePointer);
      drawFns[drawable.get("_drawableType")](drawable);
    }, "draw"));

    return { p: p, v: undefined };
  }),

  "random-color": langUtil.createBuiltinNormal(function(p) {
    var color = COLORS_WITHOUT_GRAYSCALE[
      Math.floor(Math.random() * (COLORS_WITHOUT_GRAYSCALE.length - 1))
    ];

    return { p: p, v: color };
  }),

  "are-overlapping": langUtil.createBuiltinNormal(function(p, shapePointer1, shapePointer2) {
    chk(arguments,
        chk.pointer("a shape"),
        chk.pointer("another shape"));

    chk([p,
         programState.getFromHeap(p, shapePointer1),
         programState.getFromHeap(p, shapePointer2)],
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "a shape"),
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "another shape"));

    var shape1 = programState.getFromHeap(p, shapePointer1);
    var shape2 = programState.getFromHeap(p, shapePointer2);
    var collisionTestFn = overlappingFns[shape1.get("_spatialType") + " " + shape2.get("_spatialType")];
    if (collisionTestFn !== undefined) {
      return { p: p, v: collisionTestFn(shape1, shape2) };
    } else {
      throw new Error("Could not find collision test function.");
    };
  }),

  rectangle: langUtil.createBuiltinNormal(function(p, x, y, width, height) {
    chk(arguments,
        chk.num("the x coordinate of the center of the rectangle"),
        chk.num("the y coordinate of the center of the rectangle"),
        chk.num("the width"),
        chk.num("the height"));

    var rectangle = im.Map({x: x, y: y, width: width, height: height,
                            filled: true, color: "black", _drawableType: "rectangle", _spatialType: "rectangle" });

    var heapAndPointer = heapLib.add(p.get("heap"), rectangle);
    return {
      p: p.set("heap", heapAndPointer.heap),
      v: heapAndPointer.pointer
    };
  }),

  circle: langUtil.createBuiltinNormal(function(p, x, y, width) {
    chk(arguments,
        chk.num("the x coordinate of the center of the circle"),
        chk.num("the y coordinate of the center of the circle"),
        chk.num("the width"));

    var circle = im.Map({x: x, y: y, width: width,
                         filled: true, color: "black", _drawableType: "circle", _spatialType: "circle" });
    var heapAndPointer = heapLib.add(p.get("heap"), circle);

    return {
      p: p.set("heap", heapAndPointer.heap),
      v: heapAndPointer.pointer
    };
  }),

  "set-composite-operation": langUtil.createBuiltinNormal(function(p, operation) {
    chk(arguments,
        chk.set(COMPOSITE_OPERATIONS, "a composite operation"));

    screen.globalCompositeOperation = operation;
    return { p: p, v: undefined };
  }),

  words: langUtil.createBuiltinNormal(function(p, x, y, words) {
    chk(arguments,
        chk.num("the x coordinate of the center of the words"),
        chk.num("the y coordinate of the center of the words"),
        chk.numOrBooleanOrString("some words or a number"));

    var words = im.Map({x: x, y: y, words: words, color: "black", _drawableType: "words" });

    var heapAndPointer = heapLib.add(p.get("heap"), words);

    return {
      p: p.set("heap", heapAndPointer.heap),
      v: heapAndPointer.pointer
    };
  }),

  "vector-towards": langUtil.createBuiltinNormal(function(p, shapePointer1, shapePointer2) {
    chk(arguments,
        chk.pointer("a shape"),
        chk.pointer("another shape"));

    var shape1 = programState.getFromHeap(p, shapePointer1);
    var shape2 = programState.getFromHeap(p, shapePointer2);

    chk([p,
         shape1,
         shape2],
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "a shape"),
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "another shape"));

    var position1 = {
      x: parseFloat(shape1.get("x")),
      y: parseFloat(env.yInvert(shape1.get("y")))
    };

    var position2 = {
      x: parseFloat(shape2.get("x")),
      y: parseFloat(env.yInvert(shape2.get("y")))
    };

    var vector = vectorBetween(position1, position2);
    var heapAndPointer = heapLib.add(p.get("heap"), im.Map(vector));

    return {
      p: p.set("heap", heapAndPointer.heap),
      v: heapAndPointer.pointer
    };
  }),

  distance: langUtil.createBuiltinNormal(function(p, shapePointer1, shapePointer2) {
    chk(arguments,
        chk.pointer("a shape"),
        chk.pointer("another shape"));

    var shape1 = programState.getFromHeap(p, shapePointer1);
    var shape2 = programState.getFromHeap(p, shapePointer2);

    chk([p,
         shape1,
         shape2],
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "a shape"),
        chk.anyValueAtKey("_spatialType", ["rectangle", "circle"], "another shape"));

    var position1 = {
      x: parseFloat(shape1.get("x")),
      y: parseFloat(env.yInvert(shape1.get("y")))
    };

    var position2 = {
      x: parseFloat(shape2.get("x")),
      y: parseFloat(env.yInvert(shape2.get("y")))
    };

    return { p: p, v: distance(position1, position2) };
  })
});

var api = {
  program: program,
  user: user
};

var setScreen = module.exports = function(inScreen) {
  if (screen !== undefined) { throw new Error("Already started"); }

  screen = inScreen;
  return api;
};

var drawFns = {
  rectangle: function(r) {
    var left = r.get("x") - r.get("width") / 2;
    var top = env.yInvert(r.get("y")) - r.get("height") / 2;
    if (r.get("filled") === true) {
      screen.fillStyle = r.get("color");
      screen.fillRect(left, top, r.get("width"), r.get("height"));
      screen.fillStyle = "black";
    } else if (r.get("filled") === false) {
      screen.strokeStyle = r.get("color");
      screen.strokeRect(left, top, r.get("width"), r.get("height"));
      screen.strokeStyle = "black";
    }
  },

  circle: function(o) {
    screen.beginPath();
    screen.arc(o.get("x"), env.yInvert(o.get("y")), o.get("width") / 2, 0, 2 * Math.PI);
    screen.closePath()

    if (o.get("filled") === true) {
      screen.fillStyle = o.get("color");
      screen.fill();
      screen.fillStyle = "black";
    } else if (o.get("filled") === false) {
      screen.strokeStyle = o.get("color");
      screen.stroke();
      screen.strokeStyle = "black";
    }
  },

  words: function(t) {
    screen.font = "20px Georgia";
    screen.textAlign = "center";
    screen.textBaseline = "middle";
    screen.fillStyle = t.get("color");
    screen.fillText(t.get("words"), t.get("x"), env.yInvert(t.get("y")));
    screen.fillStyle = "black";
  }
};

var overlappingFns = {
  // only works for unrotated rectangles
  // when introduce rotation will need to change this
  "rectangle rectangle": function(s1, s2) {
    var x1 = s1.get("x");
    var y1 = env.yInvert(s1.get("y"));
    var w1 = s1.get("width");
    var h1 = s1.get("height");
    var x2 = s2.get("x");
    var y2 = env.yInvert(s2.get("y"));
    var w2 = s2.get("width");
    var h2 = s2.get("height");
    return !(x1 + w1 / 2 < x2 - w2 / 2 ||
             y1 + h1 / 2 < y2 - h2 / 2 ||
             x1 - w1 / 2 > x2 + w2 / 2 ||
             y1 - h1 / 2 > y2 + h2 / 2);
  },

  "circle circle": function(s1, s2) {
    var position1 = {
      x: parseFloat(s1.get("x")),
      y: parseFloat(env.yInvert(s1.get("y")))
    };

    var position2 = {
      x: parseFloat(s2.get("x")),
      y: parseFloat(env.yInvert(s2.get("y")))
    };

    return distance(position1, position2) <= s1.get("width") / 2 + s2.get("width") / 2;
  },

  // only works for unrotated rectangles
  // when introduce rotation will need to change this
  "rectangle circle": function(r, c) {
    var rX = parseFloat(r.get("x"));
    var rY = parseFloat(env.yInvert(r.get("y")));
    var rWidth = parseFloat(r.get("width"));
    var rHeight = parseFloat(r.get("height"));

    var cX = parseFloat(c.get("x"));
    var cY = parseFloat(env.yInvert(c.get("y")));
    var cWidth = parseFloat(c.get("width"));

    var closestX = 0;
    var closestY = 0;

    if (cX < rX - rWidth / 2) {
      closestX = rX - rWidth / 2;
    } else if (cX > rX + rWidth / 2) {
      closestX = rX + rWidth / 2;
    } else {
      closestX = cX;
    }

    if (cY < rY - rHeight / 2) {
      closestY = rY - rHeight / 2;
    } else if (cY > rY + rHeight / 2) {
      closestY = rY + rHeight / 2;
    } else {
      closestY = cY;
    }

    var position1 = { x: cX, y: cY };
    var position2 = { x: closestX, y: closestY };

    return distance(position1, position2) < cWidth / 2;
  },

  "circle rectangle": function(c, r) {
    return overlappingFns["rectangle circle"](r, c);
  }
};

function distance(position1, position2) {
  var x = Math.abs(position1.x - position2.x);
  var y = Math.abs(position1.y - position2.y);

  return Math.sqrt((x * x) + (y * y));
};

function vectorBetween(position1, position2) {
  return unitVector({
    x: position2.x - position1.x,
    y: position2.y - position1.y
  });
};

function unitVector(position) {
  if (magnitude(position) === 0) {
    return { x: 0, y: 0 };
  } else {
    return {
      x: position.x / magnitude(position),
      y: position.y / magnitude(position)
    };
  }
};

function magnitude(position) {
  return Math.sqrt(position.x * position.x + position.y * position.y);
};

var COMPOSITE_OPERATIONS = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];

var COLORS_WITH_GRAYSCALE = [
  "aliceblue",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dodgerblue",
  "firebrick",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "gold",
  "goldenrod",
  "green",
  "greenyellow",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgreen",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightsteelblue",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mistyrose",
  "moccasin",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "yellow",
  "yellowgreen",
  "white"
];

var COLORS_GREYSCALE = ["white", "black", "gray"];

var COLORS_WITHOUT_GRAYSCALE = _.difference(COLORS_WITH_GRAYSCALE, COLORS_GREYSCALE);
