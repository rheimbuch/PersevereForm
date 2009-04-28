dojo.provide('yogo.schema.widget.TimeFormatTextBox');

dojo.require('dijit.form.TimeTextBox');

dojo.declare('yogo.schema.widget.TimeFormatTextBox', dijit.form.TimeTextBox, {
    schemaTimeFormat: {selector: 'time', timePattern: 'hh:mm:ss'},
    _getValueAttr: function(){
        if(this.value) {
            return dojo.date.locale.format(this.value, this.schemaTimeFormat);
        }
        else {
            return null;
        }
    }, 
    _setValueAttr: function(val){
        if(dojo.isString(val)){
            this.value = dojo.date.locale.parse(val, this.schemaTimeFormat);
        }
        else {
            this.value = val;
        }
    }
});