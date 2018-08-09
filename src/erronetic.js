import utils from './utils';
import config from './config';
import Exception from './exception';
var UAParser = require('./vendor/ua-parser');
var StackTrace = require('./vendor/stacktrace');
import murmurhash3_32_gc from './vendor/murmurhash3';

class erronetic
{
    constructor()
    {
        if (!erronetic.instance)
        {
            this.debug = false;
            this._app_key = '';
            this._parser = new UAParser();
            this._xhttp = null;
            this._meta = null;
            this._client_id = -1;
            this._method = 'POST';
            this._protocol = 'http:';
            this._commit_url = config.XHTTP_URI;
            
            erronetic.instance = this;
        }
        
        window.onerror = this._onerror.bind(this);
        return erronetic.instance;
    }

    _onerror(msg, file, line, col, error)
    {
        if (file.indexOf('erronetic.min') != -1) return;

        StackTrace.fromError(error).then((stackframes)=>{
            this._writeError(error.name, msg, stackframes);
        })
        .catch(()=>{
            this._logDebug('ErroneticCommit Error:' + error.message);
        });
    }

    _generateSignature() 
    { 
        var bar = '|';
        
        var browserData = this._parser.getResult();
        var userAgent = browserData.ua;
        var screenPrint = utils.getScreenPrint();
        var pluginList = utils.getPlugins();
        var localStorage = utils.isLocalStorage();
        var sessionStorage = utils.isSessionStorage();
        var timeZone = utils.getTimeZone();
        var language = navigator.language;
        var systemLanguage = navigator.systemLanguage;
        var cookies = navigator.cookieEnabled;
  
        var key = userAgent + bar + screenPrint + bar + pluginList + bar + localStorage + bar + sessionStorage + bar + timeZone + bar + language + bar + systemLanguage + bar + cookies;
        var seed = 256;
        
        this._client_id = murmurhash3_32_gc(key, seed);
    }    

    _createCORSRequest(callback)
    {
        var xhr = new XMLHttpRequest();
        var hasCORS = 'withCredentials' in xhr || typeof XDomainRequest !== 'undefined';
        if (!hasCORS) return;

        if ('withCredentials' in xhr)
        {
            xhr.onreadystatechange = callback;
        }
        else if (typeof XDomainRequest != 'undefined')
        {
            xhr = new XDomainRequest();
            xhr.onload = callback;
        }

        return xhr;
    }

    _create(message, errorReport)
    {
        var data = new Exception(message);
        data.secret = this._app_key;
        data.client_id = this._client_id;        

        if (this._meta)
        {
            data.meta = this._meta;
        }
        
        try
        {            
            var browserData = this._parser.getResult();
            data.browser = browserData.browser.name + ' ' + browserData.browser.version;
            data.browser_name = browserData.browser.name;
    
            if (browserData.os.name) 
            {
                data.os = browserData.os.name;
                if (browserData.os.version) 
                {
                    data.os += ' ' + browserData.os.version;
                }
            }    
            if (browserData.engine.name) 
            {
                data.engine = browserData.engine.name;
                if (browserData.engine.version) 
                {
                    data.engine += ' ' + browserData.engine.version;
                }
            }    
            if (browserData.device.vendor) 
            {
                data.device = browserData.device.vendor;
                if (browserData.device.model) 
                {
                    data.device += ' - ' + browserData.device.model;
                }
                if (browserData.device.type) 
                {
                    data.device += ' - ' + browserData.device.type;
                }
            }  
            if (errorReport instanceof Error)
            {
                data.name = errorReport.name;
                data.addStack(errorReport);
            }
            else if (errorReport)
            {
                data.stack = errorReport;
            }            
        }
        catch(ex)
        {
            this._logDebug(ex);
        }
        return data;
    }

    _onreadystatechange ()
    {
        if (this._xhttp instanceof XMLHttpRequest)
        {
            if (this._xhttp.readyState === XMLHttpRequest.DONE && this._xhttp.status === 200)
            {
                this._logDebug(this._xhttp.responseText);
            }
        }
        else
        {
            this._logDebug(this._xhttp.responseText);
        }
    }

    _commit(data)
    {
        if (this._xhttp)
        {
            this._xhttp.open(this._method, this._commit_url, true);
            if (this._xhttp instanceof XMLHttpRequest)
            {
                this._xhttp.setRequestHeader('Content-Type', 'application/json');
            }        
            this._xhttp.send(JSON.stringify(data));
        }        
    }

    _writeError(name, message, error)
    {
        var msg = this._create(message, error);  
        msg.name = name;      
        msg.level = config.LOGS.ERROR;
        this._commit(msg);
    }

    _logDebug(...data)
    {
        if (this.debug)
        {
            console.log(data);
        }
    }
    
    /**
    * Initializes the erronetic logging service.
    * @method erronetic.init
    * @param {String} key - the client application api key
    * @param {Object} options - options used to route logs.
    * @param {String} options.url - custom url to save exceptions.
    * @param {String} options.method - request method when saving log to custom url. Default [POST]
    * @param {Boolean} options.debug - logger debug mode. True will display errors in console.
    */
    init(key, options)
    { 
        this._app_key = key;  
        options = options || {};     
        this.debug = Boolean(options.debug || false);
        this._protocol = window.location.protocol=='https' ? 'https:' : 'http:';
        if (!utils.isNullOrEmpty(options.url))
        {
            if (options.url.indexOf('https:')!=-1)
            {
                options.url = options.url.replace('https:', '');
            }
            else if (options.url.indexOf('http:')!=-1)
            {
                options.url = options.url.replace('http:', '');
            }
            this._commit_url = options.url;
            if (!utils.isNullOrEmpty(options.method))
            {
                options.method = options.method.toUpperCase();
                if (['POST','PUT','GET', 'DELETE'].indexOf(options.method) != -1)
                {
                    this._method = options.method;
                }            
            }
        }        
        this._generateSignature();
        this._xhttp = this._createCORSRequest(this._onreadystatechange.bind(this));
    }

    /**
    * Assigns custom meta data that will be sent along with each exception.
    * @method erronetic.setMetaContext
    * @param {Object|Array} data custom meta data, can be user to store user details
    */
    setMetaContext(data)
    {
        if (!data) return;

        if (!Array.isArray(data) && typeof data === 'object')
        {
            data = JSON.parse(JSON.stringify(data));
        }
        this._meta = data;
    }

    /**
    * Sends a custom info-level message.
    * @method erronetic.writeMessage
    * @param {String} message the custom message to log
    * @param {Object} data additional data to send(must contains values of string, number, or boolean)
    */
    writeMessage(message, data)
    {
        if (!message) return;
        var msg = this._create(message); 
        msg.extra = utils.primitify(data);  
        if (utils.isLogLevel(data.level)) msg.level = data.level;  
        this._commit(msg);
    }

    /**
    * Sends a custom error exception.
    * @method erronetic.writeException
    * @param {Error} error Error object to log.
    * @param {Object} data additional data to send(must contains values of string, number, or boolean)
    */
    writeException(error, data)
    {
        if (!error) return;
        var msg = this._create(error.message, error); 
        msg.extra = utils.primitify(data);       
        msg.level = config.LOGS.ERROR;
        this._commit(msg);
    }
}

const instance = new erronetic();
export default instance;