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
            this._storeOnSetConnection && dojo.disconnect(this._storeOnSetConnection);
            this._storeOnSetConnection = dojo.connect(store, "onSet", this, "_onStoreItemUpdate");
            this.attr('schema', store.schema);
        };
    },
    _setItemAttr: function(item) {
        var itemStore = dojox.data._getStoreForItem(item);
        if(itemStore !== this.store){
            this.attr('store', itemStore);
        }
        this._loadItem(item);
        console.debug(item);
        this.item = item;
        this._updateFormFromItem();
    },
    _loadItem: function(item) {
        var self = this;
        var isItem = this.store && this.store.isItem(item, true);
        // Force loading of lazy values
        var attributes = this.store.getAttributes(item);
        dojo.forEach(attributes, function(prop){
            //console.debug("processing: " + prop);
            dojox.rpc._sync = true; 
            var value = dojox.data.ServiceStore.prototype.loadItem({item:item[prop]});
            //console.debug(value);
            if(dojo.isObject(value) ){
                self._loadItem(value);
            }
        });
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
            this.saveForm();
        }
    },
    saveItem: function(item) {
        var item = item || this.item;
        if(!item){ return; }
        
        var store = dojox.data._getStoreForItem(item);
        if(!store){ return; }
        store.save();
        
        for(var prop in item){
            console.debug(prop);
            item[prop] && this.saveItem(item[prop]);
        }
    },
    saveForm: function() {
        if(!this.store) { return; }
        
        var value = this.attr('jsonValue');
        if(this.item){
            this._mergeItem({value: value});
        }
        else {
            this.attr('item', this.store.newItem(value));
        }
    },
    _mergeItem: function(opts){
        var item = opts.item || this.item;
        var value = opts.value || {};
        for(var name in value){
            if(item[name] && item[name]['__id']){
                console.debug("Preparing to merge: " + name);
                console.debug(item[name]);
                this._mergeItem({item: item[name], value: value[name]});
            }
            else{
                
                if(item[name] !== value[name]){
                    console.debug("setValue("+name+")");
                    console.debug(value[name]);
                    this.store.setValue(item, name, value[name]);
                }
            }
        }
    }
});