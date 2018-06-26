'use strict'

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://krloslao:jlao*007@ds257579.mlab.com:57579/listio-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://krloslao:jlao*007@ds135760.mlab.com:35760/listio-db-testing';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYWRhIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImVtYWlsIjoiYWRhQGV4YW1wbGUuY29tIn0sImlhdCI6MTQ5NzUzOTcwMCwiZXhwIjoxNDk4MTQ0NTAwLCJzdWIiOiJhZGEifQ.Hvs0vjtkCMJRKqKcjglBFTOVY-bmNUoQkbkPHVUJwe4';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';