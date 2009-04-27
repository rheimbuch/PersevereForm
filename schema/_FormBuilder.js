dojo.provide('yogo.schema._FormBuilder');

dojo.schema._FormBuilder = {
    build: function(schema) {
        if(schema.properties)){
            var schema = schema.properties;
        }
        var formElements = {};
        // Handle top level properties in schema
        for(var name in schema){
            // process each schema entry
            formElements[name] = this._buildEntry(name, schema[name]);
        }
        
        // process the title:
        // process the description
        // process the type
            // type == 'string'
                // handle pattern: (regex)
                // handle maxLength:
                // handle minLength:
                // handle format:
            // type == 'number'
                // handle minimum:
                // handle maximum:
                // handle maxDecimal:
            // type == 'array'
                // handle items definition
                // handle maxItems:
                // handle minItems:
            // handle optional:true
            // handle enum:
            // handle options:
                // handle unconstrained:true
            // handle readonly:true
            // handle default:
            // handle hidden:true
            // handle disallow:
            // handle extends:
            
        return formElements;
             
    },
    _buildEntry(/*String*/ name, /*JsonSchema Entry*/ entry){
        if(entry.type){
            var type = entry.type;
            if(dojo.isArray(type))
                type = 'array';
            else if(dojo.isObject(type))
                type = 'object';
        }
        else {
            var type = 'object';
        }
        
        var options = {name: name};
        // handle optional
        options.required = entry.optional || true;
        
        switch(type){
            case "string":
                // Handle string
                return this._buildStringElement(entry, options);
                break;
            case "number":
                // Handle number
                return this._buildNumberElement(entry, options);
                break;
            case "integer":
                // Handle integer
                return this._buildNumberElement(entry, options);
                break;
            case boolean:
                // Handle boolean
                break;
            case "object":
                // Handle object
                break;
            case "array":
                // Handle array
                break;
            case "null":
                // Handle null
                break;
            case "any":
                // Handle any. Probably default to string?
                break;
        }
    }, 
    _buildStringElement(entry, options){
        // type == 'string'
        var options = options || {};
        
        field = null;
        
        // handle maxLength:
        if(entry.maxLenth) options.maxLength = entry.maxLength;
        
        // handle minLength:
            // Still need to do this...
            
        // handle format:
        if(entry.format){
            switch(entry.format){
                case "date":
                    // Create a DateTextBox
                    dojo.require('dijit.form.DateTextBox');
                    field =  new dijit.form.DateTextBox(options);
                    break;
                case "time":
                    // Create a TimeTextBox
                    dojo.require('dijit.form.TimeTextbox');
                    var field = new dijit.form.TimeTextBox(options);
                    break;
                case "date-time":
                    // Create DateTextBox ???
                    break;
                case "utc-millisec":
                    // regex?
                    break;
                case "regex":
                    //regex?
                    break;
                case "color":
                    // CSS color ("red" or "#FFFFFF")
                    break;
                case "phone":
                    // regex for phone number?
                    break;
                case "uri":
                    // regex for uri?
                    break;
                case "url":
                    // regex for absolute or relative url?
                    break;
                case "email":
                    // simple email regexp
                    options.regExp = ".+@.+";
                    break;
                case "ip-address":
                    options.regExp = "\d{3}.\d{3}.\d{3}.\d{3}";
                    break;
            }
        }
        
        // handle pattern: (regex). pattern will override format
        if(entry.pattern) {
            options.regExp = entry.pattern;
            
        }
        
        // if we have a Regular Expression in our options...
        if(options.regExp){
            dojo.require('dijit.form.ValidationTextBox');
            field = new dijit.form.ValidationTextBox(options);
        }
        // or handle plain string with no further validation
        else {
            dojo.require('dijit.form.TextBox');
            field = new dijit.form.TextBox(options);
        }
        field.schema = entry;
        
    }, 
    _buildNumberElement: function(entry, options){
        dojo.require('dijit.form.NumberTextBox');
        
        var options = options || {};
        options.constraints = options.constraints || {};
        var type = entry.type;
        
        // handle integers
        if(type == "integer") options.constraints.places = 0; 
        
        // handle minimum:
        if(entry.minimum) options.constraints.min = entry.minimum;
        
        // handle maximum:
        if(entry.maximum) options.constraints.max = entry.maximum;
        
        // handle maxDecimal:
        if(entry.maxDecimal) options.constraints.places = entry.maxDecimal;
        
        var field = new dijit.form.NumberTextBox(options);
        field.schema = entry;
        return field;
    },
    _buildBooleanElement: function(entry, options){
        dojo.require('dijit.form.CheckBox');
        
        options.value = true;
        options.checked = false
        
        var field =  new dijit.form.CheckBox(options);
        field.schema = entry;
        return field;
    }

};