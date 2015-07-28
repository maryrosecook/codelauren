var $ = require("jquery");

var CodeMirror = require('codemirror');
require("./lib/simplescrollbars.js"); // codemirror scrollbar plugin
require('./mode-lauren');

var createEditor = module.exports = function() {
  var editor = CodeMirror(document.body, {
    mode:  "lauren",
    tabSize: 2,
    indentWithTabs: false,
    undoDepth: 1000,
    autofocus: true,
    scrollbarStyle: "simple",
    extraKeys: {
      Tab: function(cm) { cm.execCommand("insertSoftTab"); }
    }
  });

  // restore focus to editor if user ever starts typing
  $(window).keydown(function(e) {
    if (e.ctrlKey === false && e.metaKey === false) {
      editor.focus();
    }
  });

  return editor;
};
