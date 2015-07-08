var vm = require("../src/lang/vm");

var player;
var ps;
var paused = false;

function setupPlayer() {
  if (player !== undefined) { return; }

  (function tick(lastEventLoopYield) {
    while(true) {
      if (ps !== undefined && !paused) {
        if (vm.isComplete(ps)) {
          ps.canvasEnv.flush();
        } else {
          player.stepForwards();
        }
      }

      if (isTimeToYieldToEventLoop(lastEventLoopYield)) {
        requestAnimationFrame(() => tick(new Date().getTime()));
        break;
      }
    }
  })(new Date().getTime());

  player = {
    isPaused: function() {
      return paused;
    },

    togglePause: function() {
      paused = !paused;
    },

    pause: function() {
      paused = true;
    },

    unpause: function() {
      paused = false;
    },

    getProgramState: function() {
      return ps;
    },

    stepForwards: function() {
      try {
        if (!vm.isComplete(ps)) {
          ps = vm.step(ps);
        }
      } catch (e) {
        if (e instanceof vm.RuntimeError) {
          console.log(e.message, e.stack);
        } else {
          console.log(e.stack);
        }
      }
    },

    stepBackwards: function() {
      console.log("nothing yet");
    },

    setProgramState: function(newPs) {
      ps = newPs;
    }
  };

  return player;
};

function isTimeToYieldToEventLoop(lastYield) {
  return new Date().getTime() - lastYield > 8;
};

setupPlayer.setupPlayer = setupPlayer;
module.exports = setupPlayer;
