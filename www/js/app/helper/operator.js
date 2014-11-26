var Operators = {
  '=': function(input, configVal) {
    if (input == configVal)
      return true;
    else
      return false;
  },
  '<': function(input, configVal) {
    if (input < configVal)
      return true;
    else
      return false;
  },
  '>': function(input, configVal) {
    if (input > configVal)
      return true;
    else
      return false;
  },
  '<=': function(input, configVal) {
    if (input <= configVal)
      return true;
    else
      return false;
  },
  '>=': function(input, configVal) {
    if (input >= configVal)
      return true;
    else
      return false;
  }
};