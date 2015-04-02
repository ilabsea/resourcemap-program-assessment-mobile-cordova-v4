var NumberField = {
  validateDecimal: function (element) {
    var config = JSON.parse(App.DataStore.get("configNumber_" + element.id));
    var val = $(element).val();
    if (isNaN(val))
      alert(element.name + " field has invalid number");
    else if (val % 1 !== 0 && config.allows_decimals === "false")
      alert(element.name + " field must be integer");
  }
};