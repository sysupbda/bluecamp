
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

import * as fastify from 'fastify'
//import * as cors from 'cors'
import { createReadStream } from 'fs'
import * as http from 'http'
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlFastify } from './lib/apollo-server-fastify';


const app = fastify()

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
}

const typeDefs = `
type Query {
  testString: String
}
`;
const schema = makeExecutableSchema({ typeDefs });

app.register(graphqlFastify, { graphqlOptions: { schema } });

function getHelloHandler (req: fastify.FastifyRequest<http.IncomingMessage>,
    reply: fastify.FastifyReply<http.ServerResponse>) {
  reply.header('Content-Type', 'application/json').code(200)
  reply.send({ hello: 'world' })
}

//server.use(cors())
app.get('/', opts, getHelloHandler)

const server = app.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${app.server.address().port}`)
})

function shutdownHandler(server) {
    return () => server.close()
}

process.once('SIGTERM', shutdownHandler(app));
process.once('SIGINT', shutdownHandler(app));
