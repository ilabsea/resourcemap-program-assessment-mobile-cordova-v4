(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['field_add'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div></div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  <div class='empty-content'></div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div data-role=\"collapsible\"\n         data-inset=\"true\"\n         data-theme=\"a\"\n         data-id=\""
    + alias4(((helper = (helper = helpers.id_wrapper || (depth0 != null ? depth0.id_wrapper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id_wrapper","hash":{},"data":data}) : helper)))
    + "\"\n         data-collapsed=\"true\"\n         id=\"collapsable_"
    + alias4(((helper = (helper = helpers.id_wrapper || (depth0 != null ? depth0.id_wrapper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id_wrapper","hash":{},"data":data}) : helper)))
    + "\">\n     <h3>"
    + alias4(((helper = (helper = helpers.name_wrapper || (depth0 != null ? depth0.name_wrapper : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name_wrapper","hash":{},"data":data}) : helper)))
    + "</h3>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.field_collections : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n<div data-role=\"collapsible-set\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.field_collections : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
})();