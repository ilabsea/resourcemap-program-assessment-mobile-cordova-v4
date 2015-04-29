var SearchList = {
  fields : [],
  add: function(field){
    SearchList.remove(field.id);
    SearchList.fields.push(field);
  },
  remove: function(id){
    for (var i = 0; i < SearchList.count(); i++) {
      var user = SearchList.get()[i];
      if (user.id === id) {
        return SearchList.fields.splice(i, 1);
      }
    }
  },
  getFieldValue: function(id){
    for (var i = 0; i < SearchList.count(); i++) {
      var field = SearchList.get()[i];
      if (field.id == id) {
        return field.value;
      }
    }
  },
  get: function(){
    return SearchList.fields;
  },
  clear: function(){
    SearchList.fields = [];
  },
  count: function(){
    return SearchList.fields.length;
  }
};

function SearchField(id, value) {
  this.id = id;
  this.value = value;
}