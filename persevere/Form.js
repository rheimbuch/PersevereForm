dojo.provide('yogo.persevere.Form');

dojo.require('yogo.schema.Form');

dojo.declare('yogo.persevere.Form', yogo.schema.Form, {
    store: null,
    item: null,
    updateStoreOnChange: true,
    updateFormOnStoreChange: true,
    _setStoreAttr: function(store){
        if(store.schema) { 
            this.store = store;
            dojo.connect(store, "onSet", this, "_onStoreItemUpdate");
            this.attr('schema', store.schema);
        };
    },
    _setItemAttr: function(item) {
        this.item = item;
        this._updateFormFromItem();
    },
    _onStoreItemUpdate: function(item, attribute, oldValue, newValue) {
        if(this.updateFormOnStoreChange && (this.item.id == item.id)){
            this._updateFormFromItem();
        }
    },
    _updateFormFromItem: function() {
        this.attr('jsonValue', this.item);
    },
    onChange: function(value){
        if(this.item && this.updateStoreOnChange){
            // for(var name in value){
            //     this.store.setValue(this.item, name, value[name]);
            // }
            this.save();
        }
    },
    save: function() {
        if(!this.store) { return; }
        if(this.item){
            var value = this.attr('jsonValue');
            for(var name in value){
                this.store.setValue(this.item, name, value[name]);
            }
        }
        else {
            this.attr('item', this.store.newItem(this.attr('jsonValue')));
        }
    }
});