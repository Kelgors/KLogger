(function (root, exportName) {
  var arrProt = Array.prototype;

  function LogLevel(name, color, level) {
    var cssRuleContent = null;
    if (level < 0) level = 0;
    Object.defineProperties(this, {
      'color': {
        set: function (value) {
          // TODO: improve to use any css rule with it (if pertinent)
          cssRuleContent = value ? 'color: ' + String(value) : null;
        },
        get: function () { return cssRuleContent; }
      },
      'name': {
        configurable: false, writable: false,
        value: String(name)
      },
      'prefix': {
        configurable: false, writable: false,
        value: '[' + name + '] '
      },
      'level': {
        configurable: false, writable: false,
        value: level
      }
    });
    this.color = color;
  }
  LogLevel.RESET_COLOR = 'color: #000000';

  LogLevel.prototype = Object.create(Object.prototype, {
    formatter: {
      value: function formatter(message) {
        var messageIsString = typeof message === 'string';
        // catch all arguments after message that are the interpolated values
        // only if message is a string (to concat it with prefix or not)
        var interpolatedValues = arrProt.slice.call(arguments, messageIsString ? 1 : 0, arguments.length);
        var textBuffer = [ this.prefix, ' ' ];
        if (this.color) {
          // add color flag into the text shown by console
          textBuffer.unshift('%c');
          textBuffer.push('%c');
          // add color to the beginning of the arguments
          interpolatedValues.unshift(this.color, LogLevel.RESET_COLOR);
        }
        // insert message after color arguments
        if (messageIsString) textBuffer.push(message);
        return [ textBuffer.join('') ].concat(interpolatedValues);
      }
    },
    toString: {
      value: function toString() {
        return this.name;
      }
    }
  });

  function Logger(loglevel) { this.loglevel = loglevel; }

  var LoggerProtoDescriptor = {
    log: {
      value: function log(loglevel) {
        if (!loglevel) throw new Error('you must give a log loglevel in first argument');
        if (loglevel.level > this.loglevel.level) return;
        if (typeof console !== 'undefined') {
          var consoleArguments = loglevel.formatter.apply(loglevel, arrProt.slice.call(arguments, 1, arguments.length));
          console.log.apply(console, consoleArguments);
        }
      }
    }
  };

  // Create loglevels
  Logger.LogLevel = LogLevel;
  Logger.OFF   = new LogLevel('OFF'  , ''       , 0);
  Logger.ERROR = new LogLevel('ERROR', '#FF0000', 100);
  Logger.WARN  = new LogLevel('WARN' , '#e6ac00', 200);
  Logger.INFO  = new LogLevel('INFO' , '#6699CC', 300);
  Logger.DEBUG = new LogLevel('DEBUG', '#669966', 400);
  Logger.TRACE = new LogLevel('TRACE', '#000000', 500);
  Logger.ALL   = new LogLevel('ALL'  , ''       , Number.MAX_SAFE_INTEGER);

  // Load default log aliases
  ['error','warn','info','debug','trace'].forEach(function (propertyName) {
    var loglevel = Logger[propertyName.toUpperCase()];
    LoggerProtoDescriptor[propertyName] = {
      value: function () {
        var args = arrProt.slice.call(arguments);
        args.unshift(loglevel);
        return this.log.apply(this, args);
      }
    };
  });

  Logger.prototype = Object.create(Object.prototype, LoggerProtoDescriptor);

  if (typeof define === 'function' && define.amd) {
    define(Logger);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
  } else {
    root[exportName] = Logger;
  }

})(this, 'KLogger');
