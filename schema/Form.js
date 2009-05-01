dojo.provide('yogo.schema.Form');

dojo.require('dijit.form.Form');
dojo.require('yogo.schema._FormBuilder');

dojo.declare('yogo.schema.Form', [dijit.form.Form, yogo.schema._FormBuilder], {
    schema:null,
    postCreate: function() {
        this._buildForm();
        this.inherited(arguments);
    },
    _setSchemaAttr: function(schema){
        this.schema = schema;
        if(this._created) { this._buildForm() };
    },
    _buildObjectElement: function(entry, options){
        options.schema = entry;
        var form = new yogo.schema.Form(options);
        return form;
    },
    _buildForm: function() {
        if(this.schema){
        
            console.debug("Building Form for: " + this.schema.id);
            console.debug(this.schema);
            // Clear existing form elements & labels
            this.destroyDescendants();
            dojo.empty(this.domNode);
        
            // Build new form elements
            var subElements = this._buildFormElements(this.schema);
            var elementList = dojo.create('ul');
            this.domNode.appendChild(elementList);
            for(var name in subElements){
                var listItem = dojo.create('li');
                var label = dojo.create('label');
                dojo.attr(label, "for", subElements[name].name);
                dojo.attr(label, "innerHTML", (subElements[name].label || subElements[name].name));
                listItem.appendChild(label);
                listItem.appendChild(subElements[name].domNode);
                elementList.appendChild(listItem);
            }
            this.connectChildren();
        }
    },
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
    _setJsonValueAttr: function(/*Object*/ obj) {
        dojo.forEach(this.getChildren(), function(widget){
            if(!widget.name){ return; }
            if(obj.hasOwnProperty(widget.name) && (obj[widget.name] != undefined)){
                widget.attr('jsonValue', obj[widget.name]);
            }
        });
    },
    _valueChange:function(/*Object*/ value) {
        this.inherited(arguments);
        if(this.name){
            var val = {};
            val[name] = value;
        }
        else { val = value; }
        
        this.onChange(val);
    },
    onChange: function(){},
    clear: function(){
        dojo.forEach(this.getDescendants(), function(widget){
            widget.attr('value', null);
        });
    }

});