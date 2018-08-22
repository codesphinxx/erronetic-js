import config from './config';

export default class Exception
{
    constructor(message)
    {
        this.name = '';
        this.stack = [];
        this.level = config.LOGS.INFO;
        this.message = message || '';
        this.device = '';
        this.engine = '';
        this.os = '';
        this.timestamp = Date.now();
        this.url = location.href;
        this.user_agent = navigator.userAgent;
        this.secret = '';
        this.browser = '';
        this.browser_name = '';
        this.logger = 'javascript';
        this.version = config.VERSION;
        this.client_id = -1;
        this.meta = {};
        this.extra = {};
        this.appVersion = '';
    }    

    addStack(error)
    {
        if (!error) return;
       
        var stack = {args:[], line:-1, column:-1, func:'', context:'', url:''};
        
        if (error.stack || error.stacktrace) 
            stack.context = error.stack || error.stacktrace;

        if (error.fileName) 
            stack.url = error.fileName;
        
        if (error.lineNumber)
            stack.line = error.lineNumber;

        if (error.columnNumber)
            stack.column = error.columnNumber;

        if (error.toSource && !error.stack && !error.stacktrace)
            stack.context = error.toSource();
        this.stack.push(stack);
    }
}