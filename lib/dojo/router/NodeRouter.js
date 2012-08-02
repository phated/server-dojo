define([
  'dojo/_base/declare',
  'dojo/router/RouterBase'
], function(declare, RouterBase){

  // Creating a basic trim to avoid needing the full dojo/string module
  // similarly to dojo/_base/lang's trim
  var trim;
  if(String.prototype.trim){
    trim = function(str){ return str.trim(); };
  }else{
    trim = function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
  }

  var NodeRouter = declare(RouterBase, {

    _handlePathChange: function(newPath, request, response){
      var i, j, li, lj, routeObj, result,
        allowChange, parameterNames, params,
        routes = this._routes;

      if(!this._started){ return allowChange; }

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
          allowChange = routeObj.fire(params, request, response);
        }
      }

      return allowChange;
    },

    _fireRoute: function(params, request, response){
      var queue, isStopped, isPrevented, eventObj, i, l;

      queue = this.callbackQueue;
      isStopped = false;
      isPrevented = false;
      eventObj = {
        stopImmediatePropagation: function(){ isStopped = true; },
        preventDefault: function(){ isPrevented = true; },
        request: request,
        response: response,
        params: params
      };

      for(i=0, l=queue.length; i<l; ++i){
        if(!isStopped){
          queue[i](eventObj);
        }
      }

      return !isPrevented;
    }
  });

  return NodeRouter;
});