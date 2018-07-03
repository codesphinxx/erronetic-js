# Erronetic-js
Erronetic is a JavaScript error tracking library
Build v0.0.5

## Build
1. Install dependencies: `npm install`
2. Build: `npm run build`

## Quick Start
Include a reference to the Erronetic library
```html
<script src="/erronetic.min.js"></script>
```


### erronetic.init
Initializes the erronetic logging service.
```html
erronetic.init(API_KEY, { url:String, method:String, debug:Boolean });
```
API_KEY: application api key(only required when saving errors to our hosted service)
options: options used internally to route logs


### erronetic.writeException
Sends a error exception.
```html
erronetic.writeException(error, data);
```
error (required): a JavaScript Error object
data: additional data to send(must contains values of string, number, or boolean)


### erronetic.writeMessage
Sends a custom info-level message.
```html
erronetic.writeMessage(message, data);
```
message (required): 
data: additional data to send(must contains values of string, number, or boolean)


### erronetic.setMetaContext
Assigns custom meta data that will be sent along with each exception.
```html
erronetic.setMetaContext(data);
```
data (required): custom meta data, can be user to store user details