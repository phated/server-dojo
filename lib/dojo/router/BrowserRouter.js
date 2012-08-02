define([
  "dojo/_base/declare",
  "dojo/hash",
  "dojo/topic",
  "dojo/router/RouterBase"
], function(declare, hash, topic, RouterBase){

  // Creating a basic trim to avoid needing the full dojo/string module
  // similarly to dojo/_base/lang's trim
  var trim;
  if(String.prototype.trim){
    trim = function(str){ return str.trim(); };
  }else{
    trim = function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
  }

  var BrowserRouter = declare(RouterBase, {
    go: function(path, replace){
      // summary:
      //    A simple pass-through to make changing the hash easy,
      //    without having to require dojo/hash directly. It also
      //    synchronously fires off any routes that match.
      // example:
      //  | router.go("/foo/bar");

      var applyChange;

      path = trim(path);
      applyChange = this._handlePathChange(path);

      if(applyChange){
        hash(path, replace);
      }

      return applyChange;
    },

    startup: function(){
      // summary:
      //    This method must be called to activate the router. Until
      //    startup is called, no hash changes will trigger route
      //    callbacks.

      if(this._started){ return; }

      var self = this;

      this._started = true;
      this._handlePathChange(hash());
      topic.subscribe("/dojo/hashchange", function(){
        // No need to load all of lang for just this
        self._handlePathChange.apply(self, arguments);
      });
    },

    _handlePathChange: function(newPath){
      var i, j, li, lj, routeObj, result,
        allowChange, parameterNames, params,
        routes = this._routes,
        currentPath = this._currentPath;

      if(!this._started || newPath === currentPath){ return allowChange; }

      allowChange = true;

      for(i=0, li=routes.length; i<li; ++i){
        routeObj = routes[i];
        result = routeObj.route.exec(newPath);

        if(result){
          if(routeObj.parameterNames){
            parameterNames = routeObj.parameterNames;
            params = {};

            for(j=0, lj=parameterNames.length; j<lj; ++j){
              params[parameterNames[j]] = result[j+1];
            }
          }else{
            params = result.slice(1);
          }
          allowChange = routeObj.fire(params, currentPath, newPath);
        }
      }

      if(allowChange){
        this._currentPath = newPath;
      }

      return allowChange;
    }
  });

  return BrowserRouter;

});