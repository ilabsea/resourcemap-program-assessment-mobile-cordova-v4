(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['site_form'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<label for=\"site_name\"> "
    + alias3((helpers.t || (depth0 && depth0.t) || alias2).call(alias1,"global.name",{"name":"t","hash":{},"data":data}))
    + "</label>\n<input type=\"text\"\n       name=\"site_name\"\n       id=\"site_name\"\n       class=\"required\"\n       value='"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "'\n       "
    + alias3(((helper = (helper = helpers.editable || (depth0 != null ? depth0.editable : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"editable","hash":{},"data":data}) : helper)))
    + "\n       /><br>\n<div>\n <a href=\"#page-map\">\n  <img src=\"img/map.png\"\n       alt=\"map icon\"\n       width=\"50\"\n       height=\"50\"\n       id=\"update_icon_map\"/></a></div>\n<label for=\"site_lat\"> "
    + alias3((helpers.t || (depth0 && depth0.t) || alias2).call(alias1,"global.lat",{"name":"t","hash":{},"data":data}))
    + " </label>\n<input type=\"number\"\n       name=\"site_lat\"\n       id=\"site_lat\"\n       class=\"required\"\n       value='"
    + alias3(((helper = (helper = helpers.lat || (depth0 != null ? depth0.lat : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lat","hash":{},"data":data}) : helper)))
    + "'\n       readonly\n       "
    + alias3(((helper = (helper = helpers.editable || (depth0 != null ? depth0.editable : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"editable","hash":{},"data":data}) : helper)))
    + "/>\n<label for=\"site_lng\"> "
    + alias3((helpers.t || (depth0 && depth0.t) || alias2).call(alias1,"global.lng",{"name":"t","hash":{},"data":data}))
    + " </label>\n<input type=\"number\"\n       name=\"site_lng\"\n       id=\"site_lng\"\n       class=\"required\"\n       value='"
    + alias3(((helper = (helper = helpers.lng || (depth0 != null ? depth0.lng : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"lng","hash":{},"data":data}) : helper)))
    + "'\n       readonly\n       "
    + alias3(((helper = (helper = helpers.editable || (depth0 != null ? depth0.editable : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"editable","hash":{},"data":data}) : helper)))
    + "/>\n";
},"useData":true});
})();