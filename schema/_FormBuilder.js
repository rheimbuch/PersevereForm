dojo.provide('yogo.schema._FormBuilder');

yogo.schema._FormBuilder = {
    buildFormElements: function(schema) {
        if(schema.properties){
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
    _buildEntry:function(/*String*/ name, /*JsonSchema Entry*/ entry){
        var typeMap = dojo.mixin({
            DEFAULT: this._buildStringElement,
            "string": this._buildStringElement,
            "number": this._buildNumberElement,
            "integer": this._buildNumberElement,
            "boolean": this._buildBooleanElement,
            "date": null,
            "object": null,
            "array": null,
            "null": null,
            "any": null
        }, this.typeMap);
        
        if(entry.type){
            var type = entry.type;
            if(dojo.isArray(type)){
                type = 'array';
            }
            else if(dojo.isObject(type)){
                type = 'object';
            }
        }
        else {
            var type = 'object';
        }
        
        var options = {name: name};
        // handle optional
        options.required = entry.optional || true;
        
        return ( typeMap[type] ? typeMap[type](entry, options) : this.typeMap.DEFAULT(entry, options) );
    }, 
    _buildStringElement:function(entry, options){
        // type == 'string'
        var options = options || {};
        
        field = null;
        
        // handle maxLength:
        if(entry.maxLenth) {options.maxLength = entry.maxLength;}
        
        // handle minLength:
            // Still need to do this...
            
        // handle format:
        var formatMap = dojo.mixin({
            "date": function(options){
                dojo.require('yogo.schema.widget.DateFormatTextBox');
                return new yogo.schema.widget.DateFormatTextBox(options);
                // dojo.require('dijit.form.DateTextBox');
                // return new dijit.form.DateTextBox(options);
            },
            "time": function(options){
                dojo.require('yogo.schema.widget.TimeFormatTextBox');
                return new yogo.schema.widget.TimeFormatTextBox(options);
            },
            "date-time": function(options){
                dojo.require('yogo.schema.widget.DateTimeFormatTextBox');
                return new yogo.schema.widget.DateTimeFormatTextBox(options);
            },
            "utc-millisec": null,
            "regex": null,
            "color": null,
            "phone": null,
            "uri": null,
            "url": null,
            "email": function(options){
                options.regExp = '.+@.+';
                return new dijit.form.ValidationTextBox(options)
            },
            "ip-address": function(options){
                options.regExp = '\d{3}.\d{3}.\d{3}.\d{3}';
                return new dijit.form.ValidationTextBox(options)
            } 
        }, this.formatMap);
        
        if(formatMap[entry.format]){
            console.debug("building using format: " + entry.format);
            field = formatMap[entry.format](options);
        }
        else {
            // handle pattern: (regex).
            if(entry.patter){
                options.regExp = entry.pattern;
            }
            dojo.require('dijit.form.ValidationTextBox');
            field = new dijit.form.ValidationTextBox(options);
        }
        
        // save the schema into the element
        field.schema = entry;
        return field;
    }, 
    _buildNumberElement: function(entry, options){
        dojo.require('dijit.form.NumberTextBox');
        
        var options = options || {};
        options.constraints = options.constraints || {};
        var type = entry.type;
        
        // handle integers
        if(type == "integer") {options.constraints.places = 0;}
        
        // handle minimum:
        if(entry.minimum) {options.constraints.min = entry.minimum;}
        
        // handle maximum:
        if(entry.maximum) {options.constraints.max = entry.maximum;}
        
        // handle maxDecimal:
        if(entry.maxDecimal) {options.constraints.places = entry.maxDecimal;}
        
        var field = new dijit.form.NumberTextBox(options);
        field.schema = entry;
        return field;
    },
    _buildBooleanElement: function(entry, options){
        dojo.require('dijit.form.CheckBox');
        
        options.value = true;
        options.checked = false;
        
        var field =  new dijit.form.CheckBox(options);
        field.schema = entry;
        return field;
    }

};