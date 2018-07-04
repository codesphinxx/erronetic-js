const LEVELS = ['info','warn','error'];
const PRIMITIVES = ['undefined','boolean','number','string'];

export default class utils
{
    constructor()
    {
        throw new Error('This is a static class');
    }

    static stringify(value)
    {
        if (value === null) return '';
        if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'undefined') return '';
        
        var result = '';
    
        if (Array.isArray(value))
        {
            result = '';
            for(var i = 0; i < value.length; i++)
            {
                var data_type = typeof value[i];
                if (PRIMITIVES.indexOf(data_type) != -1)
                {
                    result += i===0 ? utils.stringify(value[i]) : ' ' + utils.stringify(value[i]);
                }
                else
                {
                    result += i===0 ? utils.stringify(value[i]) : ', ' + utils.stringify(value[i]);
                }                
            }
        }
        else if (typeof value === 'object')
        {
            var index = 0;
            result = '{';
            for (var key in value)
            {
                var node = key.toString() + ': ';
                node += Array.isArray(value[key]) ? ('[' + utils.stringify(value[key]) + ']') : utils.stringify(value[key]);
                result += index===0 ? node : ', ' + node;
                index++;
            }  
            if (index === 0 && value.toString)
            {
                result += value.toString();
            }  
            result += '}';        
        }
        else
        {
            result += value;
        }        
    
        return result;
    }

    static primitify(value)
    {
        if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'undefined' || value === null) return {};
        
        var result;
    
        if (Array.isArray(value))
        {
            result = [];
            for(var i = 0; i < value.length; i++)
            {
                var data_type = typeof value[i];
                if (PRIMITIVES.indexOf(data_type) != -1)
                {
                    result.push(value[i]);
                }                
            }
        }
        else if (typeof value === 'object')
        {
            result = {};
            for (var key in value)
            {
                var data_type = typeof value[key];
                if (PRIMITIVES.indexOf(data_type) != -1)
                {
                    result[key] = value[key];
                }
            }          
        }
        else
        {
            result = value;
        }        
    
        return result;
    }

    static isLogLevel(value)
    {
        return value ? (LEVELS.indexOf(value) !== -1) : false;
    }

    static isObject(what) 
    {
        return typeof what === 'object' && what !== null;
    }
      
    static isError(value) 
    {
        switch ({}.toString.call(value)) 
        {
          case '[object Error]':
            return true;
          case '[object Exception]':
            return true;
          case '[object DOMException]':
            return true;
          default:
            return value instanceof Error;
        }
    }
    
    static isNull(value) 
    {
        return value == null || value == undefined;
    }

    static isNullOrEmpty(value)
    {
        if (value === null || value === undefined)
            return true;

        if (!value instanceof String)
        {
            throw new TypeError('value must be of type String.')
        }

        var text = value.replace('/ /g', '');

        if (text.length === 0)
            return true;
    }

    static mergeObjects(target, modifier) 
    {
        if (!modifier) return target;
        
        for (var i in modifier) 
        {
            try 
            {
                target[i] = modifier[i].constructor==Object ? mergeObjetcs(target[i], modifier[i]) : modifier[i];
            } 
            catch(e) 
            {
                target[i] = modifier[i];
            }
        }
        return target;
    }

    static getPlugins() 
    {
        var pluginsList = "";
  
        for (var i = 0; i < navigator.plugins.length; i++) 
        {
          if (i == navigator.plugins.length - 1) 
          {
            pluginsList += navigator.plugins[i].name;
          } 
          else 
          {
            pluginsList += navigator.plugins[i].name + ", ";
          }
        }
        return pluginsList;
    }

    static isLocalStorage() 
    {
        try 
        {
          return !!window.localStorage;
        } 
        catch (e) 
        {
          return true; 
        }
    }
  
    static isSessionStorage() 
    {
        try 
        {
          return !!window.sessionStorage;
        } 
        catch (e) 
        {
          return true;
        }
    }

    static getTimeZone()
    {
        return String(String(new Date()).split("(")[1]).split(")")[0];
    }

    static getScreenPrint()
    {
        return "Current Resolution: " + screen.width + "x" + screen.height 
        + ", Available Resolution: " + screen.availWidth + "x" + screen.availHeight 
        + ", Color Depth: " + screen.colorDepth + ", Device XDPI: " + screen.deviceXDPI + 
        ", Device YDPI: " + screen.deviceYDPI;
    }
}