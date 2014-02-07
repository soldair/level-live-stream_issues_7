
var test = require('tape');
var sublevel = require('level-sublevel');
var level = require('level');
var livestream = require('level-live-stream');
var multilevel = require('multilevel');

test('multilevel should not blow up when using live stream overlapping a sublevel',function(t){

  var db = sublevel(level('./_testdb'));
  var subdb = db.sublevel('s');

  livestream.install(db);

  db.pre(function(ch,add){
    if(ch.type == "put") add({type:"put",key:ch.key,value:ch.value,prefix:subdb});
  });

  multilevel.writeManifest(db, __dirname + '/manifest.json');

  var manifest = require('./manifest.json');
  var client = multilevel.client(manifest);
  var server = multilevel.server(db);

  server.pipe(client.createRpcStream()).pipe(server);

  client.liveStream().on('data',function(change){

    t.ok(change,'should not have crashed');

    t.end();
    
  });

  db.put('z',1);

});
