dojo.provide('yogo.persevere.Form');

dojo.require('yogo.schema.Form');

dojo.declare('yogo.persevere.Form', yogo.schema.Form, {
    store: null,
    item: null,
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
        if(this.item.id == item.id){
            this._updateFormFromItem();
        }
    },
    _updateFormFromItem: function() {
        this.attr('jsonValue', this.item);
    }
});