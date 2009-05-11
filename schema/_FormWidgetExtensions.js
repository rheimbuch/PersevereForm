dojo.provide("yogo.schema._FormWidgetExtensions");

dojo.require('dijit.form._FormMixin');
dojo.require('dijit.form._FormWidget');
dojo.require('dijit.form.DateTextBox');
dojo.require('dijit.form.TimeTextBox');
dojo.require('dijit.form.NumberTextBox');
dojo.require('dijit.form.ToggleButton');
dojo.require('dijit.form.CheckBox');

dojo.extend(dijit.form._FormMixin, {
    _getJsonValueAttr: function() {
        var obj = {};
        dojo.forEach(this.getChildren(), function(widget){
            var name = widget.name;
            if(!name||widget.disabled){ return; }
        
            var value = widget.attr('jsonValue');
            
            dojo.setObject(name, value, obj);
        });
        
        return obj;
    },
    _setJsonValueAttr: function(obj) {
        dojo.forEach(this.getChildren(), function(widget){
            if(!widget.name){ return; }
            if(obj.hasOwnProperty(widget.name) && (obj[widget.name] !== undefined)){
                widget.attr('jsonValue', obj[widget.name]);
            }
        });
    }
});

dojo.extend(dijit.form._FormWidget, {
    /*
    Implement attr('jsonValue') & attr('jsonValue', value).
        By default simply passes through to attr('value').
        Specialized by specific _FormWidget subclasses to return
        specialized values, for integration with JSON and Persevere.
    */
    _getJsonValueAttr: function() {
        return this.attr('value');
    },
    _setJsonValueAttr: function(value) {
        return this._setValueAttr(value, false);
    }
});

/*  Extend DateTextBox to return specialized 
        jsonValue attributes, based on the 
        "format" attribute.
*/
dojo.extend(dijit.form.DateTextBox, {
    schemaFormat: "date-time",
    _getJsonValueAttr: function() {
        var map = {
            "date-time": function(value) {
                if(value) {
                    return dojo.date.stamp.toISOString(value);
                }
                else {
                    return value;
                }
            },
            "date": function(value) {
                if(value) {
                    return dojo.date.locale.format(value, {selector: 'date', 
                                                                datePattern: 'yyyy-MM-dd'
                                                                });
                }
                else {
                    return value;
                }
            }
        };
        
        return (map[this.schemaFormat] ? map[this.schemaFormat](this.attr('value')) : this.attr('value'));
    },
    _setJsonValueAttr: function(value) {
        var map = {
            "date-time": function(value) {
                return dojo.date.stamp.fromISOString(value);
            },
            "date": function(value) {
                return dojo.date.locale.parse(value, {selector: 'date', 
                                                        datePattern: 'yyyy-MM-dd'
                                                        });
            }
        };
        
        var result = map[this.format] ? this._setValueAttr( map[this.format](value), false) : this._setValueAttr(map['date-time'](value), priorityChange || false);
        return result;
    }
});

dojo.extend(dijit.form.TimeTextBox, {
    _getJsonValueAttr: function() {
        var value = this.attr('value');
        if(value) {
            return dojo.date.locale.format(value, {selector: 'time', timePattern: 'hh:mm:ss'});
        }
        else {
            return value;
        }
    },
    _setJsonValueAttr: function(value) {
        return this._setValueAttr(dojo.date.locale.parse(val, {selector: 'time', timePattern: 'hh:mm:ss'}), false);
    }
});

dojo.extend(dijit.form.NumberTextBox, {
    _getJsonValueAttr: function() {
        function isNumber(value) { 
            return typeof value === 'number' && isFinite(value);
        }
        var value = this.attr('value');
        return isNumber(value) ? value : 0;
    }
});

/* Unlike the other form widgets, CheckBox subclasses ToggleButton. Unfortunately,
    ToggleButton ALWAYS sends the onChange event when you set attr('checked' true|false).
    These extensions override that behavior in both ToggleButton and Checkbox, and allow
    attr('checked') and attr('value') to be set programmatically without firing
    the onChange event. Eventually we should see if this can be upstreamed into
    dojo trunk.
*/
dojo.extend(dijit.form.ToggleButton, {
    _setCheckedAttr: function(/*Boolean*/ value, /*Boolean?*/ priorityChange){
        if(priorityChange !== false){
            var priorityChange = true;
        }
		this.checked = value;
		dojo.attr(this.focusNode || this.domNode, "checked", value);
		dijit.setWaiState(this.focusNode || this.domNode, "pressed", value);
		this._setStateClass();		
		this._handleOnChange(value, priorityChange);
	}
});

dojo.extend(dijit.form.CheckBox, {
    _setValueAttr: function(/*String or Boolean*/ newValue, /*Boolean?*/ priorityChange){
		// summary:
		//		Handler for value= attribute to constructor, and also calls to
		//		attr('value', val).
		// description:
		//		During initialization, just saves as attribute to the <input type=checkbox>.
		//		
		//		After initialization,
		//		when passed a boolean, controls whether or not the CheckBox is checked.
		//		If passed a string, changes the value attribute of the CheckBox (the one
		//		specified as "value" when the CheckBox was constructed (ex: <input
		//		dojoType="dijit.CheckBox" value="chicken">)
		if(typeof newValue == "string"){
			this.value = newValue;
			dojo.attr(this.focusNode, 'value', newValue);
			newValue = true;
		}
		if(this._created){
			//this.attr('checked', newValue);
			this._setCheckedAttr(newValue, priorityChange);
		}
	}
});
