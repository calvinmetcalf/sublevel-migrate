
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
var db2 = level(tmp)

function all(db, cb) {
  var a = []
  db.createReadStream()
  .on('data', function (op) { a.push(op) })
  .on('end', function () { cb(null, a) })
}

function testMigrate(migrate, sublevel, type) {

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
            t.end()
          })
        })
      })
    })

  })

}

testMigrate(migrate, require('level-sublevel'), 'default')
//-testMigrate(migrate, require('level-sublevel/bytewise'), 'bytewise')

