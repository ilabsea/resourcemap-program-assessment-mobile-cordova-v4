(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['field_no_field_pop_up'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div role=\"dialog\" class=\"ui-dialog-contain ui-overlay-shadow ui-corner-all\">\n <div data-role=\"header\" role=\"banner\" class=\"ui-header ui-bar-inherit\">\n  <h1 class=\"ui-title\" role=\"heading\" aria-level=\"1\">\n   "
    + alias3((helpers.t || (depth0 && depth0.t) || alias2).call(alias1,"dialog.notification",{"name":"t","hash":{},"data":data}))
    + "\n  </h1>\n </div>\n <div data-role=\"content\" class=\"ui-content ui-body-b\" role=\"main\">\n  <span>"
    + alias3((helpers.t || (depth0 && depth0.t) || alias2).call(alias1,"fields.no_fields",{"name":"t","hash":{},"data":data}))
    + "</span>\n  <center>\n   <a onclick=\"Dialog.closeDialog('page-pop-up-no-fields');\" data-theme=\"a\" data-role=\"button\"\n      data-inline=\"true\" data-inset=\"true\" class=\"ui-link ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all\"\n      role=\"button\">\n    Ok\n   </a>\n  </center>\n </div>\n</div>\n";
},"useData":true});
})();