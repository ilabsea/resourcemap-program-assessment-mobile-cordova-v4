function validateToRemoveStyle(element) {
  if (element.required) {
    var $parent = $(element).closest(".ui-select");
    if (element.value === "")
      $parent.removeClass('valid').addClass('error');
    else
      $parent.removeClass('error').addClass('valid');
  }
}

function validateImage(idElement) {
  var $element = $("#" + idElement);
  if ($element.attr('require') === "required") {
    if ($element.attr('src') === '') {
      $("#property_" + idElement + "_container").css({"border": "1px solid red"});
    } else {
      $("#property_" + idElement + "_container").css({"border": "1px solid #f3f3f3"});
    }
  }
}

function showValidateMessage(selector, message) {
  var $element = $(selector)
  if(message != undefined)
    $element.html(message)

  $element.show().delay(3000).fadeOut();
}

function validateImages() {
  var fields = []
  var $images = $(".image")
  $.each($images, function(_, image){
    var $image = $(image)

    if ($image.attr('require') == "required") {
      if ($image.attr('src') != '') {
        $image.parent().css({"border": "1px solid #f3f3f3"});
        fields.push({id: image.id, error: false})
      }
      else {
        $image.parent().css({"border": "1px solid red"});
        showValidateMessage("#validation-save-site");
        fields.push({id: image.id, error: true})
      }
    }
  })
  return fields;
}

function validateHierarchy() {
  var fields = []
  var $trees = $(".tree");
  for(var i=0; i< $trees.length; i++){
    var tree = $trees[0];
    var $tree = $(tree);
    if ($tree.attr('require') == "required") {
      var node = $tree.tree('getSelectedNode');

      if (node && node.id) {
        $tree.css({"border": "1px solid #999999"});
        fields.push({id: tree.id, error: false})
      }
      else {
        $tree.css({"border": "1px solid red"});
        showValidateMessage("#validation-save-site");
        fields.push({id: tree.id, error: true})
      }
    }
  }
  return fields;
}
