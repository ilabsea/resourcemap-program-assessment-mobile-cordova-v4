var Spinner = {
  show: function () {
    $.mobile.activePage.addClass("ui-disabled");
    this.spinner();
  },
  hide: function () {
    $.mobile.loading('hide');
    if ($.mobile.activePage)
      $.mobile.activePage.removeClass('ui-disabled');
  },
  spinner: function () {
    $.mobile.loading('show', {
      text: i18n.t('global.ajax-loader'),
      textVisible: true,
      theme: "b",
      html: ""
    });
  }
};

function showElement(element) {
  element.show().delay(4000).fadeOut();
}

function hideElement(element) {
  element.hide();
}