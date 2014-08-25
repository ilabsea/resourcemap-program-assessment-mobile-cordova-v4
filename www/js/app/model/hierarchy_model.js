Hierarchy = {
  _display: "",
  _data: [],
  _value: "",
  setData: function(field) {
    this._data = field["hierarchy"];
  },
  generateField: function(field, value) {
    this._display = "";
    this._value = value;
    this.setData(field);
    this.processHierarchy(this._data);
    return this._data;
  },
  processHierarchy: function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].sub) {
        data[i].children = data[i].sub;
        delete data[i].sub;
        this.processHierarchy(data[i].children);
      }
    }
  },
  renderDisplay: function(id, data) {
    var $tree1 = $("#" + id);

    $tree1.tree({
      data: data,
      autoOpen: false,
      dragAndDrop: false,
      selectable: true,
      closedIcon: $('<img src="img/folder.png" width="30" style="vertical-align: middle;">'),
      openedIcon: $('<img src="img/folder_open.png" width="30" style="vertical-align: middle;">>')
    });
    console.log(" $tree1 : ", $tree1);
  }
};