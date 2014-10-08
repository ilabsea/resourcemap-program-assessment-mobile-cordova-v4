Calculation = {
  calculate: function() {
    var fields_cal = App.DataStore.get("fields_cal");
    fields_cal = JSON.parse(fields_cal);
    
    $.each(fields_cal, function(i, field_cal) {
      var str = field_cal.config.code_calculation;

      $.each(field_cal.config.dependent_fields, function(j, dependent_field) {
        var val = $("#" + this.id).val();
        if (isNaN(val) || !val)
          val = "'" + $("#" + this.id).val() + "'";

        str = str.replace('[' + dependent_field.name + ']', val);
      });
      $("#" + field_cal.idfield).val(eval(str));
    });
  }
};