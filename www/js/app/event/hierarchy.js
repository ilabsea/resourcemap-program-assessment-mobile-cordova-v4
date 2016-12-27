$(function() {
  $(document).delegate('.tree', 'click', function() {
    var $tree = $(this);
    var node = $tree.tree('getSelectedNode');
    var fieldId = this.id;
    var field =  FieldController.findFieldById(fieldId)
    field.__value = node.id

    if ($tree.attr('require') === "required") {
      if (!node.id){
        $tree.css({"border": "1px solid red"});
      }
      else{
        $tree.css({"border": "1px solid #999999"});
      }
    }
  });
});
