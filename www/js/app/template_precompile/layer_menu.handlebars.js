(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['layer_menu'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing, alias4="function";

  return "      <option value=\""
    + alias1(container.lambda(((stack1 = (depths[1] != null ? depths[1].field_collections : depths[1])) != null ? stack1.current_page : stack1), depth0))
    + alias1(((helper = (helper = helpers.id_wrapper || (depth0 != null ? depth0.id_wrapper : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"id_wrapper","hash":{},"data":data}) : helper)))
    + "\">"
    + alias1(((helper = (helper = helpers.name_wrapper || (depth0 != null ? depth0.name_wrapper : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"name_wrapper","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {}, alias3=helpers.helperMissing;

  return "<select data-theme=\"a\"\n        data-native-menu=\"false\"\n        data-iconpos=\"notext\"\n        data-icon=\"bullets\"\n        name=\"layer-list-menu\"\n        id=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.field_collections : depth0)) != null ? stack1.current_page : stack1), depth0))
    + "layer-list-menu\"\n        onchange=\"scrollToLayer($(this).val())\">\n  <option value=\"\" selected>"
    + alias1((helpers.t || (depth0 && depth0.t) || alias3).call(alias2,"global.menu",{"name":"t","hash":{},"data":data}))
    + "</option>\n"
    + ((stack1 = helpers.each.call(alias2,(depth0 != null ? depth0.field_collections : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <option value=\"logout\">"
    + alias1((helpers.t || (depth0 && depth0.t) || alias3).call(alias2,"global.logout",{"name":"t","hash":{},"data":data}))
    + "</option>\n</select>\n";
},"useData":true,"useDepths":true});
})();