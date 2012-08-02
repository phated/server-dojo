define([
  'dojo/node!http',
  'dojo/router',
  './static',
  'dojo/store/Memory'
], function(http, router, static, MemoryStore){
  var initData = [
    {
      id: 1,
      test: "This is just a test, don't be alarmed, I am awesome"
    },
    {
      id: 2,
      message: 'This is a really awesome test message that was retrieved from a Dojo Memory Store'
    }
  ];
  var store = new MemoryStore({
    data: initData
  });

  router.register('/', function(evt){
    evt.preventDefault();
    var req = evt.request;
    var res = evt.response;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Routed!');
  });

  router.register('/user/:id', function(evt){
    evt.preventDefault();
    var req = evt.request;
    var res = evt.response;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var retrievedData = store.get(evt.params.id);
    res.end(JSON.stringify(retrievedData));
  });

  router.register('/*static', function(evt){
    console.log(evt.params);
    var req = evt.request;
    var res = evt.response;
    res.end();
  });

  router.startup();

  http.createServer(function (req, res) {
    router.go(req.url, req, res);
  }).listen(1337, '127.0.0.1');
  console.log('Server running at http://127.0.0.1:1337/');
});