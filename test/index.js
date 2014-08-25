
var tape = require('tape')

var migrate = require('../')

var level = require('level')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var path = require('path')
var osenv = require('osenv')

var tmp = path.join(osenv.tmpdir(), 'test-sublevel-migrate')
var sublevel = require('level-sublevel')

rimraf.sync(tmp)
mkdirp.sync(tmp)

var db1 = level(path.join(__dirname, 'v5fixture'))

function all(db, cb) {
  var a = []
  db.createReadStream()
  .on('data', function (op) { a.push(op) })
  .on('end', function () { cb(null, a) })
}

var testMigrate = module.exports = function (migrate, sublevel, type) {

  var db2 = level(tmp)

  tape('test migrate: ' + type, function (t) {

    var expected =
      [ { key: 'bar', value: '0.5978150782175362' },
        { key: 'baz', value: '0.49487277888692915' },
        { key: 'etc', value: '0.24392788810655475' },
        { key: 'foo', value: '0.752612876240164' } ]


    migrate(db1, db2, function (err) {
      console.log('migrated')
      db2.close(function () {
        console.log('closed')
        var db3 = sublevel(level(tmp))

        all(db3, function (err, a) {
          t.deepEqual(a, expected)
          all(db3.sublevel('foo'), function (err, a) {
            t.deepEqual(a, expected)
            db1.close(function () {
              t.end()
            })
          })
        })
      })
    })

  })

}
if(!module.parent)
  testMigrate(migrate, require('level-sublevel'), 'default')

