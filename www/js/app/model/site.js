var SiteList = {
  sites: [],
  add: function (site) {
    SiteList.remove(site.id);
    App.log("site : ", site);
    SiteList.sites.push(site);
  },
  remove: function (id) {
    for (var i = 0; i < SiteList.count(); i++) {
      var site = SiteList.get()[i];
      if (site.id === id) {
        return SiteList.sites.splice(i, 1);
      }
    }
  },
  getSite: function (id) {
    for (var i = 0; i < SiteList.count(); i++) {
      var site = SiteList.get()[i];
      App.log('site : ', site);
      if (site.id == id) {
        return site;
      }
    }
  },
  get: function () {
    return SiteList.sites;
  },
  clear: function () {
    SiteList.sites = [];
  },
  count: function () {
    return SiteList.sites.length;
  }
};

function SiteObj(id, name) {
  this.id = id;
  this.name = name;
}

