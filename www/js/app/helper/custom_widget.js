CustomWidget = {
  setInputNodeId: function (field) {
     node = $("*[data-custom-widget-code='" + field.code + "']")[0];
     node.id = field.idfield;
  }
}

