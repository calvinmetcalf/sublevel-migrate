var through = require('through2').obj;
var legacy = require('level-sublevel/codec/legacy');
var LevelWriteStream = require('level-write-stream');

function identity (item){
  return item;
}

module.exports = create(require('level-sublevel/codec/index'))
module.exports.bytewise = create(require('level-sublevel/codec/bytewise'))

function create (codec) {
  return function (db, outDB, callback) {
    if (typeof callback === 'undefined') {
      callback = opts;
      opts = null;
    }
    if (typeof callback === 'undefined') {
      callback = outDB;
      outDB = db;
    }
    db.createReadStream()
      .on('error', callback)
      .pipe(through(function (item, _, next) {
        if(db === outDB)
          this.push({
            type:'del',
            key:item.key
          });
        var key = legacy.decode(item.key)

        this.push({
          key: codec.encode(key),
          value: item.value
        });
        next();
      }))
      .on('error', callback)
      .pipe(LevelWriteStream(outDB)())
      .on('error', callback)
      .on('finish', function () {
        callback();
      });
  };
};
