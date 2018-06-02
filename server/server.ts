/**
 * Most type annotations in this file are not strictly necessary but are
 * included for this example.
 *
 * To run this example exectute the following commands to install typescript,
 * transpile the code, and start the server:
 *
 * npm i -g typescript
 * tsc examples/typescript-server.ts --target es6 --module commonjs
 * node examples/typescript-server.js
 */

require('dotenv/config');

import * as fastify from 'fastify';
//import * as cors from 'cors'
import * as http from 'http';
import { createReadStream } from 'fs';

import * as pino from 'pino';
import postgraphile from 'postgraphile';

import { config } from './config';

const logger = pino({
  name: 'bluecamp',
  prettyPrint: true,
  level: config.logLevel
});

const app = fastify({
  logger
});

const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string'
          }
        }
      }
    }
  }
};

//server.use(cors())
//app.use(postgraphile(process.env.DATABASE_URL));
app.use(postgraphile(process.env.DATABASE_URL, { graphiql: true }));

const server = app.listen(3000, err => {
  if (err) throw err;
  console.log(`server listening on ${app.server.address().port}`);
});

function shutdownHandler(server) {
  return () => server.close();
}

process.once('SIGTERM', shutdownHandler(app));
process.once('SIGINT', shutdownHandler(app));
