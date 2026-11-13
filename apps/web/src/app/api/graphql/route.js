import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from '@/lib/graphql/typeDefs'
import { resolvers } from '@/lib/graphql/resolvers'
import { buildContext } from '@/lib/graphql/context'

// Single GraphQL endpoint: POST /api/graphql  (GET serves GraphiQL outside production).
// Next.js route handlers are plain Fetch-API functions, which is exactly what Yoga speaks.
const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/api/graphql',
  context: buildContext,
  fetchAPI: { Response },
  graphiql: process.env.NODE_ENV !== 'production',
  maskedErrors: process.env.NODE_ENV === 'production', // never leak stack traces / DB errors to clients
})

// Wrap instead of exporting `yoga` directly: Yoga's handler takes (request, serverContext),
// but Next passes its own route context as the 2nd argument.
const handler = (request) => yoga.fetch(request)
export { handler as GET, handler as POST, handler as OPTIONS }
