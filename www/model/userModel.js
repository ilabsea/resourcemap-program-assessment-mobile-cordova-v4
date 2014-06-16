UserModel = {
    create: function(url, attr, successCallback, errorCallback){
       $.ajax({
            url: url,
            type: "POST",
            crossDomain: true,
            data: attr,
            success: successCallback,
            error: errorCallback,
            complete: function(){
                ViewBinding.setBusy(false);
            }
        }); 
    }
};