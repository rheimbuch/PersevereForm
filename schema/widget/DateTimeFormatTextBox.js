dojo.provide('yogo.schema.widget.DateTimeFormatTextBox');

dojo.require('dijit.form.DateTextBox');

dojo.declare('yogo.schema.widget.DateTimeFormatTextBox', dijit.form.DateTextBox, {
    _getValueAttr: function(){
        if(this.value) {
            return dojo.date.stamp.toISOString(this.value);
        }
        else {
            return null;
        }
    }, 
    _setValueAttr: function(val){
        if(val){
            this.value = dojo.date.stamp.fromISOString(val);
        }
        else {
            this.value = null;
        }
    }
});