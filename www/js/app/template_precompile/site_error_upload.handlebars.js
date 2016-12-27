(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['site_error_upload'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "Site \" "
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + " \" has errors: ";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "   <li> latitude "
    + container.escapeExpression(((helper = (helper = helpers.lat || (depth0 != null ? depth0.lat : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"lat","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "   <li> longitude "
    + container.escapeExpression(((helper = (helper = helpers.lng || (depth0 != null ? depth0.lng : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"lng","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "   <li>"
    + container.escapeExpression(((helper = (helper = helpers.msg || (depth0 != null ? depth0.msg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"msg","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div role=\"dialog\" class=\"ui-dialog-contain ui-overlay-shadow ui-corner-all\">\n <div data-role=\"header\" role=\"banner\" class=\"ui-header ui-bar-inherit\">\n  <h1 data-i18n=\"dialog.option\" class=\"ui-title\" role=\"heading\" aria-level=\"1\">\n   Error\n  </h1>\n </div>\n <div data-role=\"content\" class=\"ui-content ui-body-b\" role=\"main\">\n  "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isSubmitSites : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  <ul>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isLat : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isLng : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.errorProperties : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  <p>Please download the lastest form</p>\n  <center>\n   <a onclick=\"Dialog.closeDialog('page-error-submit-site');\" data-theme=\"a\" data-role=\"button\"\n      data-inline=\"true\" data-inset=\"true\" class=\"ui-link ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all\"\n      role=\"button\">\n    Ok\n   </a>\n  </center>\n </div>\n</div>\n";
},"useData":true});
})();