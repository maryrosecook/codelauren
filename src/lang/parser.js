var peg = require("pegjs");
var fs = require("fs");
var _ = require("underscore");

var util = require("../util");
var parserStateError = require("./parser-state-error");

var pegParse = peg.buildParser(fs.readFileSync(__dirname + "/grammar.pegjs", "utf8"),
                               { cache: true }).parse

function parse(codeStr) {
  try {
    var ast = pegParse(codeStr);
    annotateTailCalls(ast);
    return ast;
  } catch(e) {
    if (e.name === "SyntaxError") { // pegjs syntax errors do not have a unique
                                    // constructor so just look at data on exception
                                    // to see if is peg syntax error
      var niceError = parserStateError(codeStr);
      throw new ParseError(e.offset,
                           niceError || e.message,
                           e.stack);
    } else {
      throw e;
    }
  }
};

var parenthesisPairs = { "(": ")", "{": "}", ")": "(", "}": "{", '"': '"' };
var openParentheses = util.defaultObj(["(", "{", '"'], true);
var closeParentheses = util.defaultObj([")", "}", '"'], true);
function balanceParentheses(codeStr) {
  function firstError(parenObj) {
    return Object.keys(parenObj)
      .reduce(function(a, p) {
        return a.concat(parenObj[p].map(function(i) { return { c: p, i: i } }));
      }, [])
      .sort(function(a, b) { return a.i - b.i; })[0];
  };

  var opens = util.defaultObj(Object.keys(openParentheses), Array);
  var orphanCloses = util.defaultObj(Object.keys(closeParentheses), Array);

  for (var i = 0; i < codeStr.length; i++) {
    var c = codeStr[i];
    if (c in openParentheses &&
        (parenthesisPairs[c] !== c || opens[c].length === 0)) { // only open " if none open
      opens[c].push(i);
    } else if (c in closeParentheses) {
      var open = parenthesisPairs[c];
      if (opens[open].length > 0) {
        opens[open].pop();
      } else {
        orphanCloses[c].push(i);
      }
    }
  }

  var firstUnmatchedOpen = firstError(opens);
  var firstOrphanClose = firstError(orphanCloses);

  if (firstUnmatchedOpen !== undefined) {
    throw new ParenthesisError(firstUnmatchedOpen.i,
                               "Missing a closing " + parenthesisPairs[firstUnmatchedOpen.c]);
  } else if (firstOrphanClose !== undefined) {
    throw new ParenthesisError(firstOrphanClose.i,
                               "Missing a preceding opening " +
                               parenthesisPairs[firstOrphanClose.c]);
  }
};

function walkAstWith(ast, fn) {
  if (ast !== undefined) {
    fn(ast.c);

    if (ast.c !== undefined) {
      if (ast.c instanceof Array) {
        for (var i = 0; i < ast.c.length; i++) {
          walkAstWith(ast.c[i], fn);
        }
      } else {
        walkAstWith(ast.c, fn);
      }
    }
  }
};

function verifyAllAstNodesHaveStartIndex(ast) {
  walkAstWith(ast, function(node) {
    if (node !== undefined &&
        node.c !== undefined &&
        (node.s === undefined || typeof node.s !== 'number')) {
      console.log(node);
      throw new Error("All ast nodes should be annotated with a start index");
    }
  });
};

function annotateTailCalls(ast, inTailPosition) {
  inTailPosition = (inTailPosition === true ? true : false);

  if (ast === undefined) {
    return;
  } else if (ast.t === "invocation") {
    if (inTailPosition) {
      ast.tail = true;
    }

    annotateTailCalls(ast.c[0], inTailPosition);
  } else if (ast.t === "return") {
    annotateTailCalls(ast.c, true);
  } else if (ast.t === "conditional") {
    ast.c
      .filter(function(x, i) { return i % 2 === 1; })
      .forEach(function(x) { annotateTailCalls(x, inTailPosition); });
  } else if (ast instanceof Array) {
    ast.forEach(function(x) { annotateTailCalls(x, inTailPosition); });
  } else if (ast.c !== undefined) {
    annotateTailCalls(ast.c, inTailPosition);
  }
};

function indexToLineAndColumn(index, code) {
  var l = 1;
  var c = 1;
  for (var i = 0; i < index; i++) {
    if (code[i] === "\n") {
      l += 1;
      c = 1;
    } else {
      c += 1;
    }
  }

  return { line: l, column: c };
};

function ParseError(s, message, stack) {
  this.s = s;
  this.e = s + 1;
  this.message = message;
  this.stack = stack;
};
ParseError.prototype = Object.create(Error.prototype);

function ParenthesisError(s, message, stack) {
  this.s = s;
  this.e = s + 1;
  this.message = message;
  this.stack = stack;
};
ParenthesisError.prototype = Object.create(Error.prototype);

module.exports = _.extend(parse, {
  indexToLineAndColumn: indexToLineAndColumn,
  balanceParentheses: balanceParentheses,
  verifyAllAstNodesHaveStartIndex: verifyAllAstNodesHaveStartIndex,
  parse: parse,
  ParseError: ParseError,
  ParenthesisError: ParenthesisError
});
