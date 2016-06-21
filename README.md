# KLogger
## customisable lightweight logger

```javascript
// create a new Logger and use it
window.logger = new Logger(Logger.INFO);

logger.info('Hello');
// [INFO] Hello

logger.warn('Warning message');
// [WARN] Warning message

// log Level
Logger.OFF.level   = 0   // display nothing
Logger.ERROR.level = 100 // display errors message and aboves
Logger.WARN.level  = 200 // display warning messages and aboves
Logger.INFO.level  = 300 // display info messages and above
Logger.DEBUG.level = 400 // display debug messages and above
Logger.TRACE.level = 500 // display trace messages and above
Logger.ALL.level   = 600 // display all types of messages

```

## LogLevel

_attribute_ String name

_attribute_ String prefix

_attribute_ Number level

### constructor(String name, String color, Number level)

Example:
```javascript
Logger.INFO  = new LogLevel('INFO' , '#6699CC', 300);
```

### formatter(...any[] arguments) : any[]

