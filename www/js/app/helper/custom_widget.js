CustomWidget = {
  setInputNodeId: function (elementPrefixID, field) {
    var $wrapper = $("*[data-custom-widget-code='" + field.code + "']");

    if($wrapper.length > 0){
        var id = elementPrefixID + field.idfield;
        var value = field.__value || ''
        if($wrapper.attr("data-readonly") === 'readonly')
            $wrapper.text(value);
        else{
          if(field.kind == 'numeric'){
            var $node = $('<input />').attr('id', id).attr('name', id).val(value);
            $wrapper.append($node);
          }
          else if(field.kind == 'select_one') {
            var $node = $("<select></select>").attr('id', id).attr('name', id);
            $.each(field.config.options, function(index, option) {
                var $option = $("<option></option>")
                                         .attr('value', option['id'])
                                         .attr('data-field_id', elementPrefixID)
                                         .text(option['label']);
                if(option.selected == 'selected')
                   $option.attr('selected', 'selected');

                $node.append($option);
            })
            $wrapper.append($node);
          }
        }
    }
  }
}
