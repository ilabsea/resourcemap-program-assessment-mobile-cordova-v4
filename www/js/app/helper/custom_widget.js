CustomWidget = {
  setInputNodeId: function (elementPrefixID, field) {
    node = $("*[data-custom-widget-code='" + field.code + "']");
    if(node.length > 0){
        node[0].id = elementPrefixID + field.idfield;
        if(field.__value)
            node[0].value = field.__value;
    }
  }
}

