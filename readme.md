sublevel migrate
====

A module to migrate your databases from [sublevel](https://github.com/dominictarr/level-sublevel) version 5 to [sublevel](https://github.com/dominictarr/level-sublevel) version 6, if you only pass in a single db it changes it irrecoverably. 

```js
var migrate = require('sublevel-migrate');
var level = require('level');
migrate(level('oldDb'), level('newDb'), function (err) {
  if (err) {
    console.error('oh noes!', err);
  } else {
    console.log('done');
  }
});
// want to migrate it in place?
migrate(level('db'), function (err) {
  if (err) {
    console.error('oh noes!', err);
  } else {
    console.log('done');
  }
});
```

## migrate to bytewise keys

level-sublevel@6 now supports
[bytewise](https://github.com/deanlandolt/bytewise) encoding
on keys, this means you can use (nearly) any js value as a key,
and ordering is well defined. to migrate to bytewise keys,
use

``` js
//this is how you ask for sublevel with bytewise keys:
var sublevel = require('level-sublevel/bytewise')

migrate.bytewise(oldDb, newDb, function (err) {
  //you can not use the new databaselike this:
  var db = newDb(sublevel)
})

```
