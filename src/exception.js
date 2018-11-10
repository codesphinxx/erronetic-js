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
        this.parent_url = location.href;
        this.user_agent = navigator.userAgent;
        this.secret = '';
        this.browser = '';
        this.browser_name = '';
        this.logger = 'javascript';
        this.version = __VERSION__;
        this.client_id = -1;
        this.meta = {};
        this.extra = {};
        this.appVersion = '';
        if (window.location!=window.parent.location || parent !== window)
            this.parent_url = window.parent.location.href;
        else if (window.frameElement)
            this.parent_url = window.frameElement.src;
        else if (window != top || top !== self)
            this.parent_url = top.location.href;
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