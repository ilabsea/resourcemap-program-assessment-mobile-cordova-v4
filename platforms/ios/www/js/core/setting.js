RmSetting = {
  BASE_URL: "http://192.168.1.112:3000",
  DEBUG: true,
  url: function(){
    endpoint = localStorage.getItem("endPoint");
    return endpoint || this.BASE_URL;
  },
  endPoint: function(){
    return this.url()+"/api";
  }

}
