(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['field_update_offline'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div></div\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  <div class='empty-content'></div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div data-role=\"collapsible\"\n         data-inset=\"true\"\n         data-theme=\"a\"\n         data-collapsed=\"true\"\n         id=\"collapsable_update_"
    + alias4(((helper = (helper = helpers.id_wrapper || (depth0 != null ? depth0.id_wrapper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id_wrapper","hash":{},"data":data}) : helper)))
    + "\">\n     <h3>"
    + alias4(((helper = (helper = helpers.name_wrapper || (depth0 != null ? depth0.name_wrapper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name_wrapper","hash":{},"data":data}) : helper)))
    + "</h3>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.widgetType : depth0),"custom_widget_tokenizer",{"name":"ifCond","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    return "";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.options : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(19, data, 0),"data":data})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\">\n          <label>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</label>\n          <select id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                  data-theme=\"a\"\n                  name=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                  data-native-menu=\"false\"\n                  "
    + alias4(((helper = (helper = helpers.multiple || (depth0 != null ? depth0.multiple : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"multiple","hash":{},"data":data}) : helper)))
    + "\n                  data-role=\""
    + alias4(((helper = (helper = helpers.slider || (depth0 != null ? depth0.slider : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"slider","hash":{},"data":data}) : helper)))
    + "\"\n                  data-mini=\""
    + alias4(((helper = (helper = helpers.ctrue || (depth0 != null ? depth0.ctrue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ctrue","hash":{},"data":data}) : helper)))
    + "\"\n                  "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "\n                  data-is_enable_field_logic=\""
    + alias4(((helper = (helper = helpers.is_enable_field_logic || (depth0 != null ? depth0.is_enable_field_logic : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"is_enable_field_logic","hash":{},"data":data}) : helper)))
    + "\"\n                  class=\"validateSelectFields needsclick\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.multiple : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\n          </select>\n         </div>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "             <option>Options</option>\n"
    + ((stack1 = helpers.blockHelperMissing.call(depth0,container.lambda(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.options : stack1), depth0),{"name":"config.options","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "             <option value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + ">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.slider : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.blockHelperMissing.call(depth0,container.lambda(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.options : stack1), depth0),{"name":"config.options","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    return "             <option value=\"\">Option</option>\n             <option value=\"\" selected>(no value)</option>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "             <option value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + " data-field_id=\"update_"
    + alias4(((helper = (helper = helpers.field_id || (depth0 != null ? depth0.field_id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isCustomWidget : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.program(22, data, 0),"data":data})) != null ? stack1 : "");
},"20":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\">\n          <label>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</label>\n          <div id=\""
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" class=\"widget\" require='"
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "' tabindex=\"0\">\n            "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.widget_content : stack1), depth0)) != null ? stack1 : "")
    + "\n          </div>\n         </div>\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isHierarchy : depth0),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.program(25, data, 0),"data":data})) != null ? stack1 : "");
},"23":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\">\n          <label>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</label>\n          <div id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n               class=\"tree\"\n               require='"
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "'\n               tabindex=\"0\"></div>\n         </div>\n";
},"25":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isPhoto : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.program(28, data, 0),"data":data})) != null ? stack1 : "");
},"26":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\">\n          <span style='display:inline; margin-top:10px'>"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n          <div onclick=\"CameraModel.openCameraDialog("
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + ", 'update')\"\n               id='property_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "_container'\n               class=\"photo\" tabindex=\"0\">\n           <img class=\"image\"\n                src='"
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "'\n                id='update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "'\n                require='"
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "' />\n          </div>\n         </div>\n";
},"28":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.locations : stack1),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.program(32, data, 0),"data":data})) != null ? stack1 : "");
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\">\n          <label>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</label>\n          <select id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                  data-theme=\"a\"\n                  name=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                  data-native-menu=\"false\"\n                  "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "\n                  class=\"validateSelectFields needsclick\">\n           <option value=\"\">Option</option>\n           <option value=\"\" selected>(no value)</option>\n"
    + ((stack1 = helpers.blockHelperMissing.call(depth0,container.lambda(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.locationOptions : stack1), depth0),{"name":"config.locationOptions","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </select>\n         </div>\n";
},"30":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "           <option value=\""
    + alias4(((helper = (helper = helpers.code || (depth0 != null ? depth0.code : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + ">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"32":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.kind : depth0),"calculation",{"name":"ifCond","hash":{},"fn":container.program(33, data, 0),"inverse":container.program(35, data, 0),"data":data})) != null ? stack1 : "");
},"33":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" class=\""
    + alias4(((helper = (helper = helpers.invisible || (depth0 != null ? depth0.invisible : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"invisible","hash":{},"data":data}) : helper)))
    + "\">\n          <label for='name'>"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</label>\n          <input type=\""
    + alias4(((helper = (helper = helpers.widgetType || (depth0 != null ? depth0.widgetType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"widgetType","hash":{},"data":data}) : helper)))
    + "\"\n                 id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                 value =\""
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "\"\n                 name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n                 "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "\n                 "
    + alias4(((helper = (helper = helpers.readonly || (depth0 != null ? depth0.readonly : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"readonly","hash":{},"data":data}) : helper)))
    + "/>\n         </div>\n";
},"35":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "         <div id=\"wrapper_update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" class=\""
    + alias4(((helper = (helper = helpers.invisible || (depth0 != null ? depth0.invisible : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"invisible","hash":{},"data":data}) : helper)))
    + "\">\n          <label for='name'>"
    + ((stack1 = ((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</label>\n"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,(depth0 != null ? depth0.widgetType : depth0),"date",{"name":"ifCond","hash":{},"fn":container.program(36, data, 0),"inverse":container.program(38, data, 0),"data":data})) != null ? stack1 : "")
    + "        </div>\n";
},"36":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <input type=\""
    + alias4(((helper = (helper = helpers.widgetType || (depth0 != null ? depth0.widgetType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"widgetType","hash":{},"data":data}) : helper)))
    + "\"\n                   id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                   value =\""
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "\"\n                   name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n                   class=\"date\"\n                   "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + " >\n";
},"38":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.widgetType : depth0),"number",{"name":"ifCond","hash":{},"fn":container.program(39, data, 0),"inverse":container.program(41, data, 0),"data":data})) != null ? stack1 : "");
},"39":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "            <input type=\"tel\"\n                   id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                   value =\""
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "\"\n                   name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n                   min=\""
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.range : stack1)) != null ? stack1.minimum : stack1), depth0))
    + "\"\n                   max=\""
    + alias4(alias5(((stack1 = ((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.range : stack1)) != null ? stack1.maximum : stack1), depth0))
    + "\"\n                   data-is_enable_field_logic=\""
    + alias4(((helper = (helper = helpers.is_enable_field_logic || (depth0 != null ? depth0.is_enable_field_logic : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"is_enable_field_logic","hash":{},"data":data}) : helper)))
    + "\"\n                   data-allows_decimals= "
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.allows_decimals : stack1), depth0))
    + "\n                   data-digits_precision=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.config : depth0)) != null ? stack1.digits_precision : stack1), depth0))
    + "\"\n                   data-previous-value =\""
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "\"\n                   class=\"skipLogicNumber\"\n                   "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "\n                   "
    + alias4(((helper = (helper = helpers.readonly || (depth0 != null ? depth0.readonly : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"readonly","hash":{},"data":data}) : helper)))
    + "/>\n";
},"41":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <input type=\""
    + alias4(((helper = (helper = helpers.widgetType || (depth0 != null ? depth0.widgetType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"widgetType","hash":{},"data":data}) : helper)))
    + "\"\n                   id=\"update_"
    + alias4(((helper = (helper = helpers.idfield || (depth0 != null ? depth0.idfield : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"idfield","hash":{},"data":data}) : helper)))
    + "\"\n                   value =\""
    + alias4(((helper = (helper = helpers.__value || (depth0 != null ? depth0.__value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"__value","hash":{},"data":data}) : helper)))
    + "\"\n                   name=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"\n                   "
    + alias4(((helper = (helper = helpers.required || (depth0 != null ? depth0.required : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"required","hash":{},"data":data}) : helper)))
    + "\n                   "
    + alias4(((helper = (helper = helpers.readonly || (depth0 != null ? depth0.readonly : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"readonly","hash":{},"data":data}) : helper)))
    + "/>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.field_collections : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n<div data-role=\"collapsible-set\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.field_collections : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
})();