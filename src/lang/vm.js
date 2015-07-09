var _ = require("underscore");

var util = require("../util");
var standardLibrary = require("./standard-library");
var envModule = require("../env");
var scope = require("./scope");

var copyProgramState;
function getCopyProgramState() {
  return copyProgramState = copyProgramState || require("../copy-program-state");
};

function stepPush(ins, p) {
  p.stack.push(getCopyProgramState().copyValue(ins[1]));
  return p;
};

function stepPushLambda(ins, p) {
  var lambda = ins[1];
  lambda.closureEnv = currentCallFrame(p).env;
  p.stack.push(lambda);
  return p;
};

function stepPop(ins, p) {
  p.stack.pop();
  return p;
};

function stepReturn(ins, p) {
  p.callStack.pop();
  return p;
};

function stepGetEnv(ins, p) {
  p.stack.push(currentCallFrame(p).env.getScopedBinding(ins[1]));
  return p;
};

function stepSetEnv(ins, p) {
  currentCallFrame(p).env.setGlobalBinding(ins[1], p.stack.pop());
  return p;
};

function stepInvoke(ins, p) {
  var fn = p.stack.pop();
  var arity = ins[1];

  // TODO: raise errors for arity problems
  var args = _.range(arity).map(function() { return p.stack.pop(); }).reverse();

  if (fn.bc !== undefined) { // a lambda
    var lambdaEnv = scope(_.object(fn.parameters, args), fn.closureEnv);

    var tailIndex = tailCallIndex(p.callStack, fn);
    if (tailIndex !== undefined) { // if tails calls all the way to recursive call, then tco
      p.callStack = p.callStack.slice(0, tailIndex + 1);
      currentCallFrame(p).env = lambdaEnv;
      currentCallFrame(p).bcPointer = 0;
    } else {
      p.callStack.push(createCallFrame(fn.bc, 0, lambdaEnv, ins[2]));
    }
  } else { // is a JS function object
    p.stack.push(fn.apply(null, args));
  }

  return p;
};

function tailCallIndex(callStack, fn) {
  var recursiveIndex = previousRecursionCallFrameIndex(callStack, fn);
  if (recursiveIndex !== undefined) {
    var calls = callStack.slice(recursiveIndex);
    if (calls.length === calls.filter(function(c) { return c.tail === true; }).length) {
      return recursiveIndex;
    }
  }
};

function previousRecursionCallFrameIndex(callStack, fn) {
  for (var i = callStack.length - 1; i >= 0; i--) {
    if (callStack[i].bc === fn.bc) {
      return i;
    }
  }
};

function stepIfNotTrueJump(ins, p) {
  if (p.stack.pop() !== true) {
    currentCallFrame(p).bcPointer += ins[1];
  }

  return p;
};

function stepJump(ins, p) {
  currentCallFrame(p).bcPointer += ins[1];
  return p;
};

function step(p) {
  var callFrame = currentCallFrame(p);
  if (callFrame === undefined) {
    return p;
  } else {
    var ins = callFrame.bc[callFrame.bcPointer];
    callFrame.bcPointer++;

    p.currentInstruction = ins;

    try {
      if (ins[0] === "push") {
        return stepPush(ins, p);
      } else if (ins[0] === "push_lambda") {
        return stepPushLambda(ins, p);
      } else if (ins[0] === "pop") {
        return stepPop(ins, p);
      } else if (ins[0] === "get_env") {
        return stepGetEnv(ins, p);
      } else if (ins[0] === "set_env") {
        return stepSetEnv(ins, p);
      } else if (ins[0] === "invoke") {
        return stepInvoke(ins, p);
      } else if (ins[0] === "if_not_true_jump") {
        return stepIfNotTrueJump(ins, p);
      } else if (ins[0] === "jump") {
        return stepJump(ins, p);
      } else if (ins[0] === "return") {
        return stepReturn(ins, p);
      } else {
        throw new Error("I don't know how to run this instruction: " + ins);
      }
    } catch (e) {
      throw new RuntimeError(e);
    }
  }
};

function complete(p) {
  while (!isComplete(p)) {
    p = step(p);
  }

  return p;
};

function currentCallFrame(p) {
  return _.last(p.callStack);
};

function isComplete(p) {
  var callFrame = currentCallFrame(p);
  return callFrame === undefined ||
    callFrame.bcPointer === callFrame.bc.length;
};

function initProgramState(code, bc, env, stack) {
  return {
    code: code,
    callStack: [createCallFrame(bc, 0, env ? env : envModule.createEnv(standardLibrary()))],
    stack: stack || [],
    currentInstruction: undefined
  };
};

function createCallFrame(bc, bcPointer, env, tail) {
  return { bc: bc, bcPointer: bcPointer, env: env, tail: tail };
};

function initProgramStateAndComplete(bc, env, stack) {
  return complete(initProgramState(bc, env, stack));
};

function RuntimeError(e) {
  util.copyException(e, this);
};
RuntimeError.prototype = Object.create(Error.prototype);

initProgramStateAndComplete.initProgramStateAndComplete = initProgramStateAndComplete;
initProgramStateAndComplete.initProgramState = initProgramState;
initProgramStateAndComplete.step = step;
initProgramStateAndComplete.complete = complete;
initProgramStateAndComplete.isComplete = isComplete;
initProgramStateAndComplete.createCallFrame = createCallFrame;
initProgramStateAndComplete.RuntimeError = RuntimeError;

module.exports = initProgramStateAndComplete;
