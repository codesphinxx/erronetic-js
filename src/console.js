import erronetic from './erronetic';
import config from './config';
import utils from './utils';

var _error = console.error;
var _warn = console.warn;

console.error = function() {
    if (arguments.length != 0)
    {
        try
        {
            var data = utils.stringify(arguments);
            var message = utils.stringify(arguments[1]);
            erronetic.writeException(message, data);
        }
        catch(ex)
        {
            //Do nothing at this point
        }        
    }
    
    _error.apply(console, arguments);
};

console.warn = function() {
    if (arguments.length != 0)
    {
        try
        {
            var data = { level:config.LOGS.WARN, values:utils.stringify(arguments) };
            var message = utils.stringify(arguments[1]);
            erronetic.writeMessage(message, data);
        }
        catch(ex)
        {
            //Do nothing at this point
        }
    }
    _warn.apply(console, arguments);
};

if(console.exception)
{
    console.exception = console.error;
}