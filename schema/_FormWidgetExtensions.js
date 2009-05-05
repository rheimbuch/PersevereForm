dojo.provide("yogo.schema._FormWidgetExtensions");

dojo.require('dijit.form._FormMixin');
dojo.require('dijit.form._FormWidget');
dojo.require('dijit.form.DateTextBox');
dojo.require('dijit.form.TimeTextBox');

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
    _setJsonValueAttr: function(obj, priorityChange) {
        dojo.forEach(this.getChildren(), function(widget){
            if(!widget.name){ return; }
            if(obj.hasOwnProperty(widget.name) && (obj[widget.name] != undefined)){
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
        
        var result = map[this.format] ? this._setValueAttr( map[this.format](value), priorityChange || false) : this._setValueAttr(map['date-time'](value), priorityChange || false);
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
        return this._setValueAttr(dojo.date.locale.parse(val, {selector: 'time', timePattern: 'hh:mm:ss'}), priorityChange || false);
    }
});
