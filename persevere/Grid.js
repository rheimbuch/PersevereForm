dojo.provide("yogo.persevere.Grid");
dojo.require("dojox.grid.DataGrid");

dojo.declare("yogo.persevere.Grid", [dojox.grid.DataGrid], {
    contextMenu:null,
    
    onCellContextMenu: function(e){
        //console.log(e);
    },
	_formatCell: function(value){
		if(this.store.isItem(value)){
			return this.store.getLabel(value) || this.store.getIdentity(value);
		}
		return value;
	},
	// setStore: function() {
	// 	//Save binding to current instance
	// 	var self = this;
	// 	//Call superclass
	// 	this.inherited(arguments);
	// },
	
	// Taken from Kris Zyp's Persevere Explorer code.
	_onFetchComplete: function(items, req){
		var store = this.store;
		var layout = [];
		var column, key, item, i, j, k, idAttributes = store.getIdentityAttributes();
		for(i = 0; i < idAttributes.length; i++){
			key = idAttributes[i];
			layout.push({
				field: key, 
				name: key, 
				_score: 100, 
				formatter: dojo.hitch(this, "_formatCell"), 
				editable: false
			});

		}
		for(i=0; item = items[i++];){
			var keys = store.getAttributes(item);
			for(k=0; key = keys[k++];){
				var found = false;
				for(j=0; column = layout[j++];){
					if(column.field == key){
						column._score++;
						found = true;
						break;
					}
				}
				if(!found){
					layout.push({
						field: key, 
						name: key, 
						_score: 1, 
						formatter: dojo.hitch(this, "_formatCell"),
						styles: "white-space:nowrap; ", 
						editable: true
					});
				}
			}					
		}
		layout = layout.sort(function(a, b){
			return a._score > b._score ? -1 : 1;
		});
		for(j=0; column = layout[j]; j++){
			if(column._score < items.length/40 * j){
				layout.splice(j,layout.length-j);
				break;
			}
		}
		for(j=0; column = layout[j++];){
			column.width=Math.round(100/layout.length) + '%';
		}
		this.attr("structure",layout);
		this.inherited(arguments);
	}
	
});