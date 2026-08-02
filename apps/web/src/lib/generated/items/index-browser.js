
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.16.2
 * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
 */
Prisma.prismaVersion = {
  client: "4.16.2",
  engine: "4bc8b6e1b66cb932731fb1bdbbc550d1e010de81"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ItemsScalarFieldEnum = {
  item_id: 'item_id',
  user_id: 'user_id',
  title: 'title',
  description: 'description',
  category: 'category',
  price: 'price',
  monetization_type: 'monetization_type',
  availability: 'availability',
  created_at: 'created_at'
};

exports.Prisma.MonetizationScalarFieldEnum = {
  monetization_id: 'monetization_id',
  item_id: 'item_id',
  type: 'type',
  price: 'price',
  currency: 'currency',
  created_at: 'created_at'
};

exports.Prisma.FavoritesScalarFieldEnum = {
  favorite_id: 'favorite_id',
  user_id: 'user_id',
  item_id: 'item_id',
  created_at: 'created_at'
};

exports.Prisma.ReviewsScalarFieldEnum = {
  review_id: 'review_id',
  user_id: 'user_id',
  item_id: 'item_id',
  rating: 'rating',
  review_text: 'review_text',
  created_at: 'created_at'
};

exports.Prisma.TransactionsScalarFieldEnum = {
  transaction_id: 'transaction_id',
  buyer_id: 'buyer_id',
  item_id: 'item_id',
  amount: 'amount',
  payment_status: 'payment_status',
  transaction_date: 'transaction_date'
};

exports.Prisma.CollectionsScalarFieldEnum = {
  collection_id: 'collection_id',
  user_id: 'user_id',
  name: 'name',
  created_at: 'created_at',
  description: 'description',
  collection: 'collection'
};

exports.Prisma.Item_ownershipScalarFieldEnum = {
  ownership_id: 'ownership_id',
  item_id: 'item_id',
  creator_id: 'creator_id',
  customer_id: 'customer_id',
  created_at: 'created_at'
};

exports.Prisma.UsersScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  password_hash: 'password_hash',
  created_at: 'created_at',
  updated_at: 'updated_at',
  is_verified: 'is_verified',
  is_active: 'is_active',
  pass_salts: 'pass_salts',
  user_type: 'user_type',
  initial_balance: 'initial_balance'
};

exports.Prisma.Password_reset_tokensScalarFieldEnum = {
  token: 'token',
  user_id: 'user_id',
  expires_at: 'expires_at',
  created_at: 'created_at',
  used: 'used'
};

exports.Prisma.User_analyticsScalarFieldEnum = {
  user_id: 'user_id',
  posts_count: 'posts_count',
  likes_received: 'likes_received',
  followers_count: 'followers_count',
  following_count: 'following_count',
  last_login: 'last_login',
  activity_score: 'activity_score'
};

exports.Prisma.User_audit_logsScalarFieldEnum = {
  audit_id: 'audit_id',
  user_id: 'user_id',
  action_type: 'action_type',
  details: 'details',
  performed_by: 'performed_by',
  event_time: 'event_time'
};

exports.Prisma.User_blocklistScalarFieldEnum = {
  block_id: 'block_id',
  user_id: 'user_id',
  reason: 'reason',
  blocked_at: 'blocked_at'
};

exports.Prisma.User_certificatesScalarFieldEnum = {
  user_id: 'user_id',
  public_key: 'public_key',
  certificate: 'certificate',
  created_at: 'created_at'
};

exports.Prisma.User_profileScalarFieldEnum = {
  user_id: 'user_id',
  username: 'username',
  display_name: 'display_name',
  bio: 'bio',
  avatar_url: 'avatar_url',
  website: 'website',
  social_links: 'social_links',
  updated_at: 'updated_at',
  dob: 'dob',
  country: 'country'
};

exports.Prisma.User_securityScalarFieldEnum = {
  user_id: 'user_id',
  failed_attempts: 'failed_attempts',
  last_failed_login: 'last_failed_login',
  otp_code: 'otp_code',
  otp_expires_at: 'otp_expires_at',
  recovery_codes: 'recovery_codes',
  updated_at: 'updated_at'
};

exports.Prisma.User_sessionsScalarFieldEnum = {
  session_id: 'session_id',
  user_id: 'user_id',
  token: 'token',
  created_at: 'created_at',
  is_revoked: 'is_revoked',
  secret: 'secret'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  items: 'items',
  monetization: 'monetization',
  favorites: 'favorites',
  reviews: 'reviews',
  transactions: 'transactions',
  collections: 'collections',
  item_ownership: 'item_ownership',
  users: 'users',
  password_reset_tokens: 'password_reset_tokens',
  user_analytics: 'user_analytics',
  user_audit_logs: 'user_audit_logs',
  user_blocklist: 'user_blocklist',
  user_certificates: 'user_certificates',
  user_profile: 'user_profile',
  user_security: 'user_security',
  user_sessions: 'user_sessions'
};

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
