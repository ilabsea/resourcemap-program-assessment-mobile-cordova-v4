Hierarchy = {
  _data: [],
  _value: "",
  _selected: "",
  setData: function(config) {
    this._data = config["hierarchy"];
  },
  create: function(config, value, id) {
    this._value = value;
    this.setData(config);
    this.processHierarchy(this._data, id);
    var data = this._data.slice(0);
    this.renderDisplay(data, id)
    this.selectedNode(value, id)
  },
  processHierarchy: function(data, id) {
    for (var i = 0; i < data.length; i++) {
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

  renderDisplay: function(data, id) {
    var $tree = $("#" + id);
    $tree.tree({
      data: data,
      autoOpen: false,
      dragAndDrop: false,
      selectable: true,
      closedIcon: $('<img src="img/folder.png" style="vertical-align: middle;">'),
      openedIcon: $('<img src="img/folder_open.png" style="vertical-align: middle;">>')
    });

    var existingNode = $tree.tree('getNodeById', data[0].id);
    $tree.tree( 'addNodeBefore', {name: '(no value)', id: ''}, existingNode);
  },
  selectedNode: function(value, id) {
    var $tree = $("#" + id);
    var node = $tree.tree('getNodeById', value);
    $tree.tree('selectNode', node);
  }
};
