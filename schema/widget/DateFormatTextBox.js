dojo.provide('yogo.schema.widget.DateFormatTextBox');

dojo.require('dijit.form.DateTextBox');

dojo.declare('yogo.schema.widget.DateFormatTextBox', dijit.form.DateTextBox, {
    schemaDateFormat: {selector: 'date', datePattern: 'yyyy-MM-dd'},
    _getValueAttr: function(){
        if(this.value) {
            return dojo.date.locale.format(this.value, this.schemaDateFormat);
        }
        else {
            return null;
        }
    }, 
    _setValueAttr: function(val){
        if(val){
            this.value = dojo.date.locale.parse(val, this.schemaDateFormat);
        }
        else {
            this.value = null;
        }
    }
});