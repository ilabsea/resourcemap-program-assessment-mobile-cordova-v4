function showSpinner() {
    $.mobile.activePage.addClass("ui-disabled");
    $.mobile.loading('show', {
        text: i18n.t('global.ajax-loader'),
        textVisible: true,
        theme: "b",
        html: ""
    });
}

function hideSpinner() {
    $.mobile.loading('hide');
    if ($.mobile.activePage)
        $.mobile.activePage.removeClass('ui-disabled');
}

function showElement(element){
  element.show().delay(4000).fadeOut();
}

function hideElement(element){
  element.hide();
}