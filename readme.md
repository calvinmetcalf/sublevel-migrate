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