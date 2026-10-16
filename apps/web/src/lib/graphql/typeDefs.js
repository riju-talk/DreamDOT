// GraphQL schema (SDL). This is the contract every client AND sibling service codes against.
// Resolvers live in ./resolvers.js; business rules live in src/lib/services/*.
export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String
    displayName: String
    avatarUrl: String
  }

  type Comment {
    id: ID!
    postId: ID!
    parentId: ID
    content: String!
    createdAt: String!
    author: User
  }

  type Post {
    id: ID!
    content: String
    createdAt: String!
    likeCount: Int!
    commentCount: Int!
    author: User
    comments(limit: Int = 50): [Comment!]!
  }

  type PostPage {
    posts: [Post!]!
    total: Int!
    hasMore: Boolean!
  }

  type Balance {
    credits: Float!
    totalSpent: Float!
    totalEarned: Float!
  }

  type TopUpResult {
    newBalance: Float!
    transactionId: ID!
    reviewId: ID
  }

  input ReviewInput {
    rating: Int
    text: String
  }

  type Query {
    "Liveness probe; also handy to confirm the endpoint is mounted."
    health: String!
    "The authenticated user, or null when signed out."
    me: User
    "Newest-first feed, offset-paginated."
    feed(page: Int = 1, limit: Int = 10): PostPage!
    post(id: ID!): Post
    "Credit balance of the authenticated user."
    balance: Balance!
  }

  type Mutation {
    createPost(content: String!, visibility: Boolean = true): Post!
    addComment(postId: ID!, content: String!, parentId: ID): Comment!
    "Demo credit top-up (no payment)."
    topUp(amount: Float!, review: ReviewInput): TopUpResult!
  }
`
