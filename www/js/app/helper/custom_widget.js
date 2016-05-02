CustomWidget = {
  setInputNodeId: function (elementPrefixID, field) {
    var $node = $("*[data-custom-widget-code='" + field.code + "']");
    
    if($node.length > 0){
        $node[0].id = elementPrefixID + field.idfield;
        if(field.__value){
            if($node.attr("data-readonly") === 'readonly')
                $node.text(field.__value);  
            else
                $node.val(field.__value);    

        }
        
        
    }
  }
}

