// simple reduced test case.

var sublevel = require('level-sublevel');
var db = sublevel(require('level')('./test/_testdb'));
var livestream = require('level-live-stream');
var subdb = db.sublevel('s');

livestream.install(db);

db.pre(function(ch,add){
  if(ch.type == "put") add({type:"put",key:ch.key,value:ch.value,prefix:subdb});
})


db.liveStream().on('data',function(change){
  if(change.prefix) {
    // always happens.
    console.log('this will break multilevel.rpcStream > rpc-stream > muxdemux > stream serilizer <<ALL THE WAY DOWN HERE!');
  } else {
    // never happens.
    console.log('no prefix sublevel we are all good!');
  }
}) 

setInterval(function(){
  db.put('z',1);
},1000);
