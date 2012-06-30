
/**
 * @description default test view ( use console object )
 * @type {View}
 */
var consoleView = (function init_console_view() {
  var log_buffer = [],
      i = 0;
  return createView({
    getTestCount: function () {
      return 100;
    },
    standby: function () {
      if (console.clear) { // for firebug ( Firefox extension )
        console.clear();
      }
      log_buffer = [];
      i = 0;
    },
    clean: function () {
      log_buffer = [];
      i = 0;
    },
    putMsg: function (msg) {
      console.log(msg);
    },
    putLog: function (msg, withEscape) {
      log_buffer[i] = msg;
      i++;
    },
    dump: function () {
      if (log_buffer.length > 0) {
        console.log(log_buffer.join('\n'));
      }
    },
    highlight: function (isGreen, msg) {
      return msg;
    }
  });
})();

