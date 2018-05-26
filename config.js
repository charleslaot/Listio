'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://krloslao:jlao*007@ds257579.mlab.com:57579/listio-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://krloslao:jlao*007@ds257579.mlab.com:57579/listio-db';
exports.PORT = process.env.PORT || 8080;