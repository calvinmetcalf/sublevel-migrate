var through = require('through2').obj;
var bytewise = require('bytewise');

function identity (item){
  return item;
}

module.exports = function (db, callback) {
  db.createReadStream()
    .on('error', callback)
    .pipe(through(function (item, _, next) {
      this.push({
        type:'del',
        key:item.key
      });
      var split = item.key.split('\xff').filter(identity);
      var key = split.pop();
      this.push({
        key: bytewise.encode([split, key]),
        value. item.value
      });
      next();
    }))
    .on('error', callback)
    .pipe(db.createWriteStream())
    .on('error', callback)
    .on('finish', function () {
      callback();
    });
};