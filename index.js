var through = require('through');

module.exports =  function fix(db) {

  var oldLiveStream = db.liveStream;
  if(!oldLiveStream) return;

  db.liveStream = function(){
    return oldLiveStream.apply(this,arguments).pipe(through(function(data){
      delete data.prefix;
      this.queue(data);
    }))
  };

  Object.keys(db.sublevels).forEach(function(k){
    fix(db.sublevels[k]);
  });
}
