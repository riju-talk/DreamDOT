
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type usersPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "users"
  objects: {
    user_about: user_aboutPayload<ExtArgs> | null
    user_analytics: user_analyticsPayload<ExtArgs> | null
    user_audit_logs: user_audit_logsPayload<ExtArgs>[]
    user_blocklist: user_blocklistPayload<ExtArgs> | null
    user_certificates: user_certificatesPayload<ExtArgs> | null
    user_profile: user_profilePayload<ExtArgs> | null
    user_security: user_securityPayload<ExtArgs> | null
    user_sessions: user_sessionsPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    email: string
    phone: string | null
    password_hash: string
    created_at: Date
    updated_at: Date
    is_verified: boolean | null
    is_active: boolean | null
    pass_salts: string | null
    user_type: string | null
    initial_balance: number
  }, ExtArgs["result"]["users"]>
  composites: {}
}

/**
 * Model users
 * 
 */
export type users = runtime.Types.DefaultSelection<usersPayload>
export type user_aboutPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_about"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    about_id: string
    user_id: string
    about: string | null
    goals: string | null
    skills: string[]
  }, ExtArgs["result"]["user_about"]>
  composites: {}
}

/**
 * Model user_about
 * 
 */
export type user_about = runtime.Types.DefaultSelection<user_aboutPayload>
export type user_analyticsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_analytics"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    user_id: string
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    last_login: Date | null
    activity_score: Prisma.Decimal | null
  }, ExtArgs["result"]["user_analytics"]>
  composites: {}
}

/**
 * Model user_analytics
 * 
 */
export type user_analytics = runtime.Types.DefaultSelection<user_analyticsPayload>
export type user_audit_logsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_audit_logs"
  objects: {
    users: usersPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    audit_id: string
    user_id: string | null
    action_type: string
    details: Prisma.JsonValue | null
    performed_by: string | null
    event_time: Date
  }, ExtArgs["result"]["user_audit_logs"]>
  composites: {}
}

/**
 * Model user_audit_logs
 * 
 */
export type user_audit_logs = runtime.Types.DefaultSelection<user_audit_logsPayload>
export type user_blocklistPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_blocklist"
  objects: {
    users: usersPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    block_id: string
    user_id: string | null
    reason: string
    blocked_at: Date
  }, ExtArgs["result"]["user_blocklist"]>
  composites: {}
}

/**
 * Model user_blocklist
 * 
 */
export type user_blocklist = runtime.Types.DefaultSelection<user_blocklistPayload>
export type user_certificatesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_certificates"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    user_id: string
    public_key: string
    certificate: string | null
    created_at: Date
  }, ExtArgs["result"]["user_certificates"]>
  composites: {}
}

/**
 * Model user_certificates
 * 
 */
export type user_certificates = runtime.Types.DefaultSelection<user_certificatesPayload>
export type user_profilePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_profile"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    user_id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    website: string | null
    social_links: Prisma.JsonValue | null
    updated_at: Date
    dob: Date | null
    country: string | null
    banner_url: string | null
  }, ExtArgs["result"]["user_profile"]>
  composites: {}
}

/**
 * Model user_profile
 * 
 */
export type user_profile = runtime.Types.DefaultSelection<user_profilePayload>
export type user_securityPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_security"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    user_id: string
    failed_attempts: number | null
    last_failed_login: Date | null
    otp_code: string | null
    otp_expires_at: Date | null
    recovery_codes: string[]
    updated_at: Date
  }, ExtArgs["result"]["user_security"]>
  composites: {}
}

/**
 * Model user_security
 * 
 */
export type user_security = runtime.Types.DefaultSelection<user_securityPayload>
export type user_sessionsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "user_sessions"
  objects: {
    users: usersPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    session_id: string
    user_id: string
    token: string
    created_at: Date
    is_revoked: boolean | null
    secret: string | null
  }, ExtArgs["result"]["user_sessions"]>
  composites: {}
}

/**
 * Model user_sessions
 * 
 */
export type user_sessions = runtime.Types.DefaultSelection<user_sessionsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.users.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_about`: Exposes CRUD operations for the **user_about** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_abouts
    * const user_abouts = await prisma.user_about.findMany()
    * ```
    */
  get user_about(): Prisma.user_aboutDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_analytics`: Exposes CRUD operations for the **user_analytics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_analytics
    * const user_analytics = await prisma.user_analytics.findMany()
    * ```
    */
  get user_analytics(): Prisma.user_analyticsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_audit_logs`: Exposes CRUD operations for the **user_audit_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_audit_logs
    * const user_audit_logs = await prisma.user_audit_logs.findMany()
    * ```
    */
  get user_audit_logs(): Prisma.user_audit_logsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_blocklist`: Exposes CRUD operations for the **user_blocklist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_blocklists
    * const user_blocklists = await prisma.user_blocklist.findMany()
    * ```
    */
  get user_blocklist(): Prisma.user_blocklistDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_certificates`: Exposes CRUD operations for the **user_certificates** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_certificates
    * const user_certificates = await prisma.user_certificates.findMany()
    * ```
    */
  get user_certificates(): Prisma.user_certificatesDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_profile`: Exposes CRUD operations for the **user_profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_profiles
    * const user_profiles = await prisma.user_profile.findMany()
    * ```
    */
  get user_profile(): Prisma.user_profileDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_security`: Exposes CRUD operations for the **user_security** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_securities
    * const user_securities = await prisma.user_security.findMany()
    * ```
    */
  get user_security(): Prisma.user_securityDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.user_sessions`: Exposes CRUD operations for the **user_sessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_sessions
    * const user_sessions = await prisma.user_sessions.findMany()
    * ```
    */
  get user_sessions(): Prisma.user_sessionsDelegate<GlobalReject, ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    users: 'users',
    user_about: 'user_about',
    user_analytics: 'user_analytics',
    user_audit_logs: 'user_audit_logs',
    user_blocklist: 'user_blocklist',
    user_certificates: 'user_certificates',
    user_profile: 'user_profile',
    user_security: 'user_security',
    user_sessions: 'user_sessions'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'users' | 'user_about' | 'user_analytics' | 'user_audit_logs' | 'user_blocklist' | 'user_certificates' | 'user_profile' | 'user_security' | 'user_sessions'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      users: {
        payload: usersPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>,
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      user_about: {
        payload: user_aboutPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_aboutFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_aboutFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          findFirst: {
            args: Prisma.user_aboutFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_aboutFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          findMany: {
            args: Prisma.user_aboutFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>[]
          }
          create: {
            args: Prisma.user_aboutCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          createMany: {
            args: Prisma.user_aboutCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_aboutDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          update: {
            args: Prisma.user_aboutUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          deleteMany: {
            args: Prisma.user_aboutDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_aboutUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_aboutUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_aboutPayload>
          }
          aggregate: {
            args: Prisma.User_aboutAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_about>
          }
          groupBy: {
            args: Prisma.User_aboutGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_aboutGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_aboutCountArgs<ExtArgs>,
            result: $Utils.Optional<User_aboutCountAggregateOutputType> | number
          }
        }
      }
      user_analytics: {
        payload: user_analyticsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_analyticsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_analyticsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          findFirst: {
            args: Prisma.user_analyticsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_analyticsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          findMany: {
            args: Prisma.user_analyticsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>[]
          }
          create: {
            args: Prisma.user_analyticsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          createMany: {
            args: Prisma.user_analyticsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_analyticsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          update: {
            args: Prisma.user_analyticsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          deleteMany: {
            args: Prisma.user_analyticsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_analyticsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_analyticsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_analyticsPayload>
          }
          aggregate: {
            args: Prisma.User_analyticsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_analytics>
          }
          groupBy: {
            args: Prisma.User_analyticsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_analyticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_analyticsCountArgs<ExtArgs>,
            result: $Utils.Optional<User_analyticsCountAggregateOutputType> | number
          }
        }
      }
      user_audit_logs: {
        payload: user_audit_logsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_audit_logsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_audit_logsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          findFirst: {
            args: Prisma.user_audit_logsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_audit_logsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          findMany: {
            args: Prisma.user_audit_logsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>[]
          }
          create: {
            args: Prisma.user_audit_logsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          createMany: {
            args: Prisma.user_audit_logsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_audit_logsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          update: {
            args: Prisma.user_audit_logsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          deleteMany: {
            args: Prisma.user_audit_logsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_audit_logsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_audit_logsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_audit_logsPayload>
          }
          aggregate: {
            args: Prisma.User_audit_logsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_audit_logs>
          }
          groupBy: {
            args: Prisma.User_audit_logsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_audit_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_audit_logsCountArgs<ExtArgs>,
            result: $Utils.Optional<User_audit_logsCountAggregateOutputType> | number
          }
        }
      }
      user_blocklist: {
        payload: user_blocklistPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_blocklistFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_blocklistFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          findFirst: {
            args: Prisma.user_blocklistFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_blocklistFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          findMany: {
            args: Prisma.user_blocklistFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>[]
          }
          create: {
            args: Prisma.user_blocklistCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          createMany: {
            args: Prisma.user_blocklistCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_blocklistDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          update: {
            args: Prisma.user_blocklistUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          deleteMany: {
            args: Prisma.user_blocklistDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_blocklistUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_blocklistUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_blocklistPayload>
          }
          aggregate: {
            args: Prisma.User_blocklistAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_blocklist>
          }
          groupBy: {
            args: Prisma.User_blocklistGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_blocklistGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_blocklistCountArgs<ExtArgs>,
            result: $Utils.Optional<User_blocklistCountAggregateOutputType> | number
          }
        }
      }
      user_certificates: {
        payload: user_certificatesPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_certificatesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_certificatesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          findFirst: {
            args: Prisma.user_certificatesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_certificatesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          findMany: {
            args: Prisma.user_certificatesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>[]
          }
          create: {
            args: Prisma.user_certificatesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          createMany: {
            args: Prisma.user_certificatesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_certificatesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          update: {
            args: Prisma.user_certificatesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          deleteMany: {
            args: Prisma.user_certificatesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_certificatesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_certificatesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_certificatesPayload>
          }
          aggregate: {
            args: Prisma.User_certificatesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_certificates>
          }
          groupBy: {
            args: Prisma.User_certificatesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_certificatesGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_certificatesCountArgs<ExtArgs>,
            result: $Utils.Optional<User_certificatesCountAggregateOutputType> | number
          }
        }
      }
      user_profile: {
        payload: user_profilePayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_profileFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_profileFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          findFirst: {
            args: Prisma.user_profileFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_profileFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          findMany: {
            args: Prisma.user_profileFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>[]
          }
          create: {
            args: Prisma.user_profileCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          createMany: {
            args: Prisma.user_profileCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_profileDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          update: {
            args: Prisma.user_profileUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          deleteMany: {
            args: Prisma.user_profileDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_profileUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_profileUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_profilePayload>
          }
          aggregate: {
            args: Prisma.User_profileAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_profile>
          }
          groupBy: {
            args: Prisma.User_profileGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_profileGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_profileCountArgs<ExtArgs>,
            result: $Utils.Optional<User_profileCountAggregateOutputType> | number
          }
        }
      }
      user_security: {
        payload: user_securityPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_securityFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_securityFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          findFirst: {
            args: Prisma.user_securityFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_securityFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          findMany: {
            args: Prisma.user_securityFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>[]
          }
          create: {
            args: Prisma.user_securityCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          createMany: {
            args: Prisma.user_securityCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_securityDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          update: {
            args: Prisma.user_securityUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          deleteMany: {
            args: Prisma.user_securityDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_securityUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_securityUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_securityPayload>
          }
          aggregate: {
            args: Prisma.User_securityAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_security>
          }
          groupBy: {
            args: Prisma.User_securityGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_securityGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_securityCountArgs<ExtArgs>,
            result: $Utils.Optional<User_securityCountAggregateOutputType> | number
          }
        }
      }
      user_sessions: {
        payload: user_sessionsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.user_sessionsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_sessionsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          findFirst: {
            args: Prisma.user_sessionsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_sessionsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          findMany: {
            args: Prisma.user_sessionsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>[]
          }
          create: {
            args: Prisma.user_sessionsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          createMany: {
            args: Prisma.user_sessionsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.user_sessionsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          update: {
            args: Prisma.user_sessionsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          deleteMany: {
            args: Prisma.user_sessionsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.user_sessionsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.user_sessionsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<user_sessionsPayload>
          }
          aggregate: {
            args: Prisma.User_sessionsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser_sessions>
          }
          groupBy: {
            args: Prisma.User_sessionsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<User_sessionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_sessionsCountArgs<ExtArgs>,
            result: $Utils.Optional<User_sessionsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UsersCountOutputType
   */


  export type UsersCountOutputType = {
    user_audit_logs: number
    user_sessions: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    user_audit_logs?: boolean | UsersCountOutputTypeCountUser_audit_logsArgs
    user_sessions?: boolean | UsersCountOutputTypeCountUser_sessionsArgs
  }

  // Custom InputTypes

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_audit_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_audit_logsWhereInput
  }


  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountUser_sessionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_sessionsWhereInput
  }



  /**
   * Models
   */

  /**
   * Model users
   */


  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    initial_balance: number | null
  }

  export type UsersSumAggregateOutputType = {
    initial_balance: number | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password_hash: string | null
    created_at: Date | null
    updated_at: Date | null
    is_verified: boolean | null
    is_active: boolean | null
    pass_salts: string | null
    user_type: string | null
    initial_balance: number | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password_hash: string | null
    created_at: Date | null
    updated_at: Date | null
    is_verified: boolean | null
    is_active: boolean | null
    pass_salts: string | null
    user_type: string | null
    initial_balance: number | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    password_hash: number
    created_at: number
    updated_at: number
    is_verified: number
    is_active: number
    pass_salts: number
    user_type: number
    initial_balance: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    initial_balance?: true
  }

  export type UsersSumAggregateInputType = {
    initial_balance?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password_hash?: true
    created_at?: true
    updated_at?: true
    is_verified?: true
    is_active?: true
    pass_salts?: true
    user_type?: true
    initial_balance?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password_hash?: true
    created_at?: true
    updated_at?: true
    is_verified?: true
    is_active?: true
    pass_salts?: true
    user_type?: true
    initial_balance?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password_hash?: true
    created_at?: true
    updated_at?: true
    is_verified?: true
    is_active?: true
    pass_salts?: true
    user_type?: true
    initial_balance?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: Enumerable<usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: Enumerable<usersOrderByWithAggregationInput>
    by: UsersScalarFieldEnum[]
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }


  export type UsersGroupByOutputType = {
    id: string
    email: string
    phone: string | null
    password_hash: string
    created_at: Date
    updated_at: Date
    is_verified: boolean | null
    is_active: boolean | null
    pass_salts: string | null
    user_type: string | null
    initial_balance: number
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_verified?: boolean
    is_active?: boolean
    pass_salts?: boolean
    user_type?: boolean
    initial_balance?: boolean
    user_about?: boolean | user_aboutArgs<ExtArgs>
    user_analytics?: boolean | user_analyticsArgs<ExtArgs>
    user_audit_logs?: boolean | users$user_audit_logsArgs<ExtArgs>
    user_blocklist?: boolean | user_blocklistArgs<ExtArgs>
    user_certificates?: boolean | user_certificatesArgs<ExtArgs>
    user_profile?: boolean | user_profileArgs<ExtArgs>
    user_security?: boolean | user_securityArgs<ExtArgs>
    user_sessions?: boolean | users$user_sessionsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_verified?: boolean
    is_active?: boolean
    pass_salts?: boolean
    user_type?: boolean
    initial_balance?: boolean
  }

  export type usersInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    user_about?: boolean | user_aboutArgs<ExtArgs>
    user_analytics?: boolean | user_analyticsArgs<ExtArgs>
    user_audit_logs?: boolean | users$user_audit_logsArgs<ExtArgs>
    user_blocklist?: boolean | user_blocklistArgs<ExtArgs>
    user_certificates?: boolean | user_certificatesArgs<ExtArgs>
    user_profile?: boolean | user_profileArgs<ExtArgs>
    user_security?: boolean | user_securityArgs<ExtArgs>
    user_sessions?: boolean | users$user_sessionsArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeArgs<ExtArgs>
  }


  type usersGetPayload<S extends boolean | null | undefined | usersArgs> = $Types.GetResult<usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<usersFindManyArgs, 'select' | 'include'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends usersFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'users'> extends True ? Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Users that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends usersFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'users'> extends True ? Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Users that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends usersFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<usersPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
    **/
    create<T extends usersCreateArgs<ExtArgs>>(
      args: SelectSubset<T, usersCreateArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Users.
     *     @param {usersCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const users = await prisma.users.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends usersCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
    **/
    delete<T extends usersDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, usersDeleteArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends usersUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, usersUpdateArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends usersDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends usersUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
    **/
    upsert<T extends usersUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, usersUpsertArgs<ExtArgs>>
    ): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    user_about<T extends user_aboutArgs<ExtArgs> = {}>(args?: Subset<T, user_aboutArgs<ExtArgs>>): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_analytics<T extends user_analyticsArgs<ExtArgs> = {}>(args?: Subset<T, user_analyticsArgs<ExtArgs>>): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_audit_logs<T extends users$user_audit_logsArgs<ExtArgs> = {}>(args?: Subset<T, users$user_audit_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findMany', never>| Null>;

    user_blocklist<T extends user_blocklistArgs<ExtArgs> = {}>(args?: Subset<T, user_blocklistArgs<ExtArgs>>): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_certificates<T extends user_certificatesArgs<ExtArgs> = {}>(args?: Subset<T, user_certificatesArgs<ExtArgs>>): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_profile<T extends user_profileArgs<ExtArgs> = {}>(args?: Subset<T, user_profileArgs<ExtArgs>>): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_security<T extends user_securityArgs<ExtArgs> = {}>(args?: Subset<T, user_securityArgs<ExtArgs>>): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    user_sessions<T extends users$user_sessionsArgs<ExtArgs> = {}>(args?: Subset<T, users$user_sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * users base type for findUnique actions
   */
  export type usersFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUnique
   */
  export interface usersFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends usersFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }


  /**
   * users base type for findFirst actions
   */
  export type usersFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: Enumerable<usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: Enumerable<UsersScalarFieldEnum>
  }

  /**
   * users findFirst
   */
  export interface usersFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends usersFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: Enumerable<usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: Enumerable<UsersScalarFieldEnum>
  }


  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: Enumerable<usersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: Enumerable<UsersScalarFieldEnum>
  }


  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }


  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: Enumerable<usersCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }


  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
  }


  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }


  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }


  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
  }


  /**
   * users.user_audit_logs
   */
  export type users$user_audit_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    where?: user_audit_logsWhereInput
    orderBy?: Enumerable<user_audit_logsOrderByWithRelationInput>
    cursor?: user_audit_logsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<User_audit_logsScalarFieldEnum>
  }


  /**
   * users.user_sessions
   */
  export type users$user_sessionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    where?: user_sessionsWhereInput
    orderBy?: Enumerable<user_sessionsOrderByWithRelationInput>
    cursor?: user_sessionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<User_sessionsScalarFieldEnum>
  }


  /**
   * users without action
   */
  export type usersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: usersInclude<ExtArgs> | null
  }



  /**
   * Model user_about
   */


  export type AggregateUser_about = {
    _count: User_aboutCountAggregateOutputType | null
    _min: User_aboutMinAggregateOutputType | null
    _max: User_aboutMaxAggregateOutputType | null
  }

  export type User_aboutMinAggregateOutputType = {
    about_id: string | null
    user_id: string | null
    about: string | null
    goals: string | null
  }

  export type User_aboutMaxAggregateOutputType = {
    about_id: string | null
    user_id: string | null
    about: string | null
    goals: string | null
  }

  export type User_aboutCountAggregateOutputType = {
    about_id: number
    user_id: number
    about: number
    goals: number
    skills: number
    _all: number
  }


  export type User_aboutMinAggregateInputType = {
    about_id?: true
    user_id?: true
    about?: true
    goals?: true
  }

  export type User_aboutMaxAggregateInputType = {
    about_id?: true
    user_id?: true
    about?: true
    goals?: true
  }

  export type User_aboutCountAggregateInputType = {
    about_id?: true
    user_id?: true
    about?: true
    goals?: true
    skills?: true
    _all?: true
  }

  export type User_aboutAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_about to aggregate.
     */
    where?: user_aboutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_abouts to fetch.
     */
    orderBy?: Enumerable<user_aboutOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_aboutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_abouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_abouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_abouts
    **/
    _count?: true | User_aboutCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_aboutMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_aboutMaxAggregateInputType
  }

  export type GetUser_aboutAggregateType<T extends User_aboutAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_about]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_about[P]>
      : GetScalarType<T[P], AggregateUser_about[P]>
  }




  export type User_aboutGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_aboutWhereInput
    orderBy?: Enumerable<user_aboutOrderByWithAggregationInput>
    by: User_aboutScalarFieldEnum[]
    having?: user_aboutScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_aboutCountAggregateInputType | true
    _min?: User_aboutMinAggregateInputType
    _max?: User_aboutMaxAggregateInputType
  }


  export type User_aboutGroupByOutputType = {
    about_id: string
    user_id: string
    about: string | null
    goals: string | null
    skills: string[]
    _count: User_aboutCountAggregateOutputType | null
    _min: User_aboutMinAggregateOutputType | null
    _max: User_aboutMaxAggregateOutputType | null
  }

  type GetUser_aboutGroupByPayload<T extends User_aboutGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_aboutGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_aboutGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_aboutGroupByOutputType[P]>
            : GetScalarType<T[P], User_aboutGroupByOutputType[P]>
        }
      >
    >


  export type user_aboutSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    about_id?: boolean
    user_id?: boolean
    about?: boolean
    goals?: boolean
    skills?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_about"]>

  export type user_aboutSelectScalar = {
    about_id?: boolean
    user_id?: boolean
    about?: boolean
    goals?: boolean
    skills?: boolean
  }

  export type user_aboutInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_aboutGetPayload<S extends boolean | null | undefined | user_aboutArgs> = $Types.GetResult<user_aboutPayload, S>

  type user_aboutCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_aboutFindManyArgs, 'select' | 'include'> & {
      select?: User_aboutCountAggregateInputType | true
    }

  export interface user_aboutDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_about'], meta: { name: 'user_about' } }
    /**
     * Find zero or one User_about that matches the filter.
     * @param {user_aboutFindUniqueArgs} args - Arguments to find a User_about
     * @example
     * // Get one User_about
     * const user_about = await prisma.user_about.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_aboutFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_aboutFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_about'> extends True ? Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_about that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_aboutFindUniqueOrThrowArgs} args - Arguments to find a User_about
     * @example
     * // Get one User_about
     * const user_about = await prisma.user_about.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_aboutFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_aboutFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_about that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_aboutFindFirstArgs} args - Arguments to find a User_about
     * @example
     * // Get one User_about
     * const user_about = await prisma.user_about.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_aboutFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_aboutFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_about'> extends True ? Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_about that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_aboutFindFirstOrThrowArgs} args - Arguments to find a User_about
     * @example
     * // Get one User_about
     * const user_about = await prisma.user_about.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_aboutFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_aboutFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_abouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_aboutFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_abouts
     * const user_abouts = await prisma.user_about.findMany()
     * 
     * // Get first 10 User_abouts
     * const user_abouts = await prisma.user_about.findMany({ take: 10 })
     * 
     * // Only select the `about_id`
     * const user_aboutWithAbout_idOnly = await prisma.user_about.findMany({ select: { about_id: true } })
     * 
    **/
    findMany<T extends user_aboutFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_aboutFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_about.
     * @param {user_aboutCreateArgs} args - Arguments to create a User_about.
     * @example
     * // Create one User_about
     * const User_about = await prisma.user_about.create({
     *   data: {
     *     // ... data to create a User_about
     *   }
     * })
     * 
    **/
    create<T extends user_aboutCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_aboutCreateArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_abouts.
     *     @param {user_aboutCreateManyArgs} args - Arguments to create many User_abouts.
     *     @example
     *     // Create many User_abouts
     *     const user_about = await prisma.user_about.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_aboutCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_aboutCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_about.
     * @param {user_aboutDeleteArgs} args - Arguments to delete one User_about.
     * @example
     * // Delete one User_about
     * const User_about = await prisma.user_about.delete({
     *   where: {
     *     // ... filter to delete one User_about
     *   }
     * })
     * 
    **/
    delete<T extends user_aboutDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_aboutDeleteArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_about.
     * @param {user_aboutUpdateArgs} args - Arguments to update one User_about.
     * @example
     * // Update one User_about
     * const user_about = await prisma.user_about.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_aboutUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_aboutUpdateArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_abouts.
     * @param {user_aboutDeleteManyArgs} args - Arguments to filter User_abouts to delete.
     * @example
     * // Delete a few User_abouts
     * const { count } = await prisma.user_about.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_aboutDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_aboutDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_abouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_aboutUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_abouts
     * const user_about = await prisma.user_about.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_aboutUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_aboutUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_about.
     * @param {user_aboutUpsertArgs} args - Arguments to update or create a User_about.
     * @example
     * // Update or create a User_about
     * const user_about = await prisma.user_about.upsert({
     *   create: {
     *     // ... data to create a User_about
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_about we want to update
     *   }
     * })
    **/
    upsert<T extends user_aboutUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_aboutUpsertArgs<ExtArgs>>
    ): Prisma__user_aboutClient<$Types.GetResult<user_aboutPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_abouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_aboutCountArgs} args - Arguments to filter User_abouts to count.
     * @example
     * // Count the number of User_abouts
     * const count = await prisma.user_about.count({
     *   where: {
     *     // ... the filter for the User_abouts we want to count
     *   }
     * })
    **/
    count<T extends user_aboutCountArgs>(
      args?: Subset<T, user_aboutCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_aboutCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_about.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_aboutAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_aboutAggregateArgs>(args: Subset<T, User_aboutAggregateArgs>): Prisma.PrismaPromise<GetUser_aboutAggregateType<T>>

    /**
     * Group by User_about.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_aboutGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_aboutGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_aboutGroupByArgs['orderBy'] }
        : { orderBy?: User_aboutGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_aboutGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_aboutGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_about.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_aboutClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_about base type for findUnique actions
   */
  export type user_aboutFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter, which user_about to fetch.
     */
    where: user_aboutWhereUniqueInput
  }

  /**
   * user_about findUnique
   */
  export interface user_aboutFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_aboutFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_about findUniqueOrThrow
   */
  export type user_aboutFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter, which user_about to fetch.
     */
    where: user_aboutWhereUniqueInput
  }


  /**
   * user_about base type for findFirst actions
   */
  export type user_aboutFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter, which user_about to fetch.
     */
    where?: user_aboutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_abouts to fetch.
     */
    orderBy?: Enumerable<user_aboutOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_abouts.
     */
    cursor?: user_aboutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_abouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_abouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_abouts.
     */
    distinct?: Enumerable<User_aboutScalarFieldEnum>
  }

  /**
   * user_about findFirst
   */
  export interface user_aboutFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_aboutFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_about findFirstOrThrow
   */
  export type user_aboutFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter, which user_about to fetch.
     */
    where?: user_aboutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_abouts to fetch.
     */
    orderBy?: Enumerable<user_aboutOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_abouts.
     */
    cursor?: user_aboutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_abouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_abouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_abouts.
     */
    distinct?: Enumerable<User_aboutScalarFieldEnum>
  }


  /**
   * user_about findMany
   */
  export type user_aboutFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter, which user_abouts to fetch.
     */
    where?: user_aboutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_abouts to fetch.
     */
    orderBy?: Enumerable<user_aboutOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_abouts.
     */
    cursor?: user_aboutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_abouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_abouts.
     */
    skip?: number
    distinct?: Enumerable<User_aboutScalarFieldEnum>
  }


  /**
   * user_about create
   */
  export type user_aboutCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * The data needed to create a user_about.
     */
    data: XOR<user_aboutCreateInput, user_aboutUncheckedCreateInput>
  }


  /**
   * user_about createMany
   */
  export type user_aboutCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_abouts.
     */
    data: Enumerable<user_aboutCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_about update
   */
  export type user_aboutUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * The data needed to update a user_about.
     */
    data: XOR<user_aboutUpdateInput, user_aboutUncheckedUpdateInput>
    /**
     * Choose, which user_about to update.
     */
    where: user_aboutWhereUniqueInput
  }


  /**
   * user_about updateMany
   */
  export type user_aboutUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_abouts.
     */
    data: XOR<user_aboutUpdateManyMutationInput, user_aboutUncheckedUpdateManyInput>
    /**
     * Filter which user_abouts to update
     */
    where?: user_aboutWhereInput
  }


  /**
   * user_about upsert
   */
  export type user_aboutUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * The filter to search for the user_about to update in case it exists.
     */
    where: user_aboutWhereUniqueInput
    /**
     * In case the user_about found by the `where` argument doesn't exist, create a new user_about with this data.
     */
    create: XOR<user_aboutCreateInput, user_aboutUncheckedCreateInput>
    /**
     * In case the user_about was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_aboutUpdateInput, user_aboutUncheckedUpdateInput>
  }


  /**
   * user_about delete
   */
  export type user_aboutDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
    /**
     * Filter which user_about to delete.
     */
    where: user_aboutWhereUniqueInput
  }


  /**
   * user_about deleteMany
   */
  export type user_aboutDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_abouts to delete
     */
    where?: user_aboutWhereInput
  }


  /**
   * user_about without action
   */
  export type user_aboutArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_about
     */
    select?: user_aboutSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_aboutInclude<ExtArgs> | null
  }



  /**
   * Model user_analytics
   */


  export type AggregateUser_analytics = {
    _count: User_analyticsCountAggregateOutputType | null
    _avg: User_analyticsAvgAggregateOutputType | null
    _sum: User_analyticsSumAggregateOutputType | null
    _min: User_analyticsMinAggregateOutputType | null
    _max: User_analyticsMaxAggregateOutputType | null
  }

  export type User_analyticsAvgAggregateOutputType = {
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    activity_score: Decimal | null
  }

  export type User_analyticsSumAggregateOutputType = {
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    activity_score: Decimal | null
  }

  export type User_analyticsMinAggregateOutputType = {
    user_id: string | null
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    last_login: Date | null
    activity_score: Decimal | null
  }

  export type User_analyticsMaxAggregateOutputType = {
    user_id: string | null
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    last_login: Date | null
    activity_score: Decimal | null
  }

  export type User_analyticsCountAggregateOutputType = {
    user_id: number
    posts_count: number
    likes_received: number
    followers_count: number
    following_count: number
    last_login: number
    activity_score: number
    _all: number
  }


  export type User_analyticsAvgAggregateInputType = {
    posts_count?: true
    likes_received?: true
    followers_count?: true
    following_count?: true
    activity_score?: true
  }

  export type User_analyticsSumAggregateInputType = {
    posts_count?: true
    likes_received?: true
    followers_count?: true
    following_count?: true
    activity_score?: true
  }

  export type User_analyticsMinAggregateInputType = {
    user_id?: true
    posts_count?: true
    likes_received?: true
    followers_count?: true
    following_count?: true
    last_login?: true
    activity_score?: true
  }

  export type User_analyticsMaxAggregateInputType = {
    user_id?: true
    posts_count?: true
    likes_received?: true
    followers_count?: true
    following_count?: true
    last_login?: true
    activity_score?: true
  }

  export type User_analyticsCountAggregateInputType = {
    user_id?: true
    posts_count?: true
    likes_received?: true
    followers_count?: true
    following_count?: true
    last_login?: true
    activity_score?: true
    _all?: true
  }

  export type User_analyticsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_analytics to aggregate.
     */
    where?: user_analyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_analytics to fetch.
     */
    orderBy?: Enumerable<user_analyticsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_analyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_analytics
    **/
    _count?: true | User_analyticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_analyticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_analyticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_analyticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_analyticsMaxAggregateInputType
  }

  export type GetUser_analyticsAggregateType<T extends User_analyticsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_analytics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_analytics[P]>
      : GetScalarType<T[P], AggregateUser_analytics[P]>
  }




  export type User_analyticsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_analyticsWhereInput
    orderBy?: Enumerable<user_analyticsOrderByWithAggregationInput>
    by: User_analyticsScalarFieldEnum[]
    having?: user_analyticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_analyticsCountAggregateInputType | true
    _avg?: User_analyticsAvgAggregateInputType
    _sum?: User_analyticsSumAggregateInputType
    _min?: User_analyticsMinAggregateInputType
    _max?: User_analyticsMaxAggregateInputType
  }


  export type User_analyticsGroupByOutputType = {
    user_id: string
    posts_count: number | null
    likes_received: number | null
    followers_count: number | null
    following_count: number | null
    last_login: Date | null
    activity_score: Decimal | null
    _count: User_analyticsCountAggregateOutputType | null
    _avg: User_analyticsAvgAggregateOutputType | null
    _sum: User_analyticsSumAggregateOutputType | null
    _min: User_analyticsMinAggregateOutputType | null
    _max: User_analyticsMaxAggregateOutputType | null
  }

  type GetUser_analyticsGroupByPayload<T extends User_analyticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_analyticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_analyticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_analyticsGroupByOutputType[P]>
            : GetScalarType<T[P], User_analyticsGroupByOutputType[P]>
        }
      >
    >


  export type user_analyticsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    posts_count?: boolean
    likes_received?: boolean
    followers_count?: boolean
    following_count?: boolean
    last_login?: boolean
    activity_score?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_analytics"]>

  export type user_analyticsSelectScalar = {
    user_id?: boolean
    posts_count?: boolean
    likes_received?: boolean
    followers_count?: boolean
    following_count?: boolean
    last_login?: boolean
    activity_score?: boolean
  }

  export type user_analyticsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_analyticsGetPayload<S extends boolean | null | undefined | user_analyticsArgs> = $Types.GetResult<user_analyticsPayload, S>

  type user_analyticsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_analyticsFindManyArgs, 'select' | 'include'> & {
      select?: User_analyticsCountAggregateInputType | true
    }

  export interface user_analyticsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_analytics'], meta: { name: 'user_analytics' } }
    /**
     * Find zero or one User_analytics that matches the filter.
     * @param {user_analyticsFindUniqueArgs} args - Arguments to find a User_analytics
     * @example
     * // Get one User_analytics
     * const user_analytics = await prisma.user_analytics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_analyticsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_analyticsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_analytics'> extends True ? Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_analytics that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_analyticsFindUniqueOrThrowArgs} args - Arguments to find a User_analytics
     * @example
     * // Get one User_analytics
     * const user_analytics = await prisma.user_analytics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_analyticsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_analyticsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_analyticsFindFirstArgs} args - Arguments to find a User_analytics
     * @example
     * // Get one User_analytics
     * const user_analytics = await prisma.user_analytics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_analyticsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_analyticsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_analytics'> extends True ? Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_analytics that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_analyticsFindFirstOrThrowArgs} args - Arguments to find a User_analytics
     * @example
     * // Get one User_analytics
     * const user_analytics = await prisma.user_analytics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_analyticsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_analyticsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_analytics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_analyticsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_analytics
     * const user_analytics = await prisma.user_analytics.findMany()
     * 
     * // Get first 10 User_analytics
     * const user_analytics = await prisma.user_analytics.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_analyticsWithUser_idOnly = await prisma.user_analytics.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends user_analyticsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_analyticsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_analytics.
     * @param {user_analyticsCreateArgs} args - Arguments to create a User_analytics.
     * @example
     * // Create one User_analytics
     * const User_analytics = await prisma.user_analytics.create({
     *   data: {
     *     // ... data to create a User_analytics
     *   }
     * })
     * 
    **/
    create<T extends user_analyticsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_analyticsCreateArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_analytics.
     *     @param {user_analyticsCreateManyArgs} args - Arguments to create many User_analytics.
     *     @example
     *     // Create many User_analytics
     *     const user_analytics = await prisma.user_analytics.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_analyticsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_analyticsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_analytics.
     * @param {user_analyticsDeleteArgs} args - Arguments to delete one User_analytics.
     * @example
     * // Delete one User_analytics
     * const User_analytics = await prisma.user_analytics.delete({
     *   where: {
     *     // ... filter to delete one User_analytics
     *   }
     * })
     * 
    **/
    delete<T extends user_analyticsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_analyticsDeleteArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_analytics.
     * @param {user_analyticsUpdateArgs} args - Arguments to update one User_analytics.
     * @example
     * // Update one User_analytics
     * const user_analytics = await prisma.user_analytics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_analyticsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_analyticsUpdateArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_analytics.
     * @param {user_analyticsDeleteManyArgs} args - Arguments to filter User_analytics to delete.
     * @example
     * // Delete a few User_analytics
     * const { count } = await prisma.user_analytics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_analyticsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_analyticsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_analyticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_analytics
     * const user_analytics = await prisma.user_analytics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_analyticsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_analyticsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_analytics.
     * @param {user_analyticsUpsertArgs} args - Arguments to update or create a User_analytics.
     * @example
     * // Update or create a User_analytics
     * const user_analytics = await prisma.user_analytics.upsert({
     *   create: {
     *     // ... data to create a User_analytics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_analytics we want to update
     *   }
     * })
    **/
    upsert<T extends user_analyticsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_analyticsUpsertArgs<ExtArgs>>
    ): Prisma__user_analyticsClient<$Types.GetResult<user_analyticsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_analyticsCountArgs} args - Arguments to filter User_analytics to count.
     * @example
     * // Count the number of User_analytics
     * const count = await prisma.user_analytics.count({
     *   where: {
     *     // ... the filter for the User_analytics we want to count
     *   }
     * })
    **/
    count<T extends user_analyticsCountArgs>(
      args?: Subset<T, user_analyticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_analyticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_analyticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_analyticsAggregateArgs>(args: Subset<T, User_analyticsAggregateArgs>): Prisma.PrismaPromise<GetUser_analyticsAggregateType<T>>

    /**
     * Group by User_analytics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_analyticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_analyticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_analyticsGroupByArgs['orderBy'] }
        : { orderBy?: User_analyticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_analyticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_analyticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_analytics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_analyticsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_analytics base type for findUnique actions
   */
  export type user_analyticsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter, which user_analytics to fetch.
     */
    where: user_analyticsWhereUniqueInput
  }

  /**
   * user_analytics findUnique
   */
  export interface user_analyticsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_analyticsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_analytics findUniqueOrThrow
   */
  export type user_analyticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter, which user_analytics to fetch.
     */
    where: user_analyticsWhereUniqueInput
  }


  /**
   * user_analytics base type for findFirst actions
   */
  export type user_analyticsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter, which user_analytics to fetch.
     */
    where?: user_analyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_analytics to fetch.
     */
    orderBy?: Enumerable<user_analyticsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_analytics.
     */
    cursor?: user_analyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_analytics.
     */
    distinct?: Enumerable<User_analyticsScalarFieldEnum>
  }

  /**
   * user_analytics findFirst
   */
  export interface user_analyticsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_analyticsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_analytics findFirstOrThrow
   */
  export type user_analyticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter, which user_analytics to fetch.
     */
    where?: user_analyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_analytics to fetch.
     */
    orderBy?: Enumerable<user_analyticsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_analytics.
     */
    cursor?: user_analyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_analytics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_analytics.
     */
    distinct?: Enumerable<User_analyticsScalarFieldEnum>
  }


  /**
   * user_analytics findMany
   */
  export type user_analyticsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter, which user_analytics to fetch.
     */
    where?: user_analyticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_analytics to fetch.
     */
    orderBy?: Enumerable<user_analyticsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_analytics.
     */
    cursor?: user_analyticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_analytics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_analytics.
     */
    skip?: number
    distinct?: Enumerable<User_analyticsScalarFieldEnum>
  }


  /**
   * user_analytics create
   */
  export type user_analyticsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_analytics.
     */
    data: XOR<user_analyticsCreateInput, user_analyticsUncheckedCreateInput>
  }


  /**
   * user_analytics createMany
   */
  export type user_analyticsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_analytics.
     */
    data: Enumerable<user_analyticsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_analytics update
   */
  export type user_analyticsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_analytics.
     */
    data: XOR<user_analyticsUpdateInput, user_analyticsUncheckedUpdateInput>
    /**
     * Choose, which user_analytics to update.
     */
    where: user_analyticsWhereUniqueInput
  }


  /**
   * user_analytics updateMany
   */
  export type user_analyticsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_analytics.
     */
    data: XOR<user_analyticsUpdateManyMutationInput, user_analyticsUncheckedUpdateManyInput>
    /**
     * Filter which user_analytics to update
     */
    where?: user_analyticsWhereInput
  }


  /**
   * user_analytics upsert
   */
  export type user_analyticsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_analytics to update in case it exists.
     */
    where: user_analyticsWhereUniqueInput
    /**
     * In case the user_analytics found by the `where` argument doesn't exist, create a new user_analytics with this data.
     */
    create: XOR<user_analyticsCreateInput, user_analyticsUncheckedCreateInput>
    /**
     * In case the user_analytics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_analyticsUpdateInput, user_analyticsUncheckedUpdateInput>
  }


  /**
   * user_analytics delete
   */
  export type user_analyticsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
    /**
     * Filter which user_analytics to delete.
     */
    where: user_analyticsWhereUniqueInput
  }


  /**
   * user_analytics deleteMany
   */
  export type user_analyticsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_analytics to delete
     */
    where?: user_analyticsWhereInput
  }


  /**
   * user_analytics without action
   */
  export type user_analyticsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_analytics
     */
    select?: user_analyticsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_analyticsInclude<ExtArgs> | null
  }



  /**
   * Model user_audit_logs
   */


  export type AggregateUser_audit_logs = {
    _count: User_audit_logsCountAggregateOutputType | null
    _min: User_audit_logsMinAggregateOutputType | null
    _max: User_audit_logsMaxAggregateOutputType | null
  }

  export type User_audit_logsMinAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    action_type: string | null
    performed_by: string | null
    event_time: Date | null
  }

  export type User_audit_logsMaxAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    action_type: string | null
    performed_by: string | null
    event_time: Date | null
  }

  export type User_audit_logsCountAggregateOutputType = {
    audit_id: number
    user_id: number
    action_type: number
    details: number
    performed_by: number
    event_time: number
    _all: number
  }


  export type User_audit_logsMinAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    performed_by?: true
    event_time?: true
  }

  export type User_audit_logsMaxAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    performed_by?: true
    event_time?: true
  }

  export type User_audit_logsCountAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    details?: true
    performed_by?: true
    event_time?: true
    _all?: true
  }

  export type User_audit_logsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_audit_logs to aggregate.
     */
    where?: user_audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_audit_logs to fetch.
     */
    orderBy?: Enumerable<user_audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_audit_logs
    **/
    _count?: true | User_audit_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_audit_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_audit_logsMaxAggregateInputType
  }

  export type GetUser_audit_logsAggregateType<T extends User_audit_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_audit_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_audit_logs[P]>
      : GetScalarType<T[P], AggregateUser_audit_logs[P]>
  }




  export type User_audit_logsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_audit_logsWhereInput
    orderBy?: Enumerable<user_audit_logsOrderByWithAggregationInput>
    by: User_audit_logsScalarFieldEnum[]
    having?: user_audit_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_audit_logsCountAggregateInputType | true
    _min?: User_audit_logsMinAggregateInputType
    _max?: User_audit_logsMaxAggregateInputType
  }


  export type User_audit_logsGroupByOutputType = {
    audit_id: string
    user_id: string | null
    action_type: string
    details: JsonValue | null
    performed_by: string | null
    event_time: Date
    _count: User_audit_logsCountAggregateOutputType | null
    _min: User_audit_logsMinAggregateOutputType | null
    _max: User_audit_logsMaxAggregateOutputType | null
  }

  type GetUser_audit_logsGroupByPayload<T extends User_audit_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_audit_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_audit_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_audit_logsGroupByOutputType[P]>
            : GetScalarType<T[P], User_audit_logsGroupByOutputType[P]>
        }
      >
    >


  export type user_audit_logsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    audit_id?: boolean
    user_id?: boolean
    action_type?: boolean
    details?: boolean
    performed_by?: boolean
    event_time?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_audit_logs"]>

  export type user_audit_logsSelectScalar = {
    audit_id?: boolean
    user_id?: boolean
    action_type?: boolean
    details?: boolean
    performed_by?: boolean
    event_time?: boolean
  }

  export type user_audit_logsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_audit_logsGetPayload<S extends boolean | null | undefined | user_audit_logsArgs> = $Types.GetResult<user_audit_logsPayload, S>

  type user_audit_logsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_audit_logsFindManyArgs, 'select' | 'include'> & {
      select?: User_audit_logsCountAggregateInputType | true
    }

  export interface user_audit_logsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_audit_logs'], meta: { name: 'user_audit_logs' } }
    /**
     * Find zero or one User_audit_logs that matches the filter.
     * @param {user_audit_logsFindUniqueArgs} args - Arguments to find a User_audit_logs
     * @example
     * // Get one User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_audit_logsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_audit_logsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_audit_logs'> extends True ? Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_audit_logs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_audit_logsFindUniqueOrThrowArgs} args - Arguments to find a User_audit_logs
     * @example
     * // Get one User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_audit_logsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_audit_logsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_audit_logsFindFirstArgs} args - Arguments to find a User_audit_logs
     * @example
     * // Get one User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_audit_logsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_audit_logsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_audit_logs'> extends True ? Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_audit_logs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_audit_logsFindFirstOrThrowArgs} args - Arguments to find a User_audit_logs
     * @example
     * // Get one User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_audit_logsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_audit_logsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_audit_logsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findMany()
     * 
     * // Get first 10 User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.findMany({ take: 10 })
     * 
     * // Only select the `audit_id`
     * const user_audit_logsWithAudit_idOnly = await prisma.user_audit_logs.findMany({ select: { audit_id: true } })
     * 
    **/
    findMany<T extends user_audit_logsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_audit_logsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_audit_logs.
     * @param {user_audit_logsCreateArgs} args - Arguments to create a User_audit_logs.
     * @example
     * // Create one User_audit_logs
     * const User_audit_logs = await prisma.user_audit_logs.create({
     *   data: {
     *     // ... data to create a User_audit_logs
     *   }
     * })
     * 
    **/
    create<T extends user_audit_logsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_audit_logsCreateArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_audit_logs.
     *     @param {user_audit_logsCreateManyArgs} args - Arguments to create many User_audit_logs.
     *     @example
     *     // Create many User_audit_logs
     *     const user_audit_logs = await prisma.user_audit_logs.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_audit_logsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_audit_logsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_audit_logs.
     * @param {user_audit_logsDeleteArgs} args - Arguments to delete one User_audit_logs.
     * @example
     * // Delete one User_audit_logs
     * const User_audit_logs = await prisma.user_audit_logs.delete({
     *   where: {
     *     // ... filter to delete one User_audit_logs
     *   }
     * })
     * 
    **/
    delete<T extends user_audit_logsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_audit_logsDeleteArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_audit_logs.
     * @param {user_audit_logsUpdateArgs} args - Arguments to update one User_audit_logs.
     * @example
     * // Update one User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_audit_logsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_audit_logsUpdateArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_audit_logs.
     * @param {user_audit_logsDeleteManyArgs} args - Arguments to filter User_audit_logs to delete.
     * @example
     * // Delete a few User_audit_logs
     * const { count } = await prisma.user_audit_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_audit_logsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_audit_logsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_audit_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_audit_logsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_audit_logsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_audit_logs.
     * @param {user_audit_logsUpsertArgs} args - Arguments to update or create a User_audit_logs.
     * @example
     * // Update or create a User_audit_logs
     * const user_audit_logs = await prisma.user_audit_logs.upsert({
     *   create: {
     *     // ... data to create a User_audit_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_audit_logs we want to update
     *   }
     * })
    **/
    upsert<T extends user_audit_logsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_audit_logsUpsertArgs<ExtArgs>>
    ): Prisma__user_audit_logsClient<$Types.GetResult<user_audit_logsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_audit_logsCountArgs} args - Arguments to filter User_audit_logs to count.
     * @example
     * // Count the number of User_audit_logs
     * const count = await prisma.user_audit_logs.count({
     *   where: {
     *     // ... the filter for the User_audit_logs we want to count
     *   }
     * })
    **/
    count<T extends user_audit_logsCountArgs>(
      args?: Subset<T, user_audit_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_audit_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_audit_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_audit_logsAggregateArgs>(args: Subset<T, User_audit_logsAggregateArgs>): Prisma.PrismaPromise<GetUser_audit_logsAggregateType<T>>

    /**
     * Group by User_audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_audit_logsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_audit_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_audit_logsGroupByArgs['orderBy'] }
        : { orderBy?: User_audit_logsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_audit_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_audit_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_audit_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_audit_logsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_audit_logs base type for findUnique actions
   */
  export type user_audit_logsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter, which user_audit_logs to fetch.
     */
    where: user_audit_logsWhereUniqueInput
  }

  /**
   * user_audit_logs findUnique
   */
  export interface user_audit_logsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_audit_logsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_audit_logs findUniqueOrThrow
   */
  export type user_audit_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter, which user_audit_logs to fetch.
     */
    where: user_audit_logsWhereUniqueInput
  }


  /**
   * user_audit_logs base type for findFirst actions
   */
  export type user_audit_logsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter, which user_audit_logs to fetch.
     */
    where?: user_audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_audit_logs to fetch.
     */
    orderBy?: Enumerable<user_audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_audit_logs.
     */
    cursor?: user_audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_audit_logs.
     */
    distinct?: Enumerable<User_audit_logsScalarFieldEnum>
  }

  /**
   * user_audit_logs findFirst
   */
  export interface user_audit_logsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_audit_logsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_audit_logs findFirstOrThrow
   */
  export type user_audit_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter, which user_audit_logs to fetch.
     */
    where?: user_audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_audit_logs to fetch.
     */
    orderBy?: Enumerable<user_audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_audit_logs.
     */
    cursor?: user_audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_audit_logs.
     */
    distinct?: Enumerable<User_audit_logsScalarFieldEnum>
  }


  /**
   * user_audit_logs findMany
   */
  export type user_audit_logsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter, which user_audit_logs to fetch.
     */
    where?: user_audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_audit_logs to fetch.
     */
    orderBy?: Enumerable<user_audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_audit_logs.
     */
    cursor?: user_audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_audit_logs.
     */
    skip?: number
    distinct?: Enumerable<User_audit_logsScalarFieldEnum>
  }


  /**
   * user_audit_logs create
   */
  export type user_audit_logsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_audit_logs.
     */
    data: XOR<user_audit_logsCreateInput, user_audit_logsUncheckedCreateInput>
  }


  /**
   * user_audit_logs createMany
   */
  export type user_audit_logsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_audit_logs.
     */
    data: Enumerable<user_audit_logsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_audit_logs update
   */
  export type user_audit_logsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_audit_logs.
     */
    data: XOR<user_audit_logsUpdateInput, user_audit_logsUncheckedUpdateInput>
    /**
     * Choose, which user_audit_logs to update.
     */
    where: user_audit_logsWhereUniqueInput
  }


  /**
   * user_audit_logs updateMany
   */
  export type user_audit_logsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_audit_logs.
     */
    data: XOR<user_audit_logsUpdateManyMutationInput, user_audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which user_audit_logs to update
     */
    where?: user_audit_logsWhereInput
  }


  /**
   * user_audit_logs upsert
   */
  export type user_audit_logsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_audit_logs to update in case it exists.
     */
    where: user_audit_logsWhereUniqueInput
    /**
     * In case the user_audit_logs found by the `where` argument doesn't exist, create a new user_audit_logs with this data.
     */
    create: XOR<user_audit_logsCreateInput, user_audit_logsUncheckedCreateInput>
    /**
     * In case the user_audit_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_audit_logsUpdateInput, user_audit_logsUncheckedUpdateInput>
  }


  /**
   * user_audit_logs delete
   */
  export type user_audit_logsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
    /**
     * Filter which user_audit_logs to delete.
     */
    where: user_audit_logsWhereUniqueInput
  }


  /**
   * user_audit_logs deleteMany
   */
  export type user_audit_logsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_audit_logs to delete
     */
    where?: user_audit_logsWhereInput
  }


  /**
   * user_audit_logs without action
   */
  export type user_audit_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_audit_logs
     */
    select?: user_audit_logsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_audit_logsInclude<ExtArgs> | null
  }



  /**
   * Model user_blocklist
   */


  export type AggregateUser_blocklist = {
    _count: User_blocklistCountAggregateOutputType | null
    _min: User_blocklistMinAggregateOutputType | null
    _max: User_blocklistMaxAggregateOutputType | null
  }

  export type User_blocklistMinAggregateOutputType = {
    block_id: string | null
    user_id: string | null
    reason: string | null
    blocked_at: Date | null
  }

  export type User_blocklistMaxAggregateOutputType = {
    block_id: string | null
    user_id: string | null
    reason: string | null
    blocked_at: Date | null
  }

  export type User_blocklistCountAggregateOutputType = {
    block_id: number
    user_id: number
    reason: number
    blocked_at: number
    _all: number
  }


  export type User_blocklistMinAggregateInputType = {
    block_id?: true
    user_id?: true
    reason?: true
    blocked_at?: true
  }

  export type User_blocklistMaxAggregateInputType = {
    block_id?: true
    user_id?: true
    reason?: true
    blocked_at?: true
  }

  export type User_blocklistCountAggregateInputType = {
    block_id?: true
    user_id?: true
    reason?: true
    blocked_at?: true
    _all?: true
  }

  export type User_blocklistAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_blocklist to aggregate.
     */
    where?: user_blocklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_blocklists to fetch.
     */
    orderBy?: Enumerable<user_blocklistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_blocklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_blocklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_blocklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_blocklists
    **/
    _count?: true | User_blocklistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_blocklistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_blocklistMaxAggregateInputType
  }

  export type GetUser_blocklistAggregateType<T extends User_blocklistAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_blocklist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_blocklist[P]>
      : GetScalarType<T[P], AggregateUser_blocklist[P]>
  }




  export type User_blocklistGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_blocklistWhereInput
    orderBy?: Enumerable<user_blocklistOrderByWithAggregationInput>
    by: User_blocklistScalarFieldEnum[]
    having?: user_blocklistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_blocklistCountAggregateInputType | true
    _min?: User_blocklistMinAggregateInputType
    _max?: User_blocklistMaxAggregateInputType
  }


  export type User_blocklistGroupByOutputType = {
    block_id: string
    user_id: string | null
    reason: string
    blocked_at: Date
    _count: User_blocklistCountAggregateOutputType | null
    _min: User_blocklistMinAggregateOutputType | null
    _max: User_blocklistMaxAggregateOutputType | null
  }

  type GetUser_blocklistGroupByPayload<T extends User_blocklistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_blocklistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_blocklistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_blocklistGroupByOutputType[P]>
            : GetScalarType<T[P], User_blocklistGroupByOutputType[P]>
        }
      >
    >


  export type user_blocklistSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    block_id?: boolean
    user_id?: boolean
    reason?: boolean
    blocked_at?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_blocklist"]>

  export type user_blocklistSelectScalar = {
    block_id?: boolean
    user_id?: boolean
    reason?: boolean
    blocked_at?: boolean
  }

  export type user_blocklistInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_blocklistGetPayload<S extends boolean | null | undefined | user_blocklistArgs> = $Types.GetResult<user_blocklistPayload, S>

  type user_blocklistCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_blocklistFindManyArgs, 'select' | 'include'> & {
      select?: User_blocklistCountAggregateInputType | true
    }

  export interface user_blocklistDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_blocklist'], meta: { name: 'user_blocklist' } }
    /**
     * Find zero or one User_blocklist that matches the filter.
     * @param {user_blocklistFindUniqueArgs} args - Arguments to find a User_blocklist
     * @example
     * // Get one User_blocklist
     * const user_blocklist = await prisma.user_blocklist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_blocklistFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_blocklistFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_blocklist'> extends True ? Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_blocklist that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_blocklistFindUniqueOrThrowArgs} args - Arguments to find a User_blocklist
     * @example
     * // Get one User_blocklist
     * const user_blocklist = await prisma.user_blocklist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_blocklistFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_blocklistFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_blocklist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_blocklistFindFirstArgs} args - Arguments to find a User_blocklist
     * @example
     * // Get one User_blocklist
     * const user_blocklist = await prisma.user_blocklist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_blocklistFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_blocklistFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_blocklist'> extends True ? Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_blocklist that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_blocklistFindFirstOrThrowArgs} args - Arguments to find a User_blocklist
     * @example
     * // Get one User_blocklist
     * const user_blocklist = await prisma.user_blocklist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_blocklistFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_blocklistFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_blocklists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_blocklistFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_blocklists
     * const user_blocklists = await prisma.user_blocklist.findMany()
     * 
     * // Get first 10 User_blocklists
     * const user_blocklists = await prisma.user_blocklist.findMany({ take: 10 })
     * 
     * // Only select the `block_id`
     * const user_blocklistWithBlock_idOnly = await prisma.user_blocklist.findMany({ select: { block_id: true } })
     * 
    **/
    findMany<T extends user_blocklistFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_blocklistFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_blocklist.
     * @param {user_blocklistCreateArgs} args - Arguments to create a User_blocklist.
     * @example
     * // Create one User_blocklist
     * const User_blocklist = await prisma.user_blocklist.create({
     *   data: {
     *     // ... data to create a User_blocklist
     *   }
     * })
     * 
    **/
    create<T extends user_blocklistCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_blocklistCreateArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_blocklists.
     *     @param {user_blocklistCreateManyArgs} args - Arguments to create many User_blocklists.
     *     @example
     *     // Create many User_blocklists
     *     const user_blocklist = await prisma.user_blocklist.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_blocklistCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_blocklistCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_blocklist.
     * @param {user_blocklistDeleteArgs} args - Arguments to delete one User_blocklist.
     * @example
     * // Delete one User_blocklist
     * const User_blocklist = await prisma.user_blocklist.delete({
     *   where: {
     *     // ... filter to delete one User_blocklist
     *   }
     * })
     * 
    **/
    delete<T extends user_blocklistDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_blocklistDeleteArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_blocklist.
     * @param {user_blocklistUpdateArgs} args - Arguments to update one User_blocklist.
     * @example
     * // Update one User_blocklist
     * const user_blocklist = await prisma.user_blocklist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_blocklistUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_blocklistUpdateArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_blocklists.
     * @param {user_blocklistDeleteManyArgs} args - Arguments to filter User_blocklists to delete.
     * @example
     * // Delete a few User_blocklists
     * const { count } = await prisma.user_blocklist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_blocklistDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_blocklistDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_blocklists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_blocklistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_blocklists
     * const user_blocklist = await prisma.user_blocklist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_blocklistUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_blocklistUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_blocklist.
     * @param {user_blocklistUpsertArgs} args - Arguments to update or create a User_blocklist.
     * @example
     * // Update or create a User_blocklist
     * const user_blocklist = await prisma.user_blocklist.upsert({
     *   create: {
     *     // ... data to create a User_blocklist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_blocklist we want to update
     *   }
     * })
    **/
    upsert<T extends user_blocklistUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_blocklistUpsertArgs<ExtArgs>>
    ): Prisma__user_blocklistClient<$Types.GetResult<user_blocklistPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_blocklists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_blocklistCountArgs} args - Arguments to filter User_blocklists to count.
     * @example
     * // Count the number of User_blocklists
     * const count = await prisma.user_blocklist.count({
     *   where: {
     *     // ... the filter for the User_blocklists we want to count
     *   }
     * })
    **/
    count<T extends user_blocklistCountArgs>(
      args?: Subset<T, user_blocklistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_blocklistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_blocklist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_blocklistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_blocklistAggregateArgs>(args: Subset<T, User_blocklistAggregateArgs>): Prisma.PrismaPromise<GetUser_blocklistAggregateType<T>>

    /**
     * Group by User_blocklist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_blocklistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_blocklistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_blocklistGroupByArgs['orderBy'] }
        : { orderBy?: User_blocklistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_blocklistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_blocklistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_blocklist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_blocklistClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_blocklist base type for findUnique actions
   */
  export type user_blocklistFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter, which user_blocklist to fetch.
     */
    where: user_blocklistWhereUniqueInput
  }

  /**
   * user_blocklist findUnique
   */
  export interface user_blocklistFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_blocklistFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_blocklist findUniqueOrThrow
   */
  export type user_blocklistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter, which user_blocklist to fetch.
     */
    where: user_blocklistWhereUniqueInput
  }


  /**
   * user_blocklist base type for findFirst actions
   */
  export type user_blocklistFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter, which user_blocklist to fetch.
     */
    where?: user_blocklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_blocklists to fetch.
     */
    orderBy?: Enumerable<user_blocklistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_blocklists.
     */
    cursor?: user_blocklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_blocklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_blocklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_blocklists.
     */
    distinct?: Enumerable<User_blocklistScalarFieldEnum>
  }

  /**
   * user_blocklist findFirst
   */
  export interface user_blocklistFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_blocklistFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_blocklist findFirstOrThrow
   */
  export type user_blocklistFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter, which user_blocklist to fetch.
     */
    where?: user_blocklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_blocklists to fetch.
     */
    orderBy?: Enumerable<user_blocklistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_blocklists.
     */
    cursor?: user_blocklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_blocklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_blocklists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_blocklists.
     */
    distinct?: Enumerable<User_blocklistScalarFieldEnum>
  }


  /**
   * user_blocklist findMany
   */
  export type user_blocklistFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter, which user_blocklists to fetch.
     */
    where?: user_blocklistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_blocklists to fetch.
     */
    orderBy?: Enumerable<user_blocklistOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_blocklists.
     */
    cursor?: user_blocklistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_blocklists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_blocklists.
     */
    skip?: number
    distinct?: Enumerable<User_blocklistScalarFieldEnum>
  }


  /**
   * user_blocklist create
   */
  export type user_blocklistCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * The data needed to create a user_blocklist.
     */
    data: XOR<user_blocklistCreateInput, user_blocklistUncheckedCreateInput>
  }


  /**
   * user_blocklist createMany
   */
  export type user_blocklistCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_blocklists.
     */
    data: Enumerable<user_blocklistCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_blocklist update
   */
  export type user_blocklistUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * The data needed to update a user_blocklist.
     */
    data: XOR<user_blocklistUpdateInput, user_blocklistUncheckedUpdateInput>
    /**
     * Choose, which user_blocklist to update.
     */
    where: user_blocklistWhereUniqueInput
  }


  /**
   * user_blocklist updateMany
   */
  export type user_blocklistUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_blocklists.
     */
    data: XOR<user_blocklistUpdateManyMutationInput, user_blocklistUncheckedUpdateManyInput>
    /**
     * Filter which user_blocklists to update
     */
    where?: user_blocklistWhereInput
  }


  /**
   * user_blocklist upsert
   */
  export type user_blocklistUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * The filter to search for the user_blocklist to update in case it exists.
     */
    where: user_blocklistWhereUniqueInput
    /**
     * In case the user_blocklist found by the `where` argument doesn't exist, create a new user_blocklist with this data.
     */
    create: XOR<user_blocklistCreateInput, user_blocklistUncheckedCreateInput>
    /**
     * In case the user_blocklist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_blocklistUpdateInput, user_blocklistUncheckedUpdateInput>
  }


  /**
   * user_blocklist delete
   */
  export type user_blocklistDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
    /**
     * Filter which user_blocklist to delete.
     */
    where: user_blocklistWhereUniqueInput
  }


  /**
   * user_blocklist deleteMany
   */
  export type user_blocklistDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_blocklists to delete
     */
    where?: user_blocklistWhereInput
  }


  /**
   * user_blocklist without action
   */
  export type user_blocklistArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_blocklist
     */
    select?: user_blocklistSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_blocklistInclude<ExtArgs> | null
  }



  /**
   * Model user_certificates
   */


  export type AggregateUser_certificates = {
    _count: User_certificatesCountAggregateOutputType | null
    _min: User_certificatesMinAggregateOutputType | null
    _max: User_certificatesMaxAggregateOutputType | null
  }

  export type User_certificatesMinAggregateOutputType = {
    user_id: string | null
    public_key: string | null
    certificate: string | null
    created_at: Date | null
  }

  export type User_certificatesMaxAggregateOutputType = {
    user_id: string | null
    public_key: string | null
    certificate: string | null
    created_at: Date | null
  }

  export type User_certificatesCountAggregateOutputType = {
    user_id: number
    public_key: number
    certificate: number
    created_at: number
    _all: number
  }


  export type User_certificatesMinAggregateInputType = {
    user_id?: true
    public_key?: true
    certificate?: true
    created_at?: true
  }

  export type User_certificatesMaxAggregateInputType = {
    user_id?: true
    public_key?: true
    certificate?: true
    created_at?: true
  }

  export type User_certificatesCountAggregateInputType = {
    user_id?: true
    public_key?: true
    certificate?: true
    created_at?: true
    _all?: true
  }

  export type User_certificatesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_certificates to aggregate.
     */
    where?: user_certificatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_certificates to fetch.
     */
    orderBy?: Enumerable<user_certificatesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_certificatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_certificates
    **/
    _count?: true | User_certificatesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_certificatesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_certificatesMaxAggregateInputType
  }

  export type GetUser_certificatesAggregateType<T extends User_certificatesAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_certificates]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_certificates[P]>
      : GetScalarType<T[P], AggregateUser_certificates[P]>
  }




  export type User_certificatesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_certificatesWhereInput
    orderBy?: Enumerable<user_certificatesOrderByWithAggregationInput>
    by: User_certificatesScalarFieldEnum[]
    having?: user_certificatesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_certificatesCountAggregateInputType | true
    _min?: User_certificatesMinAggregateInputType
    _max?: User_certificatesMaxAggregateInputType
  }


  export type User_certificatesGroupByOutputType = {
    user_id: string
    public_key: string
    certificate: string | null
    created_at: Date
    _count: User_certificatesCountAggregateOutputType | null
    _min: User_certificatesMinAggregateOutputType | null
    _max: User_certificatesMaxAggregateOutputType | null
  }

  type GetUser_certificatesGroupByPayload<T extends User_certificatesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_certificatesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_certificatesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_certificatesGroupByOutputType[P]>
            : GetScalarType<T[P], User_certificatesGroupByOutputType[P]>
        }
      >
    >


  export type user_certificatesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    public_key?: boolean
    certificate?: boolean
    created_at?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_certificates"]>

  export type user_certificatesSelectScalar = {
    user_id?: boolean
    public_key?: boolean
    certificate?: boolean
    created_at?: boolean
  }

  export type user_certificatesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_certificatesGetPayload<S extends boolean | null | undefined | user_certificatesArgs> = $Types.GetResult<user_certificatesPayload, S>

  type user_certificatesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_certificatesFindManyArgs, 'select' | 'include'> & {
      select?: User_certificatesCountAggregateInputType | true
    }

  export interface user_certificatesDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_certificates'], meta: { name: 'user_certificates' } }
    /**
     * Find zero or one User_certificates that matches the filter.
     * @param {user_certificatesFindUniqueArgs} args - Arguments to find a User_certificates
     * @example
     * // Get one User_certificates
     * const user_certificates = await prisma.user_certificates.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_certificatesFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_certificatesFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_certificates'> extends True ? Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_certificates that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_certificatesFindUniqueOrThrowArgs} args - Arguments to find a User_certificates
     * @example
     * // Get one User_certificates
     * const user_certificates = await prisma.user_certificates.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_certificatesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_certificatesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_certificates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_certificatesFindFirstArgs} args - Arguments to find a User_certificates
     * @example
     * // Get one User_certificates
     * const user_certificates = await prisma.user_certificates.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_certificatesFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_certificatesFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_certificates'> extends True ? Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_certificates that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_certificatesFindFirstOrThrowArgs} args - Arguments to find a User_certificates
     * @example
     * // Get one User_certificates
     * const user_certificates = await prisma.user_certificates.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_certificatesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_certificatesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_certificates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_certificatesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_certificates
     * const user_certificates = await prisma.user_certificates.findMany()
     * 
     * // Get first 10 User_certificates
     * const user_certificates = await prisma.user_certificates.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_certificatesWithUser_idOnly = await prisma.user_certificates.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends user_certificatesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_certificatesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_certificates.
     * @param {user_certificatesCreateArgs} args - Arguments to create a User_certificates.
     * @example
     * // Create one User_certificates
     * const User_certificates = await prisma.user_certificates.create({
     *   data: {
     *     // ... data to create a User_certificates
     *   }
     * })
     * 
    **/
    create<T extends user_certificatesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_certificatesCreateArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_certificates.
     *     @param {user_certificatesCreateManyArgs} args - Arguments to create many User_certificates.
     *     @example
     *     // Create many User_certificates
     *     const user_certificates = await prisma.user_certificates.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_certificatesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_certificatesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_certificates.
     * @param {user_certificatesDeleteArgs} args - Arguments to delete one User_certificates.
     * @example
     * // Delete one User_certificates
     * const User_certificates = await prisma.user_certificates.delete({
     *   where: {
     *     // ... filter to delete one User_certificates
     *   }
     * })
     * 
    **/
    delete<T extends user_certificatesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_certificatesDeleteArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_certificates.
     * @param {user_certificatesUpdateArgs} args - Arguments to update one User_certificates.
     * @example
     * // Update one User_certificates
     * const user_certificates = await prisma.user_certificates.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_certificatesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_certificatesUpdateArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_certificates.
     * @param {user_certificatesDeleteManyArgs} args - Arguments to filter User_certificates to delete.
     * @example
     * // Delete a few User_certificates
     * const { count } = await prisma.user_certificates.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_certificatesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_certificatesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_certificatesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_certificates
     * const user_certificates = await prisma.user_certificates.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_certificatesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_certificatesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_certificates.
     * @param {user_certificatesUpsertArgs} args - Arguments to update or create a User_certificates.
     * @example
     * // Update or create a User_certificates
     * const user_certificates = await prisma.user_certificates.upsert({
     *   create: {
     *     // ... data to create a User_certificates
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_certificates we want to update
     *   }
     * })
    **/
    upsert<T extends user_certificatesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_certificatesUpsertArgs<ExtArgs>>
    ): Prisma__user_certificatesClient<$Types.GetResult<user_certificatesPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_certificatesCountArgs} args - Arguments to filter User_certificates to count.
     * @example
     * // Count the number of User_certificates
     * const count = await prisma.user_certificates.count({
     *   where: {
     *     // ... the filter for the User_certificates we want to count
     *   }
     * })
    **/
    count<T extends user_certificatesCountArgs>(
      args?: Subset<T, user_certificatesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_certificatesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_certificatesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_certificatesAggregateArgs>(args: Subset<T, User_certificatesAggregateArgs>): Prisma.PrismaPromise<GetUser_certificatesAggregateType<T>>

    /**
     * Group by User_certificates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_certificatesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_certificatesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_certificatesGroupByArgs['orderBy'] }
        : { orderBy?: User_certificatesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_certificatesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_certificatesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_certificates.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_certificatesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_certificates base type for findUnique actions
   */
  export type user_certificatesFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter, which user_certificates to fetch.
     */
    where: user_certificatesWhereUniqueInput
  }

  /**
   * user_certificates findUnique
   */
  export interface user_certificatesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_certificatesFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_certificates findUniqueOrThrow
   */
  export type user_certificatesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter, which user_certificates to fetch.
     */
    where: user_certificatesWhereUniqueInput
  }


  /**
   * user_certificates base type for findFirst actions
   */
  export type user_certificatesFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter, which user_certificates to fetch.
     */
    where?: user_certificatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_certificates to fetch.
     */
    orderBy?: Enumerable<user_certificatesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_certificates.
     */
    cursor?: user_certificatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_certificates.
     */
    distinct?: Enumerable<User_certificatesScalarFieldEnum>
  }

  /**
   * user_certificates findFirst
   */
  export interface user_certificatesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_certificatesFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_certificates findFirstOrThrow
   */
  export type user_certificatesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter, which user_certificates to fetch.
     */
    where?: user_certificatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_certificates to fetch.
     */
    orderBy?: Enumerable<user_certificatesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_certificates.
     */
    cursor?: user_certificatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_certificates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_certificates.
     */
    distinct?: Enumerable<User_certificatesScalarFieldEnum>
  }


  /**
   * user_certificates findMany
   */
  export type user_certificatesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter, which user_certificates to fetch.
     */
    where?: user_certificatesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_certificates to fetch.
     */
    orderBy?: Enumerable<user_certificatesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_certificates.
     */
    cursor?: user_certificatesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_certificates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_certificates.
     */
    skip?: number
    distinct?: Enumerable<User_certificatesScalarFieldEnum>
  }


  /**
   * user_certificates create
   */
  export type user_certificatesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * The data needed to create a user_certificates.
     */
    data: XOR<user_certificatesCreateInput, user_certificatesUncheckedCreateInput>
  }


  /**
   * user_certificates createMany
   */
  export type user_certificatesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_certificates.
     */
    data: Enumerable<user_certificatesCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_certificates update
   */
  export type user_certificatesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * The data needed to update a user_certificates.
     */
    data: XOR<user_certificatesUpdateInput, user_certificatesUncheckedUpdateInput>
    /**
     * Choose, which user_certificates to update.
     */
    where: user_certificatesWhereUniqueInput
  }


  /**
   * user_certificates updateMany
   */
  export type user_certificatesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_certificates.
     */
    data: XOR<user_certificatesUpdateManyMutationInput, user_certificatesUncheckedUpdateManyInput>
    /**
     * Filter which user_certificates to update
     */
    where?: user_certificatesWhereInput
  }


  /**
   * user_certificates upsert
   */
  export type user_certificatesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * The filter to search for the user_certificates to update in case it exists.
     */
    where: user_certificatesWhereUniqueInput
    /**
     * In case the user_certificates found by the `where` argument doesn't exist, create a new user_certificates with this data.
     */
    create: XOR<user_certificatesCreateInput, user_certificatesUncheckedCreateInput>
    /**
     * In case the user_certificates was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_certificatesUpdateInput, user_certificatesUncheckedUpdateInput>
  }


  /**
   * user_certificates delete
   */
  export type user_certificatesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
    /**
     * Filter which user_certificates to delete.
     */
    where: user_certificatesWhereUniqueInput
  }


  /**
   * user_certificates deleteMany
   */
  export type user_certificatesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_certificates to delete
     */
    where?: user_certificatesWhereInput
  }


  /**
   * user_certificates without action
   */
  export type user_certificatesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_certificates
     */
    select?: user_certificatesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_certificatesInclude<ExtArgs> | null
  }



  /**
   * Model user_profile
   */


  export type AggregateUser_profile = {
    _count: User_profileCountAggregateOutputType | null
    _min: User_profileMinAggregateOutputType | null
    _max: User_profileMaxAggregateOutputType | null
  }

  export type User_profileMinAggregateOutputType = {
    user_id: string | null
    username: string | null
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    website: string | null
    updated_at: Date | null
    dob: Date | null
    country: string | null
    banner_url: string | null
  }

  export type User_profileMaxAggregateOutputType = {
    user_id: string | null
    username: string | null
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    website: string | null
    updated_at: Date | null
    dob: Date | null
    country: string | null
    banner_url: string | null
  }

  export type User_profileCountAggregateOutputType = {
    user_id: number
    username: number
    display_name: number
    bio: number
    avatar_url: number
    website: number
    social_links: number
    updated_at: number
    dob: number
    country: number
    banner_url: number
    _all: number
  }


  export type User_profileMinAggregateInputType = {
    user_id?: true
    username?: true
    display_name?: true
    bio?: true
    avatar_url?: true
    website?: true
    updated_at?: true
    dob?: true
    country?: true
    banner_url?: true
  }

  export type User_profileMaxAggregateInputType = {
    user_id?: true
    username?: true
    display_name?: true
    bio?: true
    avatar_url?: true
    website?: true
    updated_at?: true
    dob?: true
    country?: true
    banner_url?: true
  }

  export type User_profileCountAggregateInputType = {
    user_id?: true
    username?: true
    display_name?: true
    bio?: true
    avatar_url?: true
    website?: true
    social_links?: true
    updated_at?: true
    dob?: true
    country?: true
    banner_url?: true
    _all?: true
  }

  export type User_profileAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_profile to aggregate.
     */
    where?: user_profileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_profiles to fetch.
     */
    orderBy?: Enumerable<user_profileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_profileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_profiles
    **/
    _count?: true | User_profileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_profileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_profileMaxAggregateInputType
  }

  export type GetUser_profileAggregateType<T extends User_profileAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_profile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_profile[P]>
      : GetScalarType<T[P], AggregateUser_profile[P]>
  }




  export type User_profileGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_profileWhereInput
    orderBy?: Enumerable<user_profileOrderByWithAggregationInput>
    by: User_profileScalarFieldEnum[]
    having?: user_profileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_profileCountAggregateInputType | true
    _min?: User_profileMinAggregateInputType
    _max?: User_profileMaxAggregateInputType
  }


  export type User_profileGroupByOutputType = {
    user_id: string
    username: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
    website: string | null
    social_links: JsonValue | null
    updated_at: Date
    dob: Date | null
    country: string | null
    banner_url: string | null
    _count: User_profileCountAggregateOutputType | null
    _min: User_profileMinAggregateOutputType | null
    _max: User_profileMaxAggregateOutputType | null
  }

  type GetUser_profileGroupByPayload<T extends User_profileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_profileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_profileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_profileGroupByOutputType[P]>
            : GetScalarType<T[P], User_profileGroupByOutputType[P]>
        }
      >
    >


  export type user_profileSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    username?: boolean
    display_name?: boolean
    bio?: boolean
    avatar_url?: boolean
    website?: boolean
    social_links?: boolean
    updated_at?: boolean
    dob?: boolean
    country?: boolean
    banner_url?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_profile"]>

  export type user_profileSelectScalar = {
    user_id?: boolean
    username?: boolean
    display_name?: boolean
    bio?: boolean
    avatar_url?: boolean
    website?: boolean
    social_links?: boolean
    updated_at?: boolean
    dob?: boolean
    country?: boolean
    banner_url?: boolean
  }

  export type user_profileInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_profileGetPayload<S extends boolean | null | undefined | user_profileArgs> = $Types.GetResult<user_profilePayload, S>

  type user_profileCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_profileFindManyArgs, 'select' | 'include'> & {
      select?: User_profileCountAggregateInputType | true
    }

  export interface user_profileDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_profile'], meta: { name: 'user_profile' } }
    /**
     * Find zero or one User_profile that matches the filter.
     * @param {user_profileFindUniqueArgs} args - Arguments to find a User_profile
     * @example
     * // Get one User_profile
     * const user_profile = await prisma.user_profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_profileFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_profileFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_profile'> extends True ? Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_profile that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_profileFindUniqueOrThrowArgs} args - Arguments to find a User_profile
     * @example
     * // Get one User_profile
     * const user_profile = await prisma.user_profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_profileFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_profileFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_profileFindFirstArgs} args - Arguments to find a User_profile
     * @example
     * // Get one User_profile
     * const user_profile = await prisma.user_profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_profileFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_profileFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_profile'> extends True ? Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_profile that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_profileFindFirstOrThrowArgs} args - Arguments to find a User_profile
     * @example
     * // Get one User_profile
     * const user_profile = await prisma.user_profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_profileFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_profileFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_profileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_profiles
     * const user_profiles = await prisma.user_profile.findMany()
     * 
     * // Get first 10 User_profiles
     * const user_profiles = await prisma.user_profile.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_profileWithUser_idOnly = await prisma.user_profile.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends user_profileFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_profileFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_profile.
     * @param {user_profileCreateArgs} args - Arguments to create a User_profile.
     * @example
     * // Create one User_profile
     * const User_profile = await prisma.user_profile.create({
     *   data: {
     *     // ... data to create a User_profile
     *   }
     * })
     * 
    **/
    create<T extends user_profileCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_profileCreateArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_profiles.
     *     @param {user_profileCreateManyArgs} args - Arguments to create many User_profiles.
     *     @example
     *     // Create many User_profiles
     *     const user_profile = await prisma.user_profile.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_profileCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_profileCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_profile.
     * @param {user_profileDeleteArgs} args - Arguments to delete one User_profile.
     * @example
     * // Delete one User_profile
     * const User_profile = await prisma.user_profile.delete({
     *   where: {
     *     // ... filter to delete one User_profile
     *   }
     * })
     * 
    **/
    delete<T extends user_profileDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_profileDeleteArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_profile.
     * @param {user_profileUpdateArgs} args - Arguments to update one User_profile.
     * @example
     * // Update one User_profile
     * const user_profile = await prisma.user_profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_profileUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_profileUpdateArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_profiles.
     * @param {user_profileDeleteManyArgs} args - Arguments to filter User_profiles to delete.
     * @example
     * // Delete a few User_profiles
     * const { count } = await prisma.user_profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_profileDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_profileDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_profileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_profiles
     * const user_profile = await prisma.user_profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_profileUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_profileUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_profile.
     * @param {user_profileUpsertArgs} args - Arguments to update or create a User_profile.
     * @example
     * // Update or create a User_profile
     * const user_profile = await prisma.user_profile.upsert({
     *   create: {
     *     // ... data to create a User_profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_profile we want to update
     *   }
     * })
    **/
    upsert<T extends user_profileUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_profileUpsertArgs<ExtArgs>>
    ): Prisma__user_profileClient<$Types.GetResult<user_profilePayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_profileCountArgs} args - Arguments to filter User_profiles to count.
     * @example
     * // Count the number of User_profiles
     * const count = await prisma.user_profile.count({
     *   where: {
     *     // ... the filter for the User_profiles we want to count
     *   }
     * })
    **/
    count<T extends user_profileCountArgs>(
      args?: Subset<T, user_profileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_profileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_profileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_profileAggregateArgs>(args: Subset<T, User_profileAggregateArgs>): Prisma.PrismaPromise<GetUser_profileAggregateType<T>>

    /**
     * Group by User_profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_profileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_profileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_profileGroupByArgs['orderBy'] }
        : { orderBy?: User_profileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_profileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_profileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_profileClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_profile base type for findUnique actions
   */
  export type user_profileFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter, which user_profile to fetch.
     */
    where: user_profileWhereUniqueInput
  }

  /**
   * user_profile findUnique
   */
  export interface user_profileFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_profileFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_profile findUniqueOrThrow
   */
  export type user_profileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter, which user_profile to fetch.
     */
    where: user_profileWhereUniqueInput
  }


  /**
   * user_profile base type for findFirst actions
   */
  export type user_profileFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter, which user_profile to fetch.
     */
    where?: user_profileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_profiles to fetch.
     */
    orderBy?: Enumerable<user_profileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_profiles.
     */
    cursor?: user_profileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_profiles.
     */
    distinct?: Enumerable<User_profileScalarFieldEnum>
  }

  /**
   * user_profile findFirst
   */
  export interface user_profileFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_profileFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_profile findFirstOrThrow
   */
  export type user_profileFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter, which user_profile to fetch.
     */
    where?: user_profileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_profiles to fetch.
     */
    orderBy?: Enumerable<user_profileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_profiles.
     */
    cursor?: user_profileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_profiles.
     */
    distinct?: Enumerable<User_profileScalarFieldEnum>
  }


  /**
   * user_profile findMany
   */
  export type user_profileFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter, which user_profiles to fetch.
     */
    where?: user_profileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_profiles to fetch.
     */
    orderBy?: Enumerable<user_profileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_profiles.
     */
    cursor?: user_profileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_profiles.
     */
    skip?: number
    distinct?: Enumerable<User_profileScalarFieldEnum>
  }


  /**
   * user_profile create
   */
  export type user_profileCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * The data needed to create a user_profile.
     */
    data: XOR<user_profileCreateInput, user_profileUncheckedCreateInput>
  }


  /**
   * user_profile createMany
   */
  export type user_profileCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_profiles.
     */
    data: Enumerable<user_profileCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_profile update
   */
  export type user_profileUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * The data needed to update a user_profile.
     */
    data: XOR<user_profileUpdateInput, user_profileUncheckedUpdateInput>
    /**
     * Choose, which user_profile to update.
     */
    where: user_profileWhereUniqueInput
  }


  /**
   * user_profile updateMany
   */
  export type user_profileUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_profiles.
     */
    data: XOR<user_profileUpdateManyMutationInput, user_profileUncheckedUpdateManyInput>
    /**
     * Filter which user_profiles to update
     */
    where?: user_profileWhereInput
  }


  /**
   * user_profile upsert
   */
  export type user_profileUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * The filter to search for the user_profile to update in case it exists.
     */
    where: user_profileWhereUniqueInput
    /**
     * In case the user_profile found by the `where` argument doesn't exist, create a new user_profile with this data.
     */
    create: XOR<user_profileCreateInput, user_profileUncheckedCreateInput>
    /**
     * In case the user_profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_profileUpdateInput, user_profileUncheckedUpdateInput>
  }


  /**
   * user_profile delete
   */
  export type user_profileDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
    /**
     * Filter which user_profile to delete.
     */
    where: user_profileWhereUniqueInput
  }


  /**
   * user_profile deleteMany
   */
  export type user_profileDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_profiles to delete
     */
    where?: user_profileWhereInput
  }


  /**
   * user_profile without action
   */
  export type user_profileArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_profile
     */
    select?: user_profileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_profileInclude<ExtArgs> | null
  }



  /**
   * Model user_security
   */


  export type AggregateUser_security = {
    _count: User_securityCountAggregateOutputType | null
    _avg: User_securityAvgAggregateOutputType | null
    _sum: User_securitySumAggregateOutputType | null
    _min: User_securityMinAggregateOutputType | null
    _max: User_securityMaxAggregateOutputType | null
  }

  export type User_securityAvgAggregateOutputType = {
    failed_attempts: number | null
  }

  export type User_securitySumAggregateOutputType = {
    failed_attempts: number | null
  }

  export type User_securityMinAggregateOutputType = {
    user_id: string | null
    failed_attempts: number | null
    last_failed_login: Date | null
    otp_code: string | null
    otp_expires_at: Date | null
    updated_at: Date | null
  }

  export type User_securityMaxAggregateOutputType = {
    user_id: string | null
    failed_attempts: number | null
    last_failed_login: Date | null
    otp_code: string | null
    otp_expires_at: Date | null
    updated_at: Date | null
  }

  export type User_securityCountAggregateOutputType = {
    user_id: number
    failed_attempts: number
    last_failed_login: number
    otp_code: number
    otp_expires_at: number
    recovery_codes: number
    updated_at: number
    _all: number
  }


  export type User_securityAvgAggregateInputType = {
    failed_attempts?: true
  }

  export type User_securitySumAggregateInputType = {
    failed_attempts?: true
  }

  export type User_securityMinAggregateInputType = {
    user_id?: true
    failed_attempts?: true
    last_failed_login?: true
    otp_code?: true
    otp_expires_at?: true
    updated_at?: true
  }

  export type User_securityMaxAggregateInputType = {
    user_id?: true
    failed_attempts?: true
    last_failed_login?: true
    otp_code?: true
    otp_expires_at?: true
    updated_at?: true
  }

  export type User_securityCountAggregateInputType = {
    user_id?: true
    failed_attempts?: true
    last_failed_login?: true
    otp_code?: true
    otp_expires_at?: true
    recovery_codes?: true
    updated_at?: true
    _all?: true
  }

  export type User_securityAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_security to aggregate.
     */
    where?: user_securityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_securities to fetch.
     */
    orderBy?: Enumerable<user_securityOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_securityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_securities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_securities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_securities
    **/
    _count?: true | User_securityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_securityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_securitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_securityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_securityMaxAggregateInputType
  }

  export type GetUser_securityAggregateType<T extends User_securityAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_security]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_security[P]>
      : GetScalarType<T[P], AggregateUser_security[P]>
  }




  export type User_securityGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_securityWhereInput
    orderBy?: Enumerable<user_securityOrderByWithAggregationInput>
    by: User_securityScalarFieldEnum[]
    having?: user_securityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_securityCountAggregateInputType | true
    _avg?: User_securityAvgAggregateInputType
    _sum?: User_securitySumAggregateInputType
    _min?: User_securityMinAggregateInputType
    _max?: User_securityMaxAggregateInputType
  }


  export type User_securityGroupByOutputType = {
    user_id: string
    failed_attempts: number | null
    last_failed_login: Date | null
    otp_code: string | null
    otp_expires_at: Date | null
    recovery_codes: string[]
    updated_at: Date
    _count: User_securityCountAggregateOutputType | null
    _avg: User_securityAvgAggregateOutputType | null
    _sum: User_securitySumAggregateOutputType | null
    _min: User_securityMinAggregateOutputType | null
    _max: User_securityMaxAggregateOutputType | null
  }

  type GetUser_securityGroupByPayload<T extends User_securityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_securityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_securityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_securityGroupByOutputType[P]>
            : GetScalarType<T[P], User_securityGroupByOutputType[P]>
        }
      >
    >


  export type user_securitySelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    failed_attempts?: boolean
    last_failed_login?: boolean
    otp_code?: boolean
    otp_expires_at?: boolean
    recovery_codes?: boolean
    updated_at?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_security"]>

  export type user_securitySelectScalar = {
    user_id?: boolean
    failed_attempts?: boolean
    last_failed_login?: boolean
    otp_code?: boolean
    otp_expires_at?: boolean
    recovery_codes?: boolean
    updated_at?: boolean
  }

  export type user_securityInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_securityGetPayload<S extends boolean | null | undefined | user_securityArgs> = $Types.GetResult<user_securityPayload, S>

  type user_securityCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_securityFindManyArgs, 'select' | 'include'> & {
      select?: User_securityCountAggregateInputType | true
    }

  export interface user_securityDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_security'], meta: { name: 'user_security' } }
    /**
     * Find zero or one User_security that matches the filter.
     * @param {user_securityFindUniqueArgs} args - Arguments to find a User_security
     * @example
     * // Get one User_security
     * const user_security = await prisma.user_security.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_securityFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_securityFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_security'> extends True ? Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_security that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_securityFindUniqueOrThrowArgs} args - Arguments to find a User_security
     * @example
     * // Get one User_security
     * const user_security = await prisma.user_security.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_securityFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_securityFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_security that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_securityFindFirstArgs} args - Arguments to find a User_security
     * @example
     * // Get one User_security
     * const user_security = await prisma.user_security.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_securityFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_securityFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_security'> extends True ? Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_security that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_securityFindFirstOrThrowArgs} args - Arguments to find a User_security
     * @example
     * // Get one User_security
     * const user_security = await prisma.user_security.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_securityFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_securityFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_securities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_securityFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_securities
     * const user_securities = await prisma.user_security.findMany()
     * 
     * // Get first 10 User_securities
     * const user_securities = await prisma.user_security.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const user_securityWithUser_idOnly = await prisma.user_security.findMany({ select: { user_id: true } })
     * 
    **/
    findMany<T extends user_securityFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_securityFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_security.
     * @param {user_securityCreateArgs} args - Arguments to create a User_security.
     * @example
     * // Create one User_security
     * const User_security = await prisma.user_security.create({
     *   data: {
     *     // ... data to create a User_security
     *   }
     * })
     * 
    **/
    create<T extends user_securityCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_securityCreateArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_securities.
     *     @param {user_securityCreateManyArgs} args - Arguments to create many User_securities.
     *     @example
     *     // Create many User_securities
     *     const user_security = await prisma.user_security.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_securityCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_securityCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_security.
     * @param {user_securityDeleteArgs} args - Arguments to delete one User_security.
     * @example
     * // Delete one User_security
     * const User_security = await prisma.user_security.delete({
     *   where: {
     *     // ... filter to delete one User_security
     *   }
     * })
     * 
    **/
    delete<T extends user_securityDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_securityDeleteArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_security.
     * @param {user_securityUpdateArgs} args - Arguments to update one User_security.
     * @example
     * // Update one User_security
     * const user_security = await prisma.user_security.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_securityUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_securityUpdateArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_securities.
     * @param {user_securityDeleteManyArgs} args - Arguments to filter User_securities to delete.
     * @example
     * // Delete a few User_securities
     * const { count } = await prisma.user_security.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_securityDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_securityDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_securities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_securityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_securities
     * const user_security = await prisma.user_security.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_securityUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_securityUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_security.
     * @param {user_securityUpsertArgs} args - Arguments to update or create a User_security.
     * @example
     * // Update or create a User_security
     * const user_security = await prisma.user_security.upsert({
     *   create: {
     *     // ... data to create a User_security
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_security we want to update
     *   }
     * })
    **/
    upsert<T extends user_securityUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_securityUpsertArgs<ExtArgs>>
    ): Prisma__user_securityClient<$Types.GetResult<user_securityPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_securities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_securityCountArgs} args - Arguments to filter User_securities to count.
     * @example
     * // Count the number of User_securities
     * const count = await prisma.user_security.count({
     *   where: {
     *     // ... the filter for the User_securities we want to count
     *   }
     * })
    **/
    count<T extends user_securityCountArgs>(
      args?: Subset<T, user_securityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_securityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_security.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_securityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_securityAggregateArgs>(args: Subset<T, User_securityAggregateArgs>): Prisma.PrismaPromise<GetUser_securityAggregateType<T>>

    /**
     * Group by User_security.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_securityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_securityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_securityGroupByArgs['orderBy'] }
        : { orderBy?: User_securityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_securityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_securityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_security.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_securityClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_security base type for findUnique actions
   */
  export type user_securityFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter, which user_security to fetch.
     */
    where: user_securityWhereUniqueInput
  }

  /**
   * user_security findUnique
   */
  export interface user_securityFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_securityFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_security findUniqueOrThrow
   */
  export type user_securityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter, which user_security to fetch.
     */
    where: user_securityWhereUniqueInput
  }


  /**
   * user_security base type for findFirst actions
   */
  export type user_securityFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter, which user_security to fetch.
     */
    where?: user_securityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_securities to fetch.
     */
    orderBy?: Enumerable<user_securityOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_securities.
     */
    cursor?: user_securityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_securities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_securities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_securities.
     */
    distinct?: Enumerable<User_securityScalarFieldEnum>
  }

  /**
   * user_security findFirst
   */
  export interface user_securityFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_securityFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_security findFirstOrThrow
   */
  export type user_securityFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter, which user_security to fetch.
     */
    where?: user_securityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_securities to fetch.
     */
    orderBy?: Enumerable<user_securityOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_securities.
     */
    cursor?: user_securityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_securities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_securities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_securities.
     */
    distinct?: Enumerable<User_securityScalarFieldEnum>
  }


  /**
   * user_security findMany
   */
  export type user_securityFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter, which user_securities to fetch.
     */
    where?: user_securityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_securities to fetch.
     */
    orderBy?: Enumerable<user_securityOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_securities.
     */
    cursor?: user_securityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_securities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_securities.
     */
    skip?: number
    distinct?: Enumerable<User_securityScalarFieldEnum>
  }


  /**
   * user_security create
   */
  export type user_securityCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * The data needed to create a user_security.
     */
    data: XOR<user_securityCreateInput, user_securityUncheckedCreateInput>
  }


  /**
   * user_security createMany
   */
  export type user_securityCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_securities.
     */
    data: Enumerable<user_securityCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_security update
   */
  export type user_securityUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * The data needed to update a user_security.
     */
    data: XOR<user_securityUpdateInput, user_securityUncheckedUpdateInput>
    /**
     * Choose, which user_security to update.
     */
    where: user_securityWhereUniqueInput
  }


  /**
   * user_security updateMany
   */
  export type user_securityUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_securities.
     */
    data: XOR<user_securityUpdateManyMutationInput, user_securityUncheckedUpdateManyInput>
    /**
     * Filter which user_securities to update
     */
    where?: user_securityWhereInput
  }


  /**
   * user_security upsert
   */
  export type user_securityUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * The filter to search for the user_security to update in case it exists.
     */
    where: user_securityWhereUniqueInput
    /**
     * In case the user_security found by the `where` argument doesn't exist, create a new user_security with this data.
     */
    create: XOR<user_securityCreateInput, user_securityUncheckedCreateInput>
    /**
     * In case the user_security was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_securityUpdateInput, user_securityUncheckedUpdateInput>
  }


  /**
   * user_security delete
   */
  export type user_securityDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
    /**
     * Filter which user_security to delete.
     */
    where: user_securityWhereUniqueInput
  }


  /**
   * user_security deleteMany
   */
  export type user_securityDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_securities to delete
     */
    where?: user_securityWhereInput
  }


  /**
   * user_security without action
   */
  export type user_securityArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_security
     */
    select?: user_securitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_securityInclude<ExtArgs> | null
  }



  /**
   * Model user_sessions
   */


  export type AggregateUser_sessions = {
    _count: User_sessionsCountAggregateOutputType | null
    _min: User_sessionsMinAggregateOutputType | null
    _max: User_sessionsMaxAggregateOutputType | null
  }

  export type User_sessionsMinAggregateOutputType = {
    session_id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    is_revoked: boolean | null
    secret: string | null
  }

  export type User_sessionsMaxAggregateOutputType = {
    session_id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    is_revoked: boolean | null
    secret: string | null
  }

  export type User_sessionsCountAggregateOutputType = {
    session_id: number
    user_id: number
    token: number
    created_at: number
    is_revoked: number
    secret: number
    _all: number
  }


  export type User_sessionsMinAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    is_revoked?: true
    secret?: true
  }

  export type User_sessionsMaxAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    is_revoked?: true
    secret?: true
  }

  export type User_sessionsCountAggregateInputType = {
    session_id?: true
    user_id?: true
    token?: true
    created_at?: true
    is_revoked?: true
    secret?: true
    _all?: true
  }

  export type User_sessionsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_sessions to aggregate.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: Enumerable<user_sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_sessions
    **/
    _count?: true | User_sessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_sessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_sessionsMaxAggregateInputType
  }

  export type GetUser_sessionsAggregateType<T extends User_sessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_sessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_sessions[P]>
      : GetScalarType<T[P], AggregateUser_sessions[P]>
  }




  export type User_sessionsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: user_sessionsWhereInput
    orderBy?: Enumerable<user_sessionsOrderByWithAggregationInput>
    by: User_sessionsScalarFieldEnum[]
    having?: user_sessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_sessionsCountAggregateInputType | true
    _min?: User_sessionsMinAggregateInputType
    _max?: User_sessionsMaxAggregateInputType
  }


  export type User_sessionsGroupByOutputType = {
    session_id: string
    user_id: string
    token: string
    created_at: Date
    is_revoked: boolean | null
    secret: string | null
    _count: User_sessionsCountAggregateOutputType | null
    _min: User_sessionsMinAggregateOutputType | null
    _max: User_sessionsMaxAggregateOutputType | null
  }

  type GetUser_sessionsGroupByPayload<T extends User_sessionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<User_sessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_sessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_sessionsGroupByOutputType[P]>
            : GetScalarType<T[P], User_sessionsGroupByOutputType[P]>
        }
      >
    >


  export type user_sessionsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    is_revoked?: boolean
    secret?: boolean
    users?: boolean | usersArgs<ExtArgs>
  }, ExtArgs["result"]["user_sessions"]>

  export type user_sessionsSelectScalar = {
    session_id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    is_revoked?: boolean
    secret?: boolean
  }

  export type user_sessionsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    users?: boolean | usersArgs<ExtArgs>
  }


  type user_sessionsGetPayload<S extends boolean | null | undefined | user_sessionsArgs> = $Types.GetResult<user_sessionsPayload, S>

  type user_sessionsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<user_sessionsFindManyArgs, 'select' | 'include'> & {
      select?: User_sessionsCountAggregateInputType | true
    }

  export interface user_sessionsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_sessions'], meta: { name: 'user_sessions' } }
    /**
     * Find zero or one User_sessions that matches the filter.
     * @param {user_sessionsFindUniqueArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends user_sessionsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, user_sessionsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user_sessions'> extends True ? Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one User_sessions that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {user_sessionsFindUniqueOrThrowArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends user_sessionsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_sessionsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first User_sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindFirstArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends user_sessionsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, user_sessionsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user_sessions'> extends True ? Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first User_sessions that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindFirstOrThrowArgs} args - Arguments to find a User_sessions
     * @example
     * // Get one User_sessions
     * const user_sessions = await prisma.user_sessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends user_sessionsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, user_sessionsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more User_sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_sessions
     * const user_sessions = await prisma.user_sessions.findMany()
     * 
     * // Get first 10 User_sessions
     * const user_sessions = await prisma.user_sessions.findMany({ take: 10 })
     * 
     * // Only select the `session_id`
     * const user_sessionsWithSession_idOnly = await prisma.user_sessions.findMany({ select: { session_id: true } })
     * 
    **/
    findMany<T extends user_sessionsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_sessionsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a User_sessions.
     * @param {user_sessionsCreateArgs} args - Arguments to create a User_sessions.
     * @example
     * // Create one User_sessions
     * const User_sessions = await prisma.user_sessions.create({
     *   data: {
     *     // ... data to create a User_sessions
     *   }
     * })
     * 
    **/
    create<T extends user_sessionsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, user_sessionsCreateArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many User_sessions.
     *     @param {user_sessionsCreateManyArgs} args - Arguments to create many User_sessions.
     *     @example
     *     // Create many User_sessions
     *     const user_sessions = await prisma.user_sessions.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends user_sessionsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_sessionsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_sessions.
     * @param {user_sessionsDeleteArgs} args - Arguments to delete one User_sessions.
     * @example
     * // Delete one User_sessions
     * const User_sessions = await prisma.user_sessions.delete({
     *   where: {
     *     // ... filter to delete one User_sessions
     *   }
     * })
     * 
    **/
    delete<T extends user_sessionsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, user_sessionsDeleteArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one User_sessions.
     * @param {user_sessionsUpdateArgs} args - Arguments to update one User_sessions.
     * @example
     * // Update one User_sessions
     * const user_sessions = await prisma.user_sessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends user_sessionsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, user_sessionsUpdateArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more User_sessions.
     * @param {user_sessionsDeleteManyArgs} args - Arguments to filter User_sessions to delete.
     * @example
     * // Delete a few User_sessions
     * const { count } = await prisma.user_sessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends user_sessionsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, user_sessionsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_sessions
     * const user_sessions = await prisma.user_sessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends user_sessionsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, user_sessionsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_sessions.
     * @param {user_sessionsUpsertArgs} args - Arguments to update or create a User_sessions.
     * @example
     * // Update or create a User_sessions
     * const user_sessions = await prisma.user_sessions.upsert({
     *   create: {
     *     // ... data to create a User_sessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_sessions we want to update
     *   }
     * })
    **/
    upsert<T extends user_sessionsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, user_sessionsUpsertArgs<ExtArgs>>
    ): Prisma__user_sessionsClient<$Types.GetResult<user_sessionsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionsCountArgs} args - Arguments to filter User_sessions to count.
     * @example
     * // Count the number of User_sessions
     * const count = await prisma.user_sessions.count({
     *   where: {
     *     // ... the filter for the User_sessions we want to count
     *   }
     * })
    **/
    count<T extends user_sessionsCountArgs>(
      args?: Subset<T, user_sessionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_sessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_sessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_sessionsAggregateArgs>(args: Subset<T, User_sessionsAggregateArgs>): Prisma.PrismaPromise<GetUser_sessionsAggregateType<T>>

    /**
     * Group by User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_sessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends User_sessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: User_sessionsGroupByArgs['orderBy'] }
        : { orderBy?: User_sessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, User_sessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_sessionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for user_sessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__user_sessionsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    users<T extends usersArgs<ExtArgs> = {}>(args?: Subset<T, usersArgs<ExtArgs>>): Prisma__usersClient<$Types.GetResult<usersPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * user_sessions base type for findUnique actions
   */
  export type user_sessionsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where: user_sessionsWhereUniqueInput
  }

  /**
   * user_sessions findUnique
   */
  export interface user_sessionsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_sessionsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_sessions findUniqueOrThrow
   */
  export type user_sessionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where: user_sessionsWhereUniqueInput
  }


  /**
   * user_sessions base type for findFirst actions
   */
  export type user_sessionsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: Enumerable<user_sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: Enumerable<User_sessionsScalarFieldEnum>
  }

  /**
   * user_sessions findFirst
   */
  export interface user_sessionsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends user_sessionsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * user_sessions findFirstOrThrow
   */
  export type user_sessionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: Enumerable<user_sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: Enumerable<User_sessionsScalarFieldEnum>
  }


  /**
   * user_sessions findMany
   */
  export type user_sessionsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: Enumerable<user_sessionsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_sessions.
     */
    cursor?: user_sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    distinct?: Enumerable<User_sessionsScalarFieldEnum>
  }


  /**
   * user_sessions create
   */
  export type user_sessionsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The data needed to create a user_sessions.
     */
    data: XOR<user_sessionsCreateInput, user_sessionsUncheckedCreateInput>
  }


  /**
   * user_sessions createMany
   */
  export type user_sessionsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_sessions.
     */
    data: Enumerable<user_sessionsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * user_sessions update
   */
  export type user_sessionsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The data needed to update a user_sessions.
     */
    data: XOR<user_sessionsUpdateInput, user_sessionsUncheckedUpdateInput>
    /**
     * Choose, which user_sessions to update.
     */
    where: user_sessionsWhereUniqueInput
  }


  /**
   * user_sessions updateMany
   */
  export type user_sessionsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_sessions.
     */
    data: XOR<user_sessionsUpdateManyMutationInput, user_sessionsUncheckedUpdateManyInput>
    /**
     * Filter which user_sessions to update
     */
    where?: user_sessionsWhereInput
  }


  /**
   * user_sessions upsert
   */
  export type user_sessionsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * The filter to search for the user_sessions to update in case it exists.
     */
    where: user_sessionsWhereUniqueInput
    /**
     * In case the user_sessions found by the `where` argument doesn't exist, create a new user_sessions with this data.
     */
    create: XOR<user_sessionsCreateInput, user_sessionsUncheckedCreateInput>
    /**
     * In case the user_sessions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_sessionsUpdateInput, user_sessionsUncheckedUpdateInput>
  }


  /**
   * user_sessions delete
   */
  export type user_sessionsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
    /**
     * Filter which user_sessions to delete.
     */
    where: user_sessionsWhereUniqueInput
  }


  /**
   * user_sessions deleteMany
   */
  export type user_sessionsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_sessions to delete
     */
    where?: user_sessionsWhereInput
  }


  /**
   * user_sessions without action
   */
  export type user_sessionsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_sessions
     */
    select?: user_sessionsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: user_sessionsInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UsersScalarFieldEnum: {
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

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const User_aboutScalarFieldEnum: {
    about_id: 'about_id',
    user_id: 'user_id',
    about: 'about',
    goals: 'goals',
    skills: 'skills'
  };

  export type User_aboutScalarFieldEnum = (typeof User_aboutScalarFieldEnum)[keyof typeof User_aboutScalarFieldEnum]


  export const User_analyticsScalarFieldEnum: {
    user_id: 'user_id',
    posts_count: 'posts_count',
    likes_received: 'likes_received',
    followers_count: 'followers_count',
    following_count: 'following_count',
    last_login: 'last_login',
    activity_score: 'activity_score'
  };

  export type User_analyticsScalarFieldEnum = (typeof User_analyticsScalarFieldEnum)[keyof typeof User_analyticsScalarFieldEnum]


  export const User_audit_logsScalarFieldEnum: {
    audit_id: 'audit_id',
    user_id: 'user_id',
    action_type: 'action_type',
    details: 'details',
    performed_by: 'performed_by',
    event_time: 'event_time'
  };

  export type User_audit_logsScalarFieldEnum = (typeof User_audit_logsScalarFieldEnum)[keyof typeof User_audit_logsScalarFieldEnum]


  export const User_blocklistScalarFieldEnum: {
    block_id: 'block_id',
    user_id: 'user_id',
    reason: 'reason',
    blocked_at: 'blocked_at'
  };

  export type User_blocklistScalarFieldEnum = (typeof User_blocklistScalarFieldEnum)[keyof typeof User_blocklistScalarFieldEnum]


  export const User_certificatesScalarFieldEnum: {
    user_id: 'user_id',
    public_key: 'public_key',
    certificate: 'certificate',
    created_at: 'created_at'
  };

  export type User_certificatesScalarFieldEnum = (typeof User_certificatesScalarFieldEnum)[keyof typeof User_certificatesScalarFieldEnum]


  export const User_profileScalarFieldEnum: {
    user_id: 'user_id',
    username: 'username',
    display_name: 'display_name',
    bio: 'bio',
    avatar_url: 'avatar_url',
    website: 'website',
    social_links: 'social_links',
    updated_at: 'updated_at',
    dob: 'dob',
    country: 'country',
    banner_url: 'banner_url'
  };

  export type User_profileScalarFieldEnum = (typeof User_profileScalarFieldEnum)[keyof typeof User_profileScalarFieldEnum]


  export const User_securityScalarFieldEnum: {
    user_id: 'user_id',
    failed_attempts: 'failed_attempts',
    last_failed_login: 'last_failed_login',
    otp_code: 'otp_code',
    otp_expires_at: 'otp_expires_at',
    recovery_codes: 'recovery_codes',
    updated_at: 'updated_at'
  };

  export type User_securityScalarFieldEnum = (typeof User_securityScalarFieldEnum)[keyof typeof User_securityScalarFieldEnum]


  export const User_sessionsScalarFieldEnum: {
    session_id: 'session_id',
    user_id: 'user_id',
    token: 'token',
    created_at: 'created_at',
    is_revoked: 'is_revoked',
    secret: 'secret'
  };

  export type User_sessionsScalarFieldEnum = (typeof User_sessionsScalarFieldEnum)[keyof typeof User_sessionsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Deep Input Types
   */


  export type usersWhereInput = {
    AND?: Enumerable<usersWhereInput>
    OR?: Enumerable<usersWhereInput>
    NOT?: Enumerable<usersWhereInput>
    id?: UuidFilter | string
    email?: StringFilter | string
    phone?: StringNullableFilter | string | null
    password_hash?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    updated_at?: DateTimeFilter | Date | string
    is_verified?: BoolNullableFilter | boolean | null
    is_active?: BoolNullableFilter | boolean | null
    pass_salts?: StringNullableFilter | string | null
    user_type?: StringNullableFilter | string | null
    initial_balance?: FloatFilter | number
    user_about?: XOR<User_aboutRelationFilter, user_aboutWhereInput> | null
    user_analytics?: XOR<User_analyticsRelationFilter, user_analyticsWhereInput> | null
    user_audit_logs?: User_audit_logsListRelationFilter
    user_blocklist?: XOR<User_blocklistRelationFilter, user_blocklistWhereInput> | null
    user_certificates?: XOR<User_certificatesRelationFilter, user_certificatesWhereInput> | null
    user_profile?: XOR<User_profileRelationFilter, user_profileWhereInput> | null
    user_security?: XOR<User_securityRelationFilter, user_securityWhereInput> | null
    user_sessions?: User_sessionsListRelationFilter
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_verified?: SortOrderInput | SortOrder
    is_active?: SortOrderInput | SortOrder
    pass_salts?: SortOrderInput | SortOrder
    user_type?: SortOrderInput | SortOrder
    initial_balance?: SortOrder
    user_about?: user_aboutOrderByWithRelationInput
    user_analytics?: user_analyticsOrderByWithRelationInput
    user_audit_logs?: user_audit_logsOrderByRelationAggregateInput
    user_blocklist?: user_blocklistOrderByWithRelationInput
    user_certificates?: user_certificatesOrderByWithRelationInput
    user_profile?: user_profileOrderByWithRelationInput
    user_security?: user_securityOrderByWithRelationInput
    user_sessions?: user_sessionsOrderByRelationAggregateInput
  }

  export type usersWhereUniqueInput = {
    id?: string
    email?: string
    phone?: string
  }

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_verified?: SortOrderInput | SortOrder
    is_active?: SortOrderInput | SortOrder
    pass_salts?: SortOrderInput | SortOrder
    user_type?: SortOrderInput | SortOrder
    initial_balance?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _avg?: usersAvgOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
    _sum?: usersSumOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: Enumerable<usersScalarWhereWithAggregatesInput>
    OR?: Enumerable<usersScalarWhereWithAggregatesInput>
    NOT?: Enumerable<usersScalarWhereWithAggregatesInput>
    id?: UuidWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    phone?: StringNullableWithAggregatesFilter | string | null
    password_hash?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
    updated_at?: DateTimeWithAggregatesFilter | Date | string
    is_verified?: BoolNullableWithAggregatesFilter | boolean | null
    is_active?: BoolNullableWithAggregatesFilter | boolean | null
    pass_salts?: StringNullableWithAggregatesFilter | string | null
    user_type?: StringNullableWithAggregatesFilter | string | null
    initial_balance?: FloatWithAggregatesFilter | number
  }

  export type user_aboutWhereInput = {
    AND?: Enumerable<user_aboutWhereInput>
    OR?: Enumerable<user_aboutWhereInput>
    NOT?: Enumerable<user_aboutWhereInput>
    about_id?: UuidFilter | string
    user_id?: UuidFilter | string
    about?: StringNullableFilter | string | null
    goals?: StringNullableFilter | string | null
    skills?: StringNullableListFilter
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_aboutOrderByWithRelationInput = {
    about_id?: SortOrder
    user_id?: SortOrder
    about?: SortOrderInput | SortOrder
    goals?: SortOrderInput | SortOrder
    skills?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_aboutWhereUniqueInput = {
    about_id?: string
    user_id?: string
  }

  export type user_aboutOrderByWithAggregationInput = {
    about_id?: SortOrder
    user_id?: SortOrder
    about?: SortOrderInput | SortOrder
    goals?: SortOrderInput | SortOrder
    skills?: SortOrder
    _count?: user_aboutCountOrderByAggregateInput
    _max?: user_aboutMaxOrderByAggregateInput
    _min?: user_aboutMinOrderByAggregateInput
  }

  export type user_aboutScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_aboutScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_aboutScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_aboutScalarWhereWithAggregatesInput>
    about_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    about?: StringNullableWithAggregatesFilter | string | null
    goals?: StringNullableWithAggregatesFilter | string | null
    skills?: StringNullableListFilter
  }

  export type user_analyticsWhereInput = {
    AND?: Enumerable<user_analyticsWhereInput>
    OR?: Enumerable<user_analyticsWhereInput>
    NOT?: Enumerable<user_analyticsWhereInput>
    user_id?: UuidFilter | string
    posts_count?: IntNullableFilter | number | null
    likes_received?: IntNullableFilter | number | null
    followers_count?: IntNullableFilter | number | null
    following_count?: IntNullableFilter | number | null
    last_login?: DateTimeNullableFilter | Date | string | null
    activity_score?: DecimalNullableFilter | Decimal | DecimalJsLike | number | string | null
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_analyticsOrderByWithRelationInput = {
    user_id?: SortOrder
    posts_count?: SortOrderInput | SortOrder
    likes_received?: SortOrderInput | SortOrder
    followers_count?: SortOrderInput | SortOrder
    following_count?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    activity_score?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_analyticsWhereUniqueInput = {
    user_id?: string
  }

  export type user_analyticsOrderByWithAggregationInput = {
    user_id?: SortOrder
    posts_count?: SortOrderInput | SortOrder
    likes_received?: SortOrderInput | SortOrder
    followers_count?: SortOrderInput | SortOrder
    following_count?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    activity_score?: SortOrderInput | SortOrder
    _count?: user_analyticsCountOrderByAggregateInput
    _avg?: user_analyticsAvgOrderByAggregateInput
    _max?: user_analyticsMaxOrderByAggregateInput
    _min?: user_analyticsMinOrderByAggregateInput
    _sum?: user_analyticsSumOrderByAggregateInput
  }

  export type user_analyticsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_analyticsScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_analyticsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_analyticsScalarWhereWithAggregatesInput>
    user_id?: UuidWithAggregatesFilter | string
    posts_count?: IntNullableWithAggregatesFilter | number | null
    likes_received?: IntNullableWithAggregatesFilter | number | null
    followers_count?: IntNullableWithAggregatesFilter | number | null
    following_count?: IntNullableWithAggregatesFilter | number | null
    last_login?: DateTimeNullableWithAggregatesFilter | Date | string | null
    activity_score?: DecimalNullableWithAggregatesFilter | Decimal | DecimalJsLike | number | string | null
  }

  export type user_audit_logsWhereInput = {
    AND?: Enumerable<user_audit_logsWhereInput>
    OR?: Enumerable<user_audit_logsWhereInput>
    NOT?: Enumerable<user_audit_logsWhereInput>
    audit_id?: UuidFilter | string
    user_id?: UuidNullableFilter | string | null
    action_type?: StringFilter | string
    details?: JsonNullableFilter
    performed_by?: UuidNullableFilter | string | null
    event_time?: DateTimeFilter | Date | string
    users?: XOR<UsersRelationFilter, usersWhereInput> | null
  }

  export type user_audit_logsOrderByWithRelationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    action_type?: SortOrder
    details?: SortOrderInput | SortOrder
    performed_by?: SortOrderInput | SortOrder
    event_time?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_audit_logsWhereUniqueInput = {
    audit_id?: string
  }

  export type user_audit_logsOrderByWithAggregationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    action_type?: SortOrder
    details?: SortOrderInput | SortOrder
    performed_by?: SortOrderInput | SortOrder
    event_time?: SortOrder
    _count?: user_audit_logsCountOrderByAggregateInput
    _max?: user_audit_logsMaxOrderByAggregateInput
    _min?: user_audit_logsMinOrderByAggregateInput
  }

  export type user_audit_logsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_audit_logsScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_audit_logsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_audit_logsScalarWhereWithAggregatesInput>
    audit_id?: UuidWithAggregatesFilter | string
    user_id?: UuidNullableWithAggregatesFilter | string | null
    action_type?: StringWithAggregatesFilter | string
    details?: JsonNullableWithAggregatesFilter
    performed_by?: UuidNullableWithAggregatesFilter | string | null
    event_time?: DateTimeWithAggregatesFilter | Date | string
  }

  export type user_blocklistWhereInput = {
    AND?: Enumerable<user_blocklistWhereInput>
    OR?: Enumerable<user_blocklistWhereInput>
    NOT?: Enumerable<user_blocklistWhereInput>
    block_id?: UuidFilter | string
    user_id?: UuidNullableFilter | string | null
    reason?: StringFilter | string
    blocked_at?: DateTimeFilter | Date | string
    users?: XOR<UsersRelationFilter, usersWhereInput> | null
  }

  export type user_blocklistOrderByWithRelationInput = {
    block_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    reason?: SortOrder
    blocked_at?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_blocklistWhereUniqueInput = {
    block_id?: string
    user_id?: string
  }

  export type user_blocklistOrderByWithAggregationInput = {
    block_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    reason?: SortOrder
    blocked_at?: SortOrder
    _count?: user_blocklistCountOrderByAggregateInput
    _max?: user_blocklistMaxOrderByAggregateInput
    _min?: user_blocklistMinOrderByAggregateInput
  }

  export type user_blocklistScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_blocklistScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_blocklistScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_blocklistScalarWhereWithAggregatesInput>
    block_id?: UuidWithAggregatesFilter | string
    user_id?: UuidNullableWithAggregatesFilter | string | null
    reason?: StringWithAggregatesFilter | string
    blocked_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type user_certificatesWhereInput = {
    AND?: Enumerable<user_certificatesWhereInput>
    OR?: Enumerable<user_certificatesWhereInput>
    NOT?: Enumerable<user_certificatesWhereInput>
    user_id?: UuidFilter | string
    public_key?: StringFilter | string
    certificate?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_certificatesOrderByWithRelationInput = {
    user_id?: SortOrder
    public_key?: SortOrder
    certificate?: SortOrderInput | SortOrder
    created_at?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_certificatesWhereUniqueInput = {
    user_id?: string
  }

  export type user_certificatesOrderByWithAggregationInput = {
    user_id?: SortOrder
    public_key?: SortOrder
    certificate?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: user_certificatesCountOrderByAggregateInput
    _max?: user_certificatesMaxOrderByAggregateInput
    _min?: user_certificatesMinOrderByAggregateInput
  }

  export type user_certificatesScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_certificatesScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_certificatesScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_certificatesScalarWhereWithAggregatesInput>
    user_id?: UuidWithAggregatesFilter | string
    public_key?: StringWithAggregatesFilter | string
    certificate?: StringNullableWithAggregatesFilter | string | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type user_profileWhereInput = {
    AND?: Enumerable<user_profileWhereInput>
    OR?: Enumerable<user_profileWhereInput>
    NOT?: Enumerable<user_profileWhereInput>
    user_id?: UuidFilter | string
    username?: StringFilter | string
    display_name?: StringNullableFilter | string | null
    bio?: StringNullableFilter | string | null
    avatar_url?: StringNullableFilter | string | null
    website?: StringNullableFilter | string | null
    social_links?: JsonNullableFilter
    updated_at?: DateTimeFilter | Date | string
    dob?: DateTimeNullableFilter | Date | string | null
    country?: StringNullableFilter | string | null
    banner_url?: StringNullableFilter | string | null
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_profileOrderByWithRelationInput = {
    user_id?: SortOrder
    username?: SortOrder
    display_name?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    social_links?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    dob?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    banner_url?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_profileWhereUniqueInput = {
    user_id?: string
    username?: string
  }

  export type user_profileOrderByWithAggregationInput = {
    user_id?: SortOrder
    username?: SortOrder
    display_name?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    social_links?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    dob?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    banner_url?: SortOrderInput | SortOrder
    _count?: user_profileCountOrderByAggregateInput
    _max?: user_profileMaxOrderByAggregateInput
    _min?: user_profileMinOrderByAggregateInput
  }

  export type user_profileScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_profileScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_profileScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_profileScalarWhereWithAggregatesInput>
    user_id?: UuidWithAggregatesFilter | string
    username?: StringWithAggregatesFilter | string
    display_name?: StringNullableWithAggregatesFilter | string | null
    bio?: StringNullableWithAggregatesFilter | string | null
    avatar_url?: StringNullableWithAggregatesFilter | string | null
    website?: StringNullableWithAggregatesFilter | string | null
    social_links?: JsonNullableWithAggregatesFilter
    updated_at?: DateTimeWithAggregatesFilter | Date | string
    dob?: DateTimeNullableWithAggregatesFilter | Date | string | null
    country?: StringNullableWithAggregatesFilter | string | null
    banner_url?: StringNullableWithAggregatesFilter | string | null
  }

  export type user_securityWhereInput = {
    AND?: Enumerable<user_securityWhereInput>
    OR?: Enumerable<user_securityWhereInput>
    NOT?: Enumerable<user_securityWhereInput>
    user_id?: UuidFilter | string
    failed_attempts?: IntNullableFilter | number | null
    last_failed_login?: DateTimeNullableFilter | Date | string | null
    otp_code?: StringNullableFilter | string | null
    otp_expires_at?: DateTimeNullableFilter | Date | string | null
    recovery_codes?: StringNullableListFilter
    updated_at?: DateTimeFilter | Date | string
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_securityOrderByWithRelationInput = {
    user_id?: SortOrder
    failed_attempts?: SortOrderInput | SortOrder
    last_failed_login?: SortOrderInput | SortOrder
    otp_code?: SortOrderInput | SortOrder
    otp_expires_at?: SortOrderInput | SortOrder
    recovery_codes?: SortOrder
    updated_at?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_securityWhereUniqueInput = {
    user_id?: string
  }

  export type user_securityOrderByWithAggregationInput = {
    user_id?: SortOrder
    failed_attempts?: SortOrderInput | SortOrder
    last_failed_login?: SortOrderInput | SortOrder
    otp_code?: SortOrderInput | SortOrder
    otp_expires_at?: SortOrderInput | SortOrder
    recovery_codes?: SortOrder
    updated_at?: SortOrder
    _count?: user_securityCountOrderByAggregateInput
    _avg?: user_securityAvgOrderByAggregateInput
    _max?: user_securityMaxOrderByAggregateInput
    _min?: user_securityMinOrderByAggregateInput
    _sum?: user_securitySumOrderByAggregateInput
  }

  export type user_securityScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_securityScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_securityScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_securityScalarWhereWithAggregatesInput>
    user_id?: UuidWithAggregatesFilter | string
    failed_attempts?: IntNullableWithAggregatesFilter | number | null
    last_failed_login?: DateTimeNullableWithAggregatesFilter | Date | string | null
    otp_code?: StringNullableWithAggregatesFilter | string | null
    otp_expires_at?: DateTimeNullableWithAggregatesFilter | Date | string | null
    recovery_codes?: StringNullableListFilter
    updated_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type user_sessionsWhereInput = {
    AND?: Enumerable<user_sessionsWhereInput>
    OR?: Enumerable<user_sessionsWhereInput>
    NOT?: Enumerable<user_sessionsWhereInput>
    session_id?: UuidFilter | string
    user_id?: UuidFilter | string
    token?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    is_revoked?: BoolNullableFilter | boolean | null
    secret?: StringNullableFilter | string | null
    users?: XOR<UsersRelationFilter, usersWhereInput>
  }

  export type user_sessionsOrderByWithRelationInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    is_revoked?: SortOrderInput | SortOrder
    secret?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type user_sessionsWhereUniqueInput = {
    session_id?: string
  }

  export type user_sessionsOrderByWithAggregationInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    is_revoked?: SortOrderInput | SortOrder
    secret?: SortOrderInput | SortOrder
    _count?: user_sessionsCountOrderByAggregateInput
    _max?: user_sessionsMaxOrderByAggregateInput
    _min?: user_sessionsMinOrderByAggregateInput
  }

  export type user_sessionsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<user_sessionsScalarWhereWithAggregatesInput>
    OR?: Enumerable<user_sessionsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<user_sessionsScalarWhereWithAggregatesInput>
    session_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    token?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
    is_revoked?: BoolNullableWithAggregatesFilter | boolean | null
    secret?: StringNullableWithAggregatesFilter | string | null
  }

  export type usersCreateInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
  }

  export type user_aboutCreateInput = {
    about_id?: string
    about?: string | null
    goals?: string | null
    skills?: user_aboutCreateskillsInput | Enumerable<string>
    users: usersCreateNestedOneWithoutUser_aboutInput
  }

  export type user_aboutUncheckedCreateInput = {
    about_id?: string
    user_id: string
    about?: string | null
    goals?: string | null
    skills?: user_aboutCreateskillsInput | Enumerable<string>
  }

  export type user_aboutUpdateInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
    users?: usersUpdateOneRequiredWithoutUser_aboutNestedInput
  }

  export type user_aboutUncheckedUpdateInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
  }

  export type user_aboutCreateManyInput = {
    about_id?: string
    user_id: string
    about?: string | null
    goals?: string | null
    skills?: user_aboutCreateskillsInput | Enumerable<string>
  }

  export type user_aboutUpdateManyMutationInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
  }

  export type user_aboutUncheckedUpdateManyInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
  }

  export type user_analyticsCreateInput = {
    posts_count?: number | null
    likes_received?: number | null
    followers_count?: number | null
    following_count?: number | null
    last_login?: Date | string | null
    activity_score?: Decimal | DecimalJsLike | number | string | null
    users: usersCreateNestedOneWithoutUser_analyticsInput
  }

  export type user_analyticsUncheckedCreateInput = {
    user_id: string
    posts_count?: number | null
    likes_received?: number | null
    followers_count?: number | null
    following_count?: number | null
    last_login?: Date | string | null
    activity_score?: Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsUpdateInput = {
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    users?: usersUpdateOneRequiredWithoutUser_analyticsNestedInput
  }

  export type user_analyticsUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsCreateManyInput = {
    user_id: string
    posts_count?: number | null
    likes_received?: number | null
    followers_count?: number | null
    following_count?: number | null
    last_login?: Date | string | null
    activity_score?: Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsUpdateManyMutationInput = {
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type user_audit_logsCreateInput = {
    audit_id?: string
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
    users?: usersCreateNestedOneWithoutUser_audit_logsInput
  }

  export type user_audit_logsUncheckedCreateInput = {
    audit_id?: string
    user_id?: string | null
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type user_audit_logsUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneWithoutUser_audit_logsNestedInput
  }

  export type user_audit_logsUncheckedUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_audit_logsCreateManyInput = {
    audit_id?: string
    user_id?: string | null
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type user_audit_logsUpdateManyMutationInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_audit_logsUncheckedUpdateManyInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_blocklistCreateInput = {
    block_id?: string
    reason: string
    blocked_at?: Date | string
    users?: usersCreateNestedOneWithoutUser_blocklistInput
  }

  export type user_blocklistUncheckedCreateInput = {
    block_id?: string
    user_id?: string | null
    reason: string
    blocked_at?: Date | string
  }

  export type user_blocklistUpdateInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneWithoutUser_blocklistNestedInput
  }

  export type user_blocklistUncheckedUpdateInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_blocklistCreateManyInput = {
    block_id?: string
    user_id?: string | null
    reason: string
    blocked_at?: Date | string
  }

  export type user_blocklistUpdateManyMutationInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_blocklistUncheckedUpdateManyInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_certificatesCreateInput = {
    public_key: string
    certificate?: string | null
    created_at?: Date | string
    users: usersCreateNestedOneWithoutUser_certificatesInput
  }

  export type user_certificatesUncheckedCreateInput = {
    user_id: string
    public_key: string
    certificate?: string | null
    created_at?: Date | string
  }

  export type user_certificatesUpdateInput = {
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneRequiredWithoutUser_certificatesNestedInput
  }

  export type user_certificatesUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_certificatesCreateManyInput = {
    user_id: string
    public_key: string
    certificate?: string | null
    created_at?: Date | string
  }

  export type user_certificatesUpdateManyMutationInput = {
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_certificatesUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_profileCreateInput = {
    username: string
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    website?: string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    dob?: Date | string | null
    country?: string | null
    banner_url?: string | null
    users: usersCreateNestedOneWithoutUser_profileInput
  }

  export type user_profileUncheckedCreateInput = {
    user_id: string
    username: string
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    website?: string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    dob?: Date | string | null
    country?: string | null
    banner_url?: string | null
  }

  export type user_profileUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUpdateOneRequiredWithoutUser_profileNestedInput
  }

  export type user_profileUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_profileCreateManyInput = {
    user_id: string
    username: string
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    website?: string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    dob?: Date | string | null
    country?: string | null
    banner_url?: string | null
  }

  export type user_profileUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_profileUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_securityCreateInput = {
    failed_attempts?: number | null
    last_failed_login?: Date | string | null
    otp_code?: string | null
    otp_expires_at?: Date | string | null
    recovery_codes?: user_securityCreaterecovery_codesInput | Enumerable<string>
    updated_at?: Date | string
    users: usersCreateNestedOneWithoutUser_securityInput
  }

  export type user_securityUncheckedCreateInput = {
    user_id: string
    failed_attempts?: number | null
    last_failed_login?: Date | string | null
    otp_code?: string | null
    otp_expires_at?: Date | string | null
    recovery_codes?: user_securityCreaterecovery_codesInput | Enumerable<string>
    updated_at?: Date | string
  }

  export type user_securityUpdateInput = {
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneRequiredWithoutUser_securityNestedInput
  }

  export type user_securityUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_securityCreateManyInput = {
    user_id: string
    failed_attempts?: number | null
    last_failed_login?: Date | string | null
    otp_code?: string | null
    otp_expires_at?: Date | string | null
    recovery_codes?: user_securityCreaterecovery_codesInput | Enumerable<string>
    updated_at?: Date | string
  }

  export type user_securityUpdateManyMutationInput = {
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_securityUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsCreateInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
    users: usersCreateNestedOneWithoutUser_sessionsInput
  }

  export type user_sessionsUncheckedCreateInput = {
    session_id?: string
    user_id: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
  }

  export type user_sessionsUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUpdateOneRequiredWithoutUser_sessionsNestedInput
  }

  export type user_sessionsUncheckedUpdateInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_sessionsCreateManyInput = {
    session_id?: string
    user_id: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
  }

  export type user_sessionsUpdateManyMutationInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_sessionsUncheckedUpdateManyInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UuidFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidFilter | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type BoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type User_aboutRelationFilter = {
    is?: user_aboutWhereInput | null
    isNot?: user_aboutWhereInput | null
  }

  export type User_analyticsRelationFilter = {
    is?: user_analyticsWhereInput | null
    isNot?: user_analyticsWhereInput | null
  }

  export type User_audit_logsListRelationFilter = {
    every?: user_audit_logsWhereInput
    some?: user_audit_logsWhereInput
    none?: user_audit_logsWhereInput
  }

  export type User_blocklistRelationFilter = {
    is?: user_blocklistWhereInput | null
    isNot?: user_blocklistWhereInput | null
  }

  export type User_certificatesRelationFilter = {
    is?: user_certificatesWhereInput | null
    isNot?: user_certificatesWhereInput | null
  }

  export type User_profileRelationFilter = {
    is?: user_profileWhereInput | null
    isNot?: user_profileWhereInput | null
  }

  export type User_securityRelationFilter = {
    is?: user_securityWhereInput | null
    isNot?: user_securityWhereInput | null
  }

  export type User_sessionsListRelationFilter = {
    every?: user_sessionsWhereInput
    some?: user_sessionsWhereInput
    none?: user_sessionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type user_audit_logsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type user_sessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_verified?: SortOrder
    is_active?: SortOrder
    pass_salts?: SortOrder
    user_type?: SortOrder
    initial_balance?: SortOrder
  }

  export type usersAvgOrderByAggregateInput = {
    initial_balance?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_verified?: SortOrder
    is_active?: SortOrder
    pass_salts?: SortOrder
    user_type?: SortOrder
    initial_balance?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_verified?: SortOrder
    is_active?: SortOrder
    pass_salts?: SortOrder
    user_type?: SortOrder
    initial_balance?: SortOrder
  }

  export type usersSumOrderByAggregateInput = {
    initial_balance?: SortOrder
  }

  export type UuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type BoolNullableWithAggregatesFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableWithAggregatesFilter | boolean | null
    _count?: NestedIntNullableFilter
    _min?: NestedBoolNullableFilter
    _max?: NestedBoolNullableFilter
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type UsersRelationFilter = {
    is?: usersWhereInput | null
    isNot?: usersWhereInput | null
  }

  export type user_aboutCountOrderByAggregateInput = {
    about_id?: SortOrder
    user_id?: SortOrder
    about?: SortOrder
    goals?: SortOrder
    skills?: SortOrder
  }

  export type user_aboutMaxOrderByAggregateInput = {
    about_id?: SortOrder
    user_id?: SortOrder
    about?: SortOrder
    goals?: SortOrder
  }

  export type user_aboutMinOrderByAggregateInput = {
    about_id?: SortOrder
    user_id?: SortOrder
    about?: SortOrder
    goals?: SortOrder
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type DecimalNullableFilter = {
    equals?: Decimal | DecimalJsLike | number | string | null
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalNullableFilter | Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsCountOrderByAggregateInput = {
    user_id?: SortOrder
    posts_count?: SortOrder
    likes_received?: SortOrder
    followers_count?: SortOrder
    following_count?: SortOrder
    last_login?: SortOrder
    activity_score?: SortOrder
  }

  export type user_analyticsAvgOrderByAggregateInput = {
    posts_count?: SortOrder
    likes_received?: SortOrder
    followers_count?: SortOrder
    following_count?: SortOrder
    activity_score?: SortOrder
  }

  export type user_analyticsMaxOrderByAggregateInput = {
    user_id?: SortOrder
    posts_count?: SortOrder
    likes_received?: SortOrder
    followers_count?: SortOrder
    following_count?: SortOrder
    last_login?: SortOrder
    activity_score?: SortOrder
  }

  export type user_analyticsMinOrderByAggregateInput = {
    user_id?: SortOrder
    posts_count?: SortOrder
    likes_received?: SortOrder
    followers_count?: SortOrder
    following_count?: SortOrder
    last_login?: SortOrder
    activity_score?: SortOrder
  }

  export type user_analyticsSumOrderByAggregateInput = {
    posts_count?: SortOrder
    likes_received?: SortOrder
    followers_count?: SortOrder
    following_count?: SortOrder
    activity_score?: SortOrder
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type DecimalNullableWithAggregatesFilter = {
    equals?: Decimal | DecimalJsLike | number | string | null
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalNullableWithAggregatesFilter | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter
    _avg?: NestedDecimalNullableFilter
    _sum?: NestedDecimalNullableFilter
    _min?: NestedDecimalNullableFilter
    _max?: NestedDecimalNullableFilter
  }

  export type UuidNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidNullableFilter | string | null
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type user_audit_logsCountOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    details?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
  }

  export type user_audit_logsMaxOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
  }

  export type user_audit_logsMinOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type user_blocklistCountOrderByAggregateInput = {
    block_id?: SortOrder
    user_id?: SortOrder
    reason?: SortOrder
    blocked_at?: SortOrder
  }

  export type user_blocklistMaxOrderByAggregateInput = {
    block_id?: SortOrder
    user_id?: SortOrder
    reason?: SortOrder
    blocked_at?: SortOrder
  }

  export type user_blocklistMinOrderByAggregateInput = {
    block_id?: SortOrder
    user_id?: SortOrder
    reason?: SortOrder
    blocked_at?: SortOrder
  }

  export type user_certificatesCountOrderByAggregateInput = {
    user_id?: SortOrder
    public_key?: SortOrder
    certificate?: SortOrder
    created_at?: SortOrder
  }

  export type user_certificatesMaxOrderByAggregateInput = {
    user_id?: SortOrder
    public_key?: SortOrder
    certificate?: SortOrder
    created_at?: SortOrder
  }

  export type user_certificatesMinOrderByAggregateInput = {
    user_id?: SortOrder
    public_key?: SortOrder
    certificate?: SortOrder
    created_at?: SortOrder
  }

  export type user_profileCountOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    display_name?: SortOrder
    bio?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    social_links?: SortOrder
    updated_at?: SortOrder
    dob?: SortOrder
    country?: SortOrder
    banner_url?: SortOrder
  }

  export type user_profileMaxOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    display_name?: SortOrder
    bio?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    updated_at?: SortOrder
    dob?: SortOrder
    country?: SortOrder
    banner_url?: SortOrder
  }

  export type user_profileMinOrderByAggregateInput = {
    user_id?: SortOrder
    username?: SortOrder
    display_name?: SortOrder
    bio?: SortOrder
    avatar_url?: SortOrder
    website?: SortOrder
    updated_at?: SortOrder
    dob?: SortOrder
    country?: SortOrder
    banner_url?: SortOrder
  }

  export type user_securityCountOrderByAggregateInput = {
    user_id?: SortOrder
    failed_attempts?: SortOrder
    last_failed_login?: SortOrder
    otp_code?: SortOrder
    otp_expires_at?: SortOrder
    recovery_codes?: SortOrder
    updated_at?: SortOrder
  }

  export type user_securityAvgOrderByAggregateInput = {
    failed_attempts?: SortOrder
  }

  export type user_securityMaxOrderByAggregateInput = {
    user_id?: SortOrder
    failed_attempts?: SortOrder
    last_failed_login?: SortOrder
    otp_code?: SortOrder
    otp_expires_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_securityMinOrderByAggregateInput = {
    user_id?: SortOrder
    failed_attempts?: SortOrder
    last_failed_login?: SortOrder
    otp_code?: SortOrder
    otp_expires_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_securitySumOrderByAggregateInput = {
    failed_attempts?: SortOrder
  }

  export type user_sessionsCountOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    is_revoked?: SortOrder
    secret?: SortOrder
  }

  export type user_sessionsMaxOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    is_revoked?: SortOrder
    secret?: SortOrder
  }

  export type user_sessionsMinOrderByAggregateInput = {
    session_id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    is_revoked?: SortOrder
    secret?: SortOrder
  }

  export type user_aboutCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_aboutCreateOrConnectWithoutUsersInput
    connect?: user_aboutWhereUniqueInput
  }

  export type user_analyticsCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_analyticsCreateOrConnectWithoutUsersInput
    connect?: user_analyticsWhereUniqueInput
  }

  export type user_audit_logsCreateNestedManyWithoutUsersInput = {
    create?: XOR<Enumerable<user_audit_logsCreateWithoutUsersInput>, Enumerable<user_audit_logsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_audit_logsCreateOrConnectWithoutUsersInput>
    createMany?: user_audit_logsCreateManyUsersInputEnvelope
    connect?: Enumerable<user_audit_logsWhereUniqueInput>
  }

  export type user_blocklistCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_blocklistCreateOrConnectWithoutUsersInput
    connect?: user_blocklistWhereUniqueInput
  }

  export type user_certificatesCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_certificatesCreateOrConnectWithoutUsersInput
    connect?: user_certificatesWhereUniqueInput
  }

  export type user_profileCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_profileCreateOrConnectWithoutUsersInput
    connect?: user_profileWhereUniqueInput
  }

  export type user_securityCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_securityCreateOrConnectWithoutUsersInput
    connect?: user_securityWhereUniqueInput
  }

  export type user_sessionsCreateNestedManyWithoutUsersInput = {
    create?: XOR<Enumerable<user_sessionsCreateWithoutUsersInput>, Enumerable<user_sessionsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_sessionsCreateOrConnectWithoutUsersInput>
    createMany?: user_sessionsCreateManyUsersInputEnvelope
    connect?: Enumerable<user_sessionsWhereUniqueInput>
  }

  export type user_aboutUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_aboutCreateOrConnectWithoutUsersInput
    connect?: user_aboutWhereUniqueInput
  }

  export type user_analyticsUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_analyticsCreateOrConnectWithoutUsersInput
    connect?: user_analyticsWhereUniqueInput
  }

  export type user_audit_logsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<Enumerable<user_audit_logsCreateWithoutUsersInput>, Enumerable<user_audit_logsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_audit_logsCreateOrConnectWithoutUsersInput>
    createMany?: user_audit_logsCreateManyUsersInputEnvelope
    connect?: Enumerable<user_audit_logsWhereUniqueInput>
  }

  export type user_blocklistUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_blocklistCreateOrConnectWithoutUsersInput
    connect?: user_blocklistWhereUniqueInput
  }

  export type user_certificatesUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_certificatesCreateOrConnectWithoutUsersInput
    connect?: user_certificatesWhereUniqueInput
  }

  export type user_profileUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_profileCreateOrConnectWithoutUsersInput
    connect?: user_profileWhereUniqueInput
  }

  export type user_securityUncheckedCreateNestedOneWithoutUsersInput = {
    create?: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_securityCreateOrConnectWithoutUsersInput
    connect?: user_securityWhereUniqueInput
  }

  export type user_sessionsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<Enumerable<user_sessionsCreateWithoutUsersInput>, Enumerable<user_sessionsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_sessionsCreateOrConnectWithoutUsersInput>
    createMany?: user_sessionsCreateManyUsersInputEnvelope
    connect?: Enumerable<user_sessionsWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type user_aboutUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_aboutCreateOrConnectWithoutUsersInput
    upsert?: user_aboutUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_aboutWhereUniqueInput
    update?: XOR<user_aboutUpdateWithoutUsersInput, user_aboutUncheckedUpdateWithoutUsersInput>
  }

  export type user_analyticsUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_analyticsCreateOrConnectWithoutUsersInput
    upsert?: user_analyticsUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_analyticsWhereUniqueInput
    update?: XOR<user_analyticsUpdateWithoutUsersInput, user_analyticsUncheckedUpdateWithoutUsersInput>
  }

  export type user_audit_logsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<Enumerable<user_audit_logsCreateWithoutUsersInput>, Enumerable<user_audit_logsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_audit_logsCreateOrConnectWithoutUsersInput>
    upsert?: Enumerable<user_audit_logsUpsertWithWhereUniqueWithoutUsersInput>
    createMany?: user_audit_logsCreateManyUsersInputEnvelope
    set?: Enumerable<user_audit_logsWhereUniqueInput>
    disconnect?: Enumerable<user_audit_logsWhereUniqueInput>
    delete?: Enumerable<user_audit_logsWhereUniqueInput>
    connect?: Enumerable<user_audit_logsWhereUniqueInput>
    update?: Enumerable<user_audit_logsUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<user_audit_logsUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<user_audit_logsScalarWhereInput>
  }

  export type user_blocklistUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_blocklistCreateOrConnectWithoutUsersInput
    upsert?: user_blocklistUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_blocklistWhereUniqueInput
    update?: XOR<user_blocklistUpdateWithoutUsersInput, user_blocklistUncheckedUpdateWithoutUsersInput>
  }

  export type user_certificatesUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_certificatesCreateOrConnectWithoutUsersInput
    upsert?: user_certificatesUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_certificatesWhereUniqueInput
    update?: XOR<user_certificatesUpdateWithoutUsersInput, user_certificatesUncheckedUpdateWithoutUsersInput>
  }

  export type user_profileUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_profileCreateOrConnectWithoutUsersInput
    upsert?: user_profileUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_profileWhereUniqueInput
    update?: XOR<user_profileUpdateWithoutUsersInput, user_profileUncheckedUpdateWithoutUsersInput>
  }

  export type user_securityUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_securityCreateOrConnectWithoutUsersInput
    upsert?: user_securityUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_securityWhereUniqueInput
    update?: XOR<user_securityUpdateWithoutUsersInput, user_securityUncheckedUpdateWithoutUsersInput>
  }

  export type user_sessionsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<Enumerable<user_sessionsCreateWithoutUsersInput>, Enumerable<user_sessionsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_sessionsCreateOrConnectWithoutUsersInput>
    upsert?: Enumerable<user_sessionsUpsertWithWhereUniqueWithoutUsersInput>
    createMany?: user_sessionsCreateManyUsersInputEnvelope
    set?: Enumerable<user_sessionsWhereUniqueInput>
    disconnect?: Enumerable<user_sessionsWhereUniqueInput>
    delete?: Enumerable<user_sessionsWhereUniqueInput>
    connect?: Enumerable<user_sessionsWhereUniqueInput>
    update?: Enumerable<user_sessionsUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<user_sessionsUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<user_sessionsScalarWhereInput>
  }

  export type user_aboutUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_aboutCreateOrConnectWithoutUsersInput
    upsert?: user_aboutUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_aboutWhereUniqueInput
    update?: XOR<user_aboutUpdateWithoutUsersInput, user_aboutUncheckedUpdateWithoutUsersInput>
  }

  export type user_analyticsUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_analyticsCreateOrConnectWithoutUsersInput
    upsert?: user_analyticsUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_analyticsWhereUniqueInput
    update?: XOR<user_analyticsUpdateWithoutUsersInput, user_analyticsUncheckedUpdateWithoutUsersInput>
  }

  export type user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<Enumerable<user_audit_logsCreateWithoutUsersInput>, Enumerable<user_audit_logsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_audit_logsCreateOrConnectWithoutUsersInput>
    upsert?: Enumerable<user_audit_logsUpsertWithWhereUniqueWithoutUsersInput>
    createMany?: user_audit_logsCreateManyUsersInputEnvelope
    set?: Enumerable<user_audit_logsWhereUniqueInput>
    disconnect?: Enumerable<user_audit_logsWhereUniqueInput>
    delete?: Enumerable<user_audit_logsWhereUniqueInput>
    connect?: Enumerable<user_audit_logsWhereUniqueInput>
    update?: Enumerable<user_audit_logsUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<user_audit_logsUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<user_audit_logsScalarWhereInput>
  }

  export type user_blocklistUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_blocklistCreateOrConnectWithoutUsersInput
    upsert?: user_blocklistUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_blocklistWhereUniqueInput
    update?: XOR<user_blocklistUpdateWithoutUsersInput, user_blocklistUncheckedUpdateWithoutUsersInput>
  }

  export type user_certificatesUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_certificatesCreateOrConnectWithoutUsersInput
    upsert?: user_certificatesUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_certificatesWhereUniqueInput
    update?: XOR<user_certificatesUpdateWithoutUsersInput, user_certificatesUncheckedUpdateWithoutUsersInput>
  }

  export type user_profileUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_profileCreateOrConnectWithoutUsersInput
    upsert?: user_profileUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_profileWhereUniqueInput
    update?: XOR<user_profileUpdateWithoutUsersInput, user_profileUncheckedUpdateWithoutUsersInput>
  }

  export type user_securityUncheckedUpdateOneWithoutUsersNestedInput = {
    create?: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
    connectOrCreate?: user_securityCreateOrConnectWithoutUsersInput
    upsert?: user_securityUpsertWithoutUsersInput
    disconnect?: boolean
    delete?: boolean
    connect?: user_securityWhereUniqueInput
    update?: XOR<user_securityUpdateWithoutUsersInput, user_securityUncheckedUpdateWithoutUsersInput>
  }

  export type user_sessionsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<Enumerable<user_sessionsCreateWithoutUsersInput>, Enumerable<user_sessionsUncheckedCreateWithoutUsersInput>>
    connectOrCreate?: Enumerable<user_sessionsCreateOrConnectWithoutUsersInput>
    upsert?: Enumerable<user_sessionsUpsertWithWhereUniqueWithoutUsersInput>
    createMany?: user_sessionsCreateManyUsersInputEnvelope
    set?: Enumerable<user_sessionsWhereUniqueInput>
    disconnect?: Enumerable<user_sessionsWhereUniqueInput>
    delete?: Enumerable<user_sessionsWhereUniqueInput>
    connect?: Enumerable<user_sessionsWhereUniqueInput>
    update?: Enumerable<user_sessionsUpdateWithWhereUniqueWithoutUsersInput>
    updateMany?: Enumerable<user_sessionsUpdateManyWithWhereWithoutUsersInput>
    deleteMany?: Enumerable<user_sessionsScalarWhereInput>
  }

  export type user_aboutCreateskillsInput = {
    set: Enumerable<string>
  }

  export type usersCreateNestedOneWithoutUser_aboutInput = {
    create?: XOR<usersCreateWithoutUser_aboutInput, usersUncheckedCreateWithoutUser_aboutInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_aboutInput
    connect?: usersWhereUniqueInput
  }

  export type user_aboutUpdateskillsInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type usersUpdateOneRequiredWithoutUser_aboutNestedInput = {
    create?: XOR<usersCreateWithoutUser_aboutInput, usersUncheckedCreateWithoutUser_aboutInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_aboutInput
    upsert?: usersUpsertWithoutUser_aboutInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_aboutInput, usersUncheckedUpdateWithoutUser_aboutInput>
  }

  export type usersCreateNestedOneWithoutUser_analyticsInput = {
    create?: XOR<usersCreateWithoutUser_analyticsInput, usersUncheckedCreateWithoutUser_analyticsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_analyticsInput
    connect?: usersWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type usersUpdateOneRequiredWithoutUser_analyticsNestedInput = {
    create?: XOR<usersCreateWithoutUser_analyticsInput, usersUncheckedCreateWithoutUser_analyticsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_analyticsInput
    upsert?: usersUpsertWithoutUser_analyticsInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_analyticsInput, usersUncheckedUpdateWithoutUser_analyticsInput>
  }

  export type usersCreateNestedOneWithoutUser_audit_logsInput = {
    create?: XOR<usersCreateWithoutUser_audit_logsInput, usersUncheckedCreateWithoutUser_audit_logsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_audit_logsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneWithoutUser_audit_logsNestedInput = {
    create?: XOR<usersCreateWithoutUser_audit_logsInput, usersUncheckedCreateWithoutUser_audit_logsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_audit_logsInput
    upsert?: usersUpsertWithoutUser_audit_logsInput
    disconnect?: boolean
    delete?: boolean
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_audit_logsInput, usersUncheckedUpdateWithoutUser_audit_logsInput>
  }

  export type usersCreateNestedOneWithoutUser_blocklistInput = {
    create?: XOR<usersCreateWithoutUser_blocklistInput, usersUncheckedCreateWithoutUser_blocklistInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_blocklistInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneWithoutUser_blocklistNestedInput = {
    create?: XOR<usersCreateWithoutUser_blocklistInput, usersUncheckedCreateWithoutUser_blocklistInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_blocklistInput
    upsert?: usersUpsertWithoutUser_blocklistInput
    disconnect?: boolean
    delete?: boolean
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_blocklistInput, usersUncheckedUpdateWithoutUser_blocklistInput>
  }

  export type usersCreateNestedOneWithoutUser_certificatesInput = {
    create?: XOR<usersCreateWithoutUser_certificatesInput, usersUncheckedCreateWithoutUser_certificatesInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_certificatesInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutUser_certificatesNestedInput = {
    create?: XOR<usersCreateWithoutUser_certificatesInput, usersUncheckedCreateWithoutUser_certificatesInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_certificatesInput
    upsert?: usersUpsertWithoutUser_certificatesInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_certificatesInput, usersUncheckedUpdateWithoutUser_certificatesInput>
  }

  export type usersCreateNestedOneWithoutUser_profileInput = {
    create?: XOR<usersCreateWithoutUser_profileInput, usersUncheckedCreateWithoutUser_profileInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_profileInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutUser_profileNestedInput = {
    create?: XOR<usersCreateWithoutUser_profileInput, usersUncheckedCreateWithoutUser_profileInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_profileInput
    upsert?: usersUpsertWithoutUser_profileInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_profileInput, usersUncheckedUpdateWithoutUser_profileInput>
  }

  export type user_securityCreaterecovery_codesInput = {
    set: Enumerable<string>
  }

  export type usersCreateNestedOneWithoutUser_securityInput = {
    create?: XOR<usersCreateWithoutUser_securityInput, usersUncheckedCreateWithoutUser_securityInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_securityInput
    connect?: usersWhereUniqueInput
  }

  export type user_securityUpdaterecovery_codesInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type usersUpdateOneRequiredWithoutUser_securityNestedInput = {
    create?: XOR<usersCreateWithoutUser_securityInput, usersUncheckedCreateWithoutUser_securityInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_securityInput
    upsert?: usersUpsertWithoutUser_securityInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_securityInput, usersUncheckedUpdateWithoutUser_securityInput>
  }

  export type usersCreateNestedOneWithoutUser_sessionsInput = {
    create?: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_sessionsInput
    connect?: usersWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutUser_sessionsNestedInput = {
    create?: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutUser_sessionsInput
    upsert?: usersUpsertWithoutUser_sessionsInput
    connect?: usersWhereUniqueInput
    update?: XOR<usersUpdateWithoutUser_sessionsInput, usersUncheckedUpdateWithoutUser_sessionsInput>
  }

  export type NestedUuidFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidFilter | string
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedBoolNullableFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableFilter | boolean | null
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedUuidWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedBoolNullableWithAggregatesFilter = {
    equals?: boolean | null
    not?: NestedBoolNullableWithAggregatesFilter | boolean | null
    _count?: NestedIntNullableFilter
    _min?: NestedBoolNullableFilter
    _max?: NestedBoolNullableFilter
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDecimalNullableFilter = {
    equals?: Decimal | DecimalJsLike | number | string | null
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalNullableFilter | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedDecimalNullableWithAggregatesFilter = {
    equals?: Decimal | DecimalJsLike | number | string | null
    in?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    notIn?: Enumerable<Decimal> | Enumerable<DecimalJsLike> | Enumerable<number> | Enumerable<string> | Decimal | DecimalJsLike | number | string | null
    lt?: Decimal | DecimalJsLike | number | string
    lte?: Decimal | DecimalJsLike | number | string
    gt?: Decimal | DecimalJsLike | number | string
    gte?: Decimal | DecimalJsLike | number | string
    not?: NestedDecimalNullableWithAggregatesFilter | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter
    _avg?: NestedDecimalNullableFilter
    _sum?: NestedDecimalNullableFilter
    _min?: NestedDecimalNullableFilter
    _max?: NestedDecimalNullableFilter
  }

  export type NestedUuidNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidNullableFilter | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    not?: NestedUuidNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type user_aboutCreateWithoutUsersInput = {
    about_id?: string
    about?: string | null
    goals?: string | null
    skills?: user_aboutCreateskillsInput | Enumerable<string>
  }

  export type user_aboutUncheckedCreateWithoutUsersInput = {
    about_id?: string
    about?: string | null
    goals?: string | null
    skills?: user_aboutCreateskillsInput | Enumerable<string>
  }

  export type user_aboutCreateOrConnectWithoutUsersInput = {
    where: user_aboutWhereUniqueInput
    create: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
  }

  export type user_analyticsCreateWithoutUsersInput = {
    posts_count?: number | null
    likes_received?: number | null
    followers_count?: number | null
    following_count?: number | null
    last_login?: Date | string | null
    activity_score?: Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsUncheckedCreateWithoutUsersInput = {
    posts_count?: number | null
    likes_received?: number | null
    followers_count?: number | null
    following_count?: number | null
    last_login?: Date | string | null
    activity_score?: Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsCreateOrConnectWithoutUsersInput = {
    where: user_analyticsWhereUniqueInput
    create: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
  }

  export type user_audit_logsCreateWithoutUsersInput = {
    audit_id?: string
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type user_audit_logsUncheckedCreateWithoutUsersInput = {
    audit_id?: string
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type user_audit_logsCreateOrConnectWithoutUsersInput = {
    where: user_audit_logsWhereUniqueInput
    create: XOR<user_audit_logsCreateWithoutUsersInput, user_audit_logsUncheckedCreateWithoutUsersInput>
  }

  export type user_audit_logsCreateManyUsersInputEnvelope = {
    data: Enumerable<user_audit_logsCreateManyUsersInput>
    skipDuplicates?: boolean
  }

  export type user_blocklistCreateWithoutUsersInput = {
    block_id?: string
    reason: string
    blocked_at?: Date | string
  }

  export type user_blocklistUncheckedCreateWithoutUsersInput = {
    block_id?: string
    reason: string
    blocked_at?: Date | string
  }

  export type user_blocklistCreateOrConnectWithoutUsersInput = {
    where: user_blocklistWhereUniqueInput
    create: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
  }

  export type user_certificatesCreateWithoutUsersInput = {
    public_key: string
    certificate?: string | null
    created_at?: Date | string
  }

  export type user_certificatesUncheckedCreateWithoutUsersInput = {
    public_key: string
    certificate?: string | null
    created_at?: Date | string
  }

  export type user_certificatesCreateOrConnectWithoutUsersInput = {
    where: user_certificatesWhereUniqueInput
    create: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
  }

  export type user_profileCreateWithoutUsersInput = {
    username: string
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    website?: string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    dob?: Date | string | null
    country?: string | null
    banner_url?: string | null
  }

  export type user_profileUncheckedCreateWithoutUsersInput = {
    username: string
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    website?: string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    dob?: Date | string | null
    country?: string | null
    banner_url?: string | null
  }

  export type user_profileCreateOrConnectWithoutUsersInput = {
    where: user_profileWhereUniqueInput
    create: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
  }

  export type user_securityCreateWithoutUsersInput = {
    failed_attempts?: number | null
    last_failed_login?: Date | string | null
    otp_code?: string | null
    otp_expires_at?: Date | string | null
    recovery_codes?: user_securityCreaterecovery_codesInput | Enumerable<string>
    updated_at?: Date | string
  }

  export type user_securityUncheckedCreateWithoutUsersInput = {
    failed_attempts?: number | null
    last_failed_login?: Date | string | null
    otp_code?: string | null
    otp_expires_at?: Date | string | null
    recovery_codes?: user_securityCreaterecovery_codesInput | Enumerable<string>
    updated_at?: Date | string
  }

  export type user_securityCreateOrConnectWithoutUsersInput = {
    where: user_securityWhereUniqueInput
    create: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
  }

  export type user_sessionsCreateWithoutUsersInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
  }

  export type user_sessionsUncheckedCreateWithoutUsersInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
  }

  export type user_sessionsCreateOrConnectWithoutUsersInput = {
    where: user_sessionsWhereUniqueInput
    create: XOR<user_sessionsCreateWithoutUsersInput, user_sessionsUncheckedCreateWithoutUsersInput>
  }

  export type user_sessionsCreateManyUsersInputEnvelope = {
    data: Enumerable<user_sessionsCreateManyUsersInput>
    skipDuplicates?: boolean
  }

  export type user_aboutUpsertWithoutUsersInput = {
    update: XOR<user_aboutUpdateWithoutUsersInput, user_aboutUncheckedUpdateWithoutUsersInput>
    create: XOR<user_aboutCreateWithoutUsersInput, user_aboutUncheckedCreateWithoutUsersInput>
  }

  export type user_aboutUpdateWithoutUsersInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
  }

  export type user_aboutUncheckedUpdateWithoutUsersInput = {
    about_id?: StringFieldUpdateOperationsInput | string
    about?: NullableStringFieldUpdateOperationsInput | string | null
    goals?: NullableStringFieldUpdateOperationsInput | string | null
    skills?: user_aboutUpdateskillsInput | Enumerable<string>
  }

  export type user_analyticsUpsertWithoutUsersInput = {
    update: XOR<user_analyticsUpdateWithoutUsersInput, user_analyticsUncheckedUpdateWithoutUsersInput>
    create: XOR<user_analyticsCreateWithoutUsersInput, user_analyticsUncheckedCreateWithoutUsersInput>
  }

  export type user_analyticsUpdateWithoutUsersInput = {
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type user_analyticsUncheckedUpdateWithoutUsersInput = {
    posts_count?: NullableIntFieldUpdateOperationsInput | number | null
    likes_received?: NullableIntFieldUpdateOperationsInput | number | null
    followers_count?: NullableIntFieldUpdateOperationsInput | number | null
    following_count?: NullableIntFieldUpdateOperationsInput | number | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activity_score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type user_audit_logsUpsertWithWhereUniqueWithoutUsersInput = {
    where: user_audit_logsWhereUniqueInput
    update: XOR<user_audit_logsUpdateWithoutUsersInput, user_audit_logsUncheckedUpdateWithoutUsersInput>
    create: XOR<user_audit_logsCreateWithoutUsersInput, user_audit_logsUncheckedCreateWithoutUsersInput>
  }

  export type user_audit_logsUpdateWithWhereUniqueWithoutUsersInput = {
    where: user_audit_logsWhereUniqueInput
    data: XOR<user_audit_logsUpdateWithoutUsersInput, user_audit_logsUncheckedUpdateWithoutUsersInput>
  }

  export type user_audit_logsUpdateManyWithWhereWithoutUsersInput = {
    where: user_audit_logsScalarWhereInput
    data: XOR<user_audit_logsUpdateManyMutationInput, user_audit_logsUncheckedUpdateManyWithoutUser_audit_logsInput>
  }

  export type user_audit_logsScalarWhereInput = {
    AND?: Enumerable<user_audit_logsScalarWhereInput>
    OR?: Enumerable<user_audit_logsScalarWhereInput>
    NOT?: Enumerable<user_audit_logsScalarWhereInput>
    audit_id?: UuidFilter | string
    user_id?: UuidNullableFilter | string | null
    action_type?: StringFilter | string
    details?: JsonNullableFilter
    performed_by?: UuidNullableFilter | string | null
    event_time?: DateTimeFilter | Date | string
  }

  export type user_blocklistUpsertWithoutUsersInput = {
    update: XOR<user_blocklistUpdateWithoutUsersInput, user_blocklistUncheckedUpdateWithoutUsersInput>
    create: XOR<user_blocklistCreateWithoutUsersInput, user_blocklistUncheckedCreateWithoutUsersInput>
  }

  export type user_blocklistUpdateWithoutUsersInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_blocklistUncheckedUpdateWithoutUsersInput = {
    block_id?: StringFieldUpdateOperationsInput | string
    reason?: StringFieldUpdateOperationsInput | string
    blocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_certificatesUpsertWithoutUsersInput = {
    update: XOR<user_certificatesUpdateWithoutUsersInput, user_certificatesUncheckedUpdateWithoutUsersInput>
    create: XOR<user_certificatesCreateWithoutUsersInput, user_certificatesUncheckedCreateWithoutUsersInput>
  }

  export type user_certificatesUpdateWithoutUsersInput = {
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_certificatesUncheckedUpdateWithoutUsersInput = {
    public_key?: StringFieldUpdateOperationsInput | string
    certificate?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_profileUpsertWithoutUsersInput = {
    update: XOR<user_profileUpdateWithoutUsersInput, user_profileUncheckedUpdateWithoutUsersInput>
    create: XOR<user_profileCreateWithoutUsersInput, user_profileUncheckedCreateWithoutUsersInput>
  }

  export type user_profileUpdateWithoutUsersInput = {
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_profileUncheckedUpdateWithoutUsersInput = {
    username?: StringFieldUpdateOperationsInput | string
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    social_links?: NullableJsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    banner_url?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_securityUpsertWithoutUsersInput = {
    update: XOR<user_securityUpdateWithoutUsersInput, user_securityUncheckedUpdateWithoutUsersInput>
    create: XOR<user_securityCreateWithoutUsersInput, user_securityUncheckedCreateWithoutUsersInput>
  }

  export type user_securityUpdateWithoutUsersInput = {
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_securityUncheckedUpdateWithoutUsersInput = {
    failed_attempts?: NullableIntFieldUpdateOperationsInput | number | null
    last_failed_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    otp_code?: NullableStringFieldUpdateOperationsInput | string | null
    otp_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recovery_codes?: user_securityUpdaterecovery_codesInput | Enumerable<string>
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUpsertWithWhereUniqueWithoutUsersInput = {
    where: user_sessionsWhereUniqueInput
    update: XOR<user_sessionsUpdateWithoutUsersInput, user_sessionsUncheckedUpdateWithoutUsersInput>
    create: XOR<user_sessionsCreateWithoutUsersInput, user_sessionsUncheckedCreateWithoutUsersInput>
  }

  export type user_sessionsUpdateWithWhereUniqueWithoutUsersInput = {
    where: user_sessionsWhereUniqueInput
    data: XOR<user_sessionsUpdateWithoutUsersInput, user_sessionsUncheckedUpdateWithoutUsersInput>
  }

  export type user_sessionsUpdateManyWithWhereWithoutUsersInput = {
    where: user_sessionsScalarWhereInput
    data: XOR<user_sessionsUpdateManyMutationInput, user_sessionsUncheckedUpdateManyWithoutUser_sessionsInput>
  }

  export type user_sessionsScalarWhereInput = {
    AND?: Enumerable<user_sessionsScalarWhereInput>
    OR?: Enumerable<user_sessionsScalarWhereInput>
    NOT?: Enumerable<user_sessionsScalarWhereInput>
    session_id?: UuidFilter | string
    user_id?: UuidFilter | string
    token?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    is_revoked?: BoolNullableFilter | boolean | null
    secret?: StringNullableFilter | string | null
  }

  export type usersCreateWithoutUser_aboutInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_aboutInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_aboutInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_aboutInput, usersUncheckedCreateWithoutUser_aboutInput>
  }

  export type usersUpsertWithoutUser_aboutInput = {
    update: XOR<usersUpdateWithoutUser_aboutInput, usersUncheckedUpdateWithoutUser_aboutInput>
    create: XOR<usersCreateWithoutUser_aboutInput, usersUncheckedCreateWithoutUser_aboutInput>
  }

  export type usersUpdateWithoutUser_aboutInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_aboutInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_analyticsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_analyticsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_analyticsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_analyticsInput, usersUncheckedCreateWithoutUser_analyticsInput>
  }

  export type usersUpsertWithoutUser_analyticsInput = {
    update: XOR<usersUpdateWithoutUser_analyticsInput, usersUncheckedUpdateWithoutUser_analyticsInput>
    create: XOR<usersCreateWithoutUser_analyticsInput, usersUncheckedCreateWithoutUser_analyticsInput>
  }

  export type usersUpdateWithoutUser_analyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_analyticsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_audit_logsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_audit_logsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_audit_logsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_audit_logsInput, usersUncheckedCreateWithoutUser_audit_logsInput>
  }

  export type usersUpsertWithoutUser_audit_logsInput = {
    update: XOR<usersUpdateWithoutUser_audit_logsInput, usersUncheckedUpdateWithoutUser_audit_logsInput>
    create: XOR<usersCreateWithoutUser_audit_logsInput, usersUncheckedCreateWithoutUser_audit_logsInput>
  }

  export type usersUpdateWithoutUser_audit_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_audit_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_blocklistInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_blocklistInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_blocklistInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_blocklistInput, usersUncheckedCreateWithoutUser_blocklistInput>
  }

  export type usersUpsertWithoutUser_blocklistInput = {
    update: XOR<usersUpdateWithoutUser_blocklistInput, usersUncheckedUpdateWithoutUser_blocklistInput>
    create: XOR<usersCreateWithoutUser_blocklistInput, usersUncheckedCreateWithoutUser_blocklistInput>
  }

  export type usersUpdateWithoutUser_blocklistInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_blocklistInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_certificatesInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_certificatesInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_certificatesInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_certificatesInput, usersUncheckedCreateWithoutUser_certificatesInput>
  }

  export type usersUpsertWithoutUser_certificatesInput = {
    update: XOR<usersUpdateWithoutUser_certificatesInput, usersUncheckedUpdateWithoutUser_certificatesInput>
    create: XOR<usersCreateWithoutUser_certificatesInput, usersUncheckedCreateWithoutUser_certificatesInput>
  }

  export type usersUpdateWithoutUser_certificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_certificatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_profileInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_profileInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_profileInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_profileInput, usersUncheckedCreateWithoutUser_profileInput>
  }

  export type usersUpsertWithoutUser_profileInput = {
    update: XOR<usersUpdateWithoutUser_profileInput, usersUncheckedUpdateWithoutUser_profileInput>
    create: XOR<usersCreateWithoutUser_profileInput, usersUncheckedCreateWithoutUser_profileInput>
  }

  export type usersUpdateWithoutUser_profileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_profileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_securityInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsCreateNestedManyWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_securityInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_sessions?: user_sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_securityInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_securityInput, usersUncheckedCreateWithoutUser_securityInput>
  }

  export type usersUpsertWithoutUser_securityInput = {
    update: XOR<usersUpdateWithoutUser_securityInput, usersUncheckedUpdateWithoutUser_securityInput>
    create: XOR<usersCreateWithoutUser_securityInput, usersUncheckedCreateWithoutUser_securityInput>
  }

  export type usersUpdateWithoutUser_securityInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_securityInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_sessions?: user_sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutUser_sessionsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesCreateNestedOneWithoutUsersInput
    user_profile?: user_profileCreateNestedOneWithoutUsersInput
    user_security?: user_securityCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutUser_sessionsInput = {
    id?: string
    email: string
    phone?: string | null
    password_hash: string
    created_at?: Date | string
    updated_at?: Date | string
    is_verified?: boolean | null
    is_active?: boolean | null
    pass_salts?: string | null
    user_type?: string | null
    initial_balance?: number
    user_about?: user_aboutUncheckedCreateNestedOneWithoutUsersInput
    user_analytics?: user_analyticsUncheckedCreateNestedOneWithoutUsersInput
    user_audit_logs?: user_audit_logsUncheckedCreateNestedManyWithoutUsersInput
    user_blocklist?: user_blocklistUncheckedCreateNestedOneWithoutUsersInput
    user_certificates?: user_certificatesUncheckedCreateNestedOneWithoutUsersInput
    user_profile?: user_profileUncheckedCreateNestedOneWithoutUsersInput
    user_security?: user_securityUncheckedCreateNestedOneWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutUser_sessionsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
  }

  export type usersUpsertWithoutUser_sessionsInput = {
    update: XOR<usersUpdateWithoutUser_sessionsInput, usersUncheckedUpdateWithoutUser_sessionsInput>
    create: XOR<usersCreateWithoutUser_sessionsInput, usersUncheckedCreateWithoutUser_sessionsInput>
  }

  export type usersUpdateWithoutUser_sessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUpdateOneWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutUser_sessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_verified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null
    pass_salts?: NullableStringFieldUpdateOperationsInput | string | null
    user_type?: NullableStringFieldUpdateOperationsInput | string | null
    initial_balance?: FloatFieldUpdateOperationsInput | number
    user_about?: user_aboutUncheckedUpdateOneWithoutUsersNestedInput
    user_analytics?: user_analyticsUncheckedUpdateOneWithoutUsersNestedInput
    user_audit_logs?: user_audit_logsUncheckedUpdateManyWithoutUsersNestedInput
    user_blocklist?: user_blocklistUncheckedUpdateOneWithoutUsersNestedInput
    user_certificates?: user_certificatesUncheckedUpdateOneWithoutUsersNestedInput
    user_profile?: user_profileUncheckedUpdateOneWithoutUsersNestedInput
    user_security?: user_securityUncheckedUpdateOneWithoutUsersNestedInput
  }

  export type user_audit_logsCreateManyUsersInput = {
    audit_id?: string
    action_type: string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type user_sessionsCreateManyUsersInput = {
    session_id?: string
    token: string
    created_at?: Date | string
    is_revoked?: boolean | null
    secret?: string | null
  }

  export type user_audit_logsUpdateWithoutUsersInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_audit_logsUncheckedUpdateWithoutUsersInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_audit_logsUncheckedUpdateManyWithoutUser_audit_logsInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    action_type?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionsUpdateWithoutUsersInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_sessionsUncheckedUpdateWithoutUsersInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_sessionsUncheckedUpdateManyWithoutUser_sessionsInput = {
    session_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_revoked?: NullableBoolFieldUpdateOperationsInput | boolean | null
    secret?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}