
/**
 * @description test view ( use html DOM )
 * @type {View}
 */
var htmlView = (function init_html_view() {
  var log_buffer = [],
      i = 0,
      by_id = function (id) {
        return document.getElementById(id);
      };

  return createView({
    selectors:{
      counter_id: 'test-count',
      messenger_id: 'test-message',
      logger_id: 'test-log'
    },
    setSelectors: function (identifers) {
      var i, l, key,
          members = this.selectors,
          keys = Object.keys(members);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        if (identifers[key] === undefined){
          throw new Error('html-test-view need selector id :' +
                           name + ', but undefined');
        }
        this.selectors[key] = identifers[key];
      }
      return this;
    },
    getTestCount: function () {
      return parseInt(by_id(this.selectors.counter_id).value, 10);
    },
    standby: function () {
      log_buffer = [];
      i = 0;
    },
    clean: function(){
      log_buffer = [];
    },
    putMsg: function (msg) {
      var board = by_id(this.selectors.messenger_id);
      board.innerHTML = msg;
    },
    putLog: function (mode, log) {
      var entry;
      if (mode === View.LOG_MODE.VERBOSE) {
        entry = '<p>' + htmlEscape(log) + '</p>';
      } else {
        entry = log;
      }
      log_buffer[i] = entry;
      i++;
    },
    dump: function () {
      var consoleLine = by_id(this.selectors.logger_id);
      consoleLine.innerHTML = log_buffer.join('');
      log_buffer = [];
      i = 0;
    },
    highlight: function (isGreen, msg) {
      return '<p class="' + (isGreen ? 'passed' : 'failed') + '">' +
             msg +
             '</p>';
    }
  });
})();

