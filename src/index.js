const { GraphQLServer } = require('graphql-yoga')
const { importSchema } = require('graphql-import')
const { Prisma, forwardTo } = require('prisma-binding')
const { formatError } = require('apollo-errors');
const { me, signup, login, AuthPayload } = require('./auth')
const weather = require('./weather');

const resolvers = {
  Query: {
    me,
    users: forwardTo('db'),
    user: forwardTo('db'),
    devices: forwardTo('db'),
    device: forwardTo('db'),
    deviceModels: forwardTo('db'),
    deviceModel: forwardTo('db'),
    groups: forwardTo('db'),
    group: forwardTo('db'),
    sensors: forwardTo('db'),
    sensor: forwardTo('db'),
    sensorTypes: forwardTo('db'),
    sensorType: forwardTo('db'),
    workers: forwardTo('db'),
    worker: forwardTo('db'),
    logs: forwardTo('db'),
    log: forwardTo('db'),
    scenes: forwardTo('db'),
    scene: forwardTo('db'),
    places: forwardTo('db'),
    place: forwardTo('db'),
    locations: forwardTo('db'),
    location: forwardTo('db'),
    weather,
  },
  Mutation: {
    signup,
    login,
    updateDevice: forwardTo('db'),
    createLog: forwardTo('db'),
    createScene: forwardTo('db'),
  },
  AuthPayload
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',             // points to Prisma database schema
      endpoint: 'https://eu1.prisma.sh/cascade/backend/dev',// Prisma service endpoint (see `~/.prisma/config.yml`)
      // endpoint: 'http://localhost:4466/backend/dev',
      secret: 'cascade-secret',                                // `secret` taken from `prisma.yml`
      debug: true                                           // log all requests to the Prisma API to console
    }),
  }),
})

server.start({ formatError }, () => console.log(`Server is running on http://localhost:4000`))
