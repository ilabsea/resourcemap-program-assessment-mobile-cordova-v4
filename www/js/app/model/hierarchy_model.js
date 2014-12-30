Hierarchy = {
  _data: [],
  _value: "",
  _selected: "",
  setData: function(field) {
    this._data = field["hierarchy"];
  },
  generateField: function(field, value, id) {
    this._value = value;
    this.setData(field);
    this.processHierarchy(this._data, id);
    return this._data;
  },
  processHierarchy: function(data, id) {
    for (var i = 0; i < data.length; i++) {
      this.setSelected(data[i], id);
      if (data[i].sub) {
        data[i].children = data[i].sub;
        delete data[i].sub;
        this.processHierarchy(data[i].children);
      }
      if (data[i].children) {
        this.processHierarchy(data[i].children);
      }
    }
  },
  setSelected: function(record) {
    if (record.id == this._value || record.name == this._value) {
      this._selected = record.id;
      return this._selected;
    }
  },
  renderDisplay: function(idElement, data) {
    var $hierarchy = $("#" + idElement);
    $hierarchy.tree({
      data: data,
      autoOpen: false,
      dragAndDrop: false,
      selectable: true,
      closedIcon: $('<img src=\"img/folder.png\" style=\"vertical-align: middle;\">'),
      openedIcon: $('<img src=\"img/folder_open.png\" style=\"vertical-align: middle;\">')
    });

    var existingNode = $hierarchy.tree('getNodeById', data[0].id);
    $hierarchy.tree(
        'addNodeBefore', {name: '(no value)', id: ''}, existingNode
        );
  },
  selectedNode: function(idElement, value) {
    var $hierarchy = $("#" + idElement);
    var node = $hierarchy.tree('getNodeById', value);
    $hierarchy.tree('selectNode', node);
  }
};