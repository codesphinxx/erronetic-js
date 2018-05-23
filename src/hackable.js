import utils from './utils';
import config from './config';
import erronetic from './erronetic';

var console=(function(original_console){
    return {
        log: function(message, ...optionalParams){
            if (erronetic.console.log && !utils.isNullOrEmpty(message))
            {        
                var info = utils.stringify(optionalParams);
                info = ''+message + ' ' + info;        
                erronetic.writeMessage(info);
            }
            
            original_console.log(message, optionalParams);
        },
        info: function (message, ...optionalParams) {
            if (erronetic.console.info && !utils.isNullOrEmpty(message))
            {        
                var info = utils.stringify(optionalParams);
                info = message + ' ' + info;        
                erronetic.writeMessage(info);
            }
            if (erronetic.debugMode)
            {
                original_console.info(message, optionalParams);
            }
        },
        warn: function (message, ...optionalParams) {
            if (erronetic.console.warn && !utils.isNullOrEmpty(message))
            {        
                var info = utils.stringify(optionalParams);
                info = message + ' ' + info;        
                erronetic.writeException(info, {level:config.LOGS.WARN});
            }
            if (erronetic.debugMode)
            {
                original_console.warn(message, optionalParams);
            }
        },
        error: function (message, ...optionalParams) {
            if (erronetic.console.error && !utils.isNullOrEmpty(message))
            {        
                var info = utils.stringify(optionalParams);
                info = message + ' ' + info;        
                erronetic.writeException(info);
            }
            if (erronetic.debugMode)
            {
                original_console.error(message, optionalParams);
            }
        }
    };
}(window.console));

window.console = console;