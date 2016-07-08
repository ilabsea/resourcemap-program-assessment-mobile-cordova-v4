$(document).on("mobileinit", function() {
  $(document).delegate('#page-site-list', 'pageshow', function () {
    resetRightMenuItem();
    App.emptyHTML();
    App.validateDbConnection(function() {
      SiteModel.sitePage = 0;
      SiteOffline.sitePage = 0;
      SiteController.getAllByCollectionId();
    });
  });

  $(document).delegate('#btn_create_site', 'click', function () {
    MyMembershipObj.setSite("");
    SiteController.renderNewSiteForm();
    $('#form-site')[0].reset();
    $('#form-site-fields')[0].reset();
  });


  $(document).delegate('#page-site-list #site-list-online', 'click', function (event) {
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-online") {
        li.remove()
        SiteModel.sitePage++;
        SiteController.getByCollectionIdOnline();
      }
      else {
        App.DataStore.set("sId", sId);
        requireReload(SiteController.renderUpdateSiteFormOnline);
      }
    })
  });

  $(document).delegate('#page-save-site', 'pageshow', function () {
    App.validateDbConnection(function() {
      SiteController.setEntryDate();
    });
  });

  $(document).delegate('#page-site-list #site-list', 'click', function (event) {
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-offline") {
        li.remove()
        SiteOffline.sitePage++;
        SiteController.getByCollectionIdOffline();
      }
      else {
        App.DataStore.set("sId", sId);
        $("#btn_back_site_list_all").hide();
        $("#btn_back_site_list").show();
        requireReload(SiteController.renderUpdateSiteFormOffline);
      }
    })
  });

  $(document).delegate('#btn_delete-site', 'click', function () {
    if(confirm("Are you sure you want to delete the site?")) {
      var sId = App.DataStore.get("sId");
      SiteController.deleteBySiteId(sId);
    }
  });

  $(document).delegate('#page-site-list-all', 'click', function (event) {
    App.checkNodeTargetSuccess(event.target, function(a) {
      var li = a.parentNode;
      var sId = li.getAttribute('data-id');
      if (sId == "load-more-site-all") {
        li.remove()
        SiteOffline.sitePage++;
        SiteController.getByUser();
      }
      else {
        App.DataStore.set("sId", sId);
        $("#btn_back_site_list_all").show();
        $("#btn_back_site_list").hide();
        requireReload(SiteController.renderUpdateSiteFormOffline);
      }
    })
  });



  $(document).delegate('#page-site-list-all', 'pagebeforeshow', function () {
    App.emptyHTML();
    SiteOffline.sitePage = 0;
    App.validateDbConnection(function() {
      SiteController.getByUser();
    });
  });

  var selector = '#page-site-list , #page-collection-list , #page-site-list-all';
  $(document).delegate(selector, 'pageshow', function () {
    App.DataStore.clearConfig("configNumberSkipLogic");
    App.DataStore.clearConfig("configNumber");
    App.DataStore.clearConfig("configSelectManyForSkipLogic");
    App.DataStore.clearConfig("configLocations");
  });

  // $(document).delegate('#updatelolat, #updatelolng', 'change', function () {
  //   FieldController.renderLocationField("#updatelolat", "#updatelolng", "update_");
  // });
  //
  $(document).delegate('#site_name', 'change', function () {
    $('#form-site').valid()
  });

  $(document).delegate('#site_lat, #site_lng', 'change', function () {
    FieldController.renderLocationField("#site_lat", "#site_lng", "");
  });
})

function validationOptions() {
  return{
    ignore: '',
    focusInvalid: false,
    onkeyup: false,
    onfocusin: false,
    errorPlacement: function (error, element) {
      //all element to be validated list here

      // if (element.attr("type") === "tel" && (element.attr("min") || element.attr("max")))
      //   error.insertAfter($(element).parent());
      // addClassError(element);

      // var classElement = document.getElementsByClassName("image");
      // var classHierarchyElement = document.getElementsByClassName("tree");
      // if (classHierarchyElement.length != 0)
      //   h = validateHierarchySubmitHandler(classHierarchyElement, '#validation-save-site');
      // if (classElement.length != 0)
      //   bImage = validateImageSubmitHandler(classElement, '#validation-save-site');

      if(element.hasClass('error')){
        var id = element.attr('id');
        var field = FieldController.findFieldById(id);
        console.log("element: ", element);
        console.log("field--: ", field);

        if(field){
          field.invalid = 'error'
        }
      }
      return false
    },
    invalidHandler: function () {
      ViewBinding.setBusy(false);
      showValidateMessage('#validation-save-site');
      return false;
    },
    submitHandler: function () {
      // console.log('submit site online');
      // var classElement = document.getElementsByClassName("image");
      // var classHierarchyElement = document.getElementsByClassName("tree");
      // var h = true;
      // var bImage = true;
      //
      // if (classHierarchyElement.length != 0)
      //   h = validateHierarchy(classHierarchyElement, '#validation-save-site');
      // if (classElement.length != 0)
      //   bImage = validateImages(classElement, '#validation-save-site');
      //
      // if (h && bImage) {
      //   SiteController.add();
      //   App.DataStore.clearPartlyAfterCreateSite();
      // }
    }
  }
}

function submitAndValidateSaveSite() {
  $('#form-site').validate(validationOptions());
  $('#form-site-fields').validate(validationOptions());
  // $('#form-site-offline').validate(validationOptions());
  // $('#form-site-online').validate(validationOptions());
  // $('#site-fields').validate(validationOptions());
}

function submitSiteForm() {
  $('#btn_save_site').on('click', function() {
    ViewBinding.setBusy(true);
    $(this.form).submit();
  })
}

//reset the right menu bar
function resetRightMenuItem(){
  $("#site-list-menu").get(0).selectedIndex = 0;
  SiteList.menu();
}

$(function(){
  submitSiteForm();
  submitAndValidateSaveSite();

});
