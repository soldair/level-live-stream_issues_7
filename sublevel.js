// not broken

var sublevel = require('level-sublevel');
var db = sublevel(require('level')('./test/_testdb'));
var livestream = require('level-live-stream');
var subdb = db.sublevel('s');

livestream.install(db);
livestream.install(subdb);

db.pre(function(ch,add){
  if(ch.type == "put") add({type:"put",key:ch.key,value:ch.value,prefix:subdb});
})


subdb.liveStream().on('data',function(change){
  if(change.prefix) {
    // never gets called
    console.log('this will break multilevel?');
  } else {
    // always works
    console.log('sub db is ll good!');
  }
}) 

setInterval(function(){
  db.put('z',1);
},1000);
