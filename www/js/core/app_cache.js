App.Cache = {
  get: function(key, callback) {
    CacheData.all().filter('key', '=', key).one(null, function(cache){
      callback(cache.value)
      return cache;
    })
  },
  set: function(key, value) {
    CacheData.all().filter('key', '=', key).one(null, function(cache){
      if(cache)
        cache.value = value
      else{
        cache = new CacheData({key: key, value: value})
        persistence.add(cache);
      }
      persistence.flush()
      return cache;
    });

  },

  clearAll: function() {
    CacheData.all().destroyAll(null, null);
  },

  remove: function(key) {
    CacheData.all().filter('key', '=', key).one(null, function(cache){
      var value = cache.value;
      persistence.remove(cache)
      persistence.flush()
      return value;
    })
  }
};
