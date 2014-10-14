Calculation = {
  calculate: function(element) {
    var idElement = element.id;
    var elementPrefixId = idElement.slice(0, idElement.lastIndexOf("_") + 1);

    var fields_cal = App.DataStore.get("fields_cal");
    fields_cal = JSON.parse(fields_cal);
    
    App.log("fields_cal : ", fields_cal);

    $.each(fields_cal, function(i, field_cal) {
      var code_cal = field_cal.config.code_calculation;

      $.each(field_cal.config.dependent_fields, function(j, dependent_field) {
        var $e = $("#" + elementPrefixId + this.id);
        var val;
        
        if (dependent_field.kind == "select_one" || dependent_field.kind == "select_many"){ 
          val = $("#" + elementPrefixId + this.id + " option:selected").text();
          App.log("val : ", val);
        }
        else
          val = $e.val();

        if ($e.attr('class') == 'tree calculation') {
          val = $e.tree('getSelectedNode');
          val = val.name;
          if (!val)
            val = '';
        }

        if (isNaN(val) || !val)
          val = "'" + val + "'";

        code_cal = code_cal.replace('$' + dependent_field.code, val);
      });
      App.log("code_cal : ", code_cal);
      var cal_ele = $("#" + elementPrefixId + field_cal.idfield);
      var res = eval(code_cal);
      cal_ele.val(res);
    });
  }
};