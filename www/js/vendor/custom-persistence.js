persistence.DbQueryCollection.prototype.listFields = function(tx, fields, callback) {
	persistence.selectedFields = {fields : fields};
	this.list(tx, function(results){
		persistence.selectedFields = null;
		persistence.clean();
		callback(results);
	});
}

persistence.getMeta = function(entityName) {
	var result = persistence.selectedFields ? persistence.selectedFields : persistence.getEntityMeta()[entityName];
	return result;
}
