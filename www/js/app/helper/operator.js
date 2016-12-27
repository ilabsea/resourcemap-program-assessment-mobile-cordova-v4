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
  },
  '==': function(arr1, arr2) {
    if(arr1.length == arr2.length){
      for(var i=0; i< arr1.length; i++){
        if(!arr2.includes(arr1[i]))
          return false;
      }
      for(var i=0; i< arr2.length; i++){
        if(!arr1.includes(arr2[i]))
          return false;
      }
      return true;
    }
    else
      return false;
  }
};
