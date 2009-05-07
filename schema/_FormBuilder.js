dojo.provide('yogo.schema._FormBuilder');

dojo.require('yogo.schema._FormWidgetExtensions');

dojo.declare('yogo.schema._FormBuilder', null, {
    _buildForm: function(schema) {
        var form = this._buildObjectElement(schema, {});
        return form;
    },
    _buildFormElements: function(schema) {
        if(schema.properties){
            var schema = schema.properties;
        }
        var formElements = {};
        // Handle top level properties in schema
        for(var name in schema){
            // process each schema entry if not a hidden field (__field:"isHidden")
            if(! /^__.+$/.test(name)) {
                formElements[name] = this._buildEntry(name, schema[name]);
            }
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
            "object": this._buildObjectElement,
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
        
        var options = {};
        options.name = name;
        options.label = entry.title || name;
        // handle optional
        options.required = !entry.optional;
        options.promptMessage = options.required ? "This field is required" : "";
        console.debug("Options in buildEntry");
        console.debug(options);
        
        var field = ( typeMap[type] ? typeMap[type](entry, options) : typeMap.DEFAULT(entry, options) );
        dojo.connect(field, "onChange", dojo.hitch(this, function(value){
            if(name){
                var newVal = {};
                newVal[name] = value;
                console.debug(newVal);
                this._valueChange(newVal);
            }
        }));
        return field;
    }, 
    _valueChange:function(){},
    _buildStringElement:function(entry, options){
        // type == 'string'
        var options = options || {};
        console.debug("options at beginning of buildStringElement");
        console.debug(options);
        field = null;
        
        // handle maxLength:
        if(entry.maxLength) {options.maxLength = entry.maxLength;}
        
        // handle minLength:
            // Still need to do this...
            
        // handle format:
        var formatMap = dojo.mixin({
            "date": function(options){
                dojo.require('dijit.form.DateTextBox');
                options.schemaFormat = "date";
                return new dijit.form.DateTextBox(options);
            },
            "time": function(options){
                dojo.require('dijit.form.TimeTextBox');
                return new dijit.form.TimeTextBox(options);
            },
            "date-time": function(options){
                dojo.require('dijit.form.DateTextBox');
                options.schemaFormat = "date-time";
                return new dijit.form.DateTextBox(options);
            },
            "utc-millisec": null,
            "regex": null,
            "color": null,
            "phone": null,
            "uri": null,
            "url": null,
            "email": function(options){
                options.regExp = '.+@.+';
                options.promptMessage = "A valid email is required.";
                return new dijit.form.ValidationTextBox(options);
            },
            "ip-address": function(options){
                options.regExp = '\d{3}.\d{3}.\d{3}.\d{3}';
                return new dijit.form.ValidationTextBox(options);
            } 
        }, this.formatMap);
        
        if(formatMap[entry.format]){
            console.debug("building using format: " + entry.format);
            field = formatMap[entry.format](options);
        }
        else {
            // handle pattern: (regex).
            if(entry.pattern){
                options.regExp = entry.pattern;
            }
            dojo.require('dijit.form.ValidationTextBox');
            // console.debug(entry);
            // console.debug(options);
            field = new dijit.form.ValidationTextBox(options);
        }
        
        console.debug('options at end of buildStringElement');
        console.debug(options);
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
        // aCheckBox.attr('label', 'foo') blows up if aCheckBox.containerNode == null
        //  so we'll hack it and set it manually
        var label = options.label;
        delete options.label;
        
        var field =  new dijit.form.CheckBox(options);
        field.label = label;
        field.schema = entry;
        return field;
    },
    _buildObjectElement: function(entry, options){
        dojo.require('yogo.schema.Form');
        
        var form = new yogo.schema.Form(options);
        form.schema = entry;
        var subElements = this._buildFormElements(entry);
        console.debug(subElements);
        for(var name in subElements){
            form.domNode.appendChild(subElements[name].domNode);
        }
        return form;
    }

});