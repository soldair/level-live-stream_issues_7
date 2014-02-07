


this is a test case for

##https://github.com/dominictarr/level-live-stream/issues/7

```sh

git clone git@github.com:soldair/level-live-stream_issues_7.git && npm install && npm test

```

## cause

when you bind level-hooks and specify a sublevel as prefix.
```js
var subdb = db.sublevel('s');
db.pre(function(ch,add){
  if(ch.type == "put") add({type:"put",key:ch.key,value:ch.value,prefix:subdb});
})
```

if you use level-live-stream on a section of the database that overlaps that sublevel's range.
 
```js
var livestream = require('level-live-stream');
var ls = livestream.install(db);

db.livestream().on('data',function(change){
  if(change.prefix) console.log(change.prefix === subdb, ' im broken');
})

```

using multilevel.  when trying to serialize the sublevel object to send to a client we blow the stack.

it may not be the expected behavior for the prefix key to bubble out of level-hooks
its certainly not the expected behavior for it to be sent from pull-level
its never the expected behavior for this to be emitted as data from level-live-stream




