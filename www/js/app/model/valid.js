function Valid(id, isValid) {
  this.id = id;
  this.isValid = isValid;
}

var ValidList = {
  __valid: [],
  addValid: function (valid) {
    ValidList.remove(valid.id);
    ValidList.__valid.push(valid);
  },
  remove: function (id) {
    for (var i = 0; i < ValidList.count(); i++) {
      var valid = ValidList.getValid()[i];
      if (valid.id == id) {
        return ValidList.__valid.splice(i, 1);
      }
    }
  },
  count: function () {
    return ValidList.__valid.length;
  },
  getValid: function () {
    return ValidList.__valid;
  },
  clear: function () {
    ValidList.__valid = [];
  }
};