dojo.provide('yogo.schema.Form');

dojo.require('dijit.form.Form');
dojo.require('yogo.schema._FormBuilder');

dojo.declare('yogo.schema.Form', [dijit.form.Form, yogo.schema._FormBuilder], {
    schema:null,
    postCreate: function() {
        if(this.schema){
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
        }
        this.inherited("postCreate", arguments);
    },
    _buildObjectElement: function(entry, options){
        
        options.schema = entry;
        var form = new yogo.schema.Form(options);
        return form;
    }
})