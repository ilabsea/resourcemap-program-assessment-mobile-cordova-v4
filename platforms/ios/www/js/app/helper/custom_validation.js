function customValidationMessage(op, leftFieldName, rightFieldName) {
  if(op == ">")
    return "field "+leftFieldName+" must be greater than "+rightFieldName
  if(op == ">=")
    return "field "+leftFieldName+" must be greater than or equal to "+rightFieldName
  if(op == "<")
    return "field "+leftFieldName+" must be smaller than "+rightFieldName
  if(op == "<=")
    return "field "+leftFieldName+" must be smaller than or equal to "+rightFieldName
  if(op == "=")
    return "field "+leftFieldName+" must be equal to "+rightFieldName
}

function customRangeMessage(minValue, maxValue){
  if(minValue && maxValue)
    return "field must be greater than or equal "+ minValue+ " less than or equal "+maxValue;
  else if(minValue)
    return "field must be greater than or equal "+ minValue;
  else if(maxValue)
    return "field must be smaller than or equal "+ maxValue;
  else
    return "";
}
