var UserList = {
  __users : [],
  add: function(user){
    UserList.remove(user.id);
    UserList.__users.push(user);
  },
  remove: function(id){
    for (var i = 0; i < UserList.count(); i++) {
      var user = UserList.get()[i];
      if (user.id === id) {
        return UserList.__users.splice(i, 1);
      }
    }
  },
  getUserValue: function(id){
    for (var i = 0; i < UserList.count(); i++) {
      var user = UserList.get()[i];
      if (user.id === id) {
        return user.value;
      }
    }
  },
  get: function(){
    return UserList.__users;
  },
  clear: function(){
    UserList.__users = [];
  },
  count: function(){
    return UserList.__users.length;
  }
};

function UserField(id, value) {
  this.id = id;
  this.value = value;
}