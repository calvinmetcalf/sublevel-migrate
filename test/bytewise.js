var testMigrate = require('./index')
var migrate = require('../')

testMigrate(migrate.bytewise, require('level-sublevel/bytewise'), 'bytewise')

