$(function() {
  $(document).delegate('.tree', 'click', function() {
    var $tree = $("#" + this.id);
    if ($tree.attr('require') === "required") {
      var node = $tree.tree('getSelectedNode');
      if (!node.id)
        $tree.css({"border": "1px solid red"});
      else
        $tree.css({"border": "1px solid #999999"});
    }
  });
});