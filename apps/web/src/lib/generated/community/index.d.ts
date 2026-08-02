
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type serversPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "servers"
  objects: {
    channels: channelsPayload<ExtArgs>[]
    members: membersPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    server_id: string
    name: string
    description: string | null
    owner_id: string
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["servers"]>
  composites: {}
}

/**
 * Model servers
 * 
 */
export type servers = runtime.Types.DefaultSelection<serversPayload>
export type channelsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "channels"
  objects: {
    servers: serversPayload<ExtArgs>
    messages: messagesPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    channel_id: string
    server_id: string
    name: string
    type: string
    topic: string | null
    position: number | null
    created_at: Date
  }, ExtArgs["result"]["channels"]>
  composites: {}
}

/**
 * Model channels
 * 
 */
export type channels = runtime.Types.DefaultSelection<channelsPayload>
export type membersPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "members"
  objects: {
    servers: serversPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    member_id: string
    server_id: string
    user_id: string
    role: string
    joined_at: Date
  }, ExtArgs["result"]["members"]>
  composites: {}
}

/**
 * Model members
 * 
 */
export type members = runtime.Types.DefaultSelection<membersPayload>
export type messagesPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "messages"
  objects: {
    channels: channelsPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    message_id: string
    channel_id: string
    user_id: string
    content: string
    created_at: Date
    updated_at: Date
  }, ExtArgs["result"]["messages"]>
  composites: {}
}

/**
 * Model messages
 * 
 */
export type messages = runtime.Types.DefaultSelection<messagesPayload>
export type presencePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "presence"
  objects: {}
  scalars: $Extensions.GetResult<{
    presence_id: string
    user_id: string
    status: string
    last_seen: Date | null
    created_at: Date
  }, ExtArgs["result"]["presence"]>
  composites: {}
}

/**
 * Model presence
 * 
 */
export type presence = runtime.Types.DefaultSelection<presencePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Servers
 * const servers = await prisma.servers.findMany()
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
   * // Fetch zero or more Servers
   * const servers = await prisma.servers.findMany()
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
   * `prisma.servers`: Exposes CRUD operations for the **servers** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Servers
    * const servers = await prisma.servers.findMany()
    * ```
    */
  get servers(): Prisma.serversDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.channels`: Exposes CRUD operations for the **channels** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Channels
    * const channels = await prisma.channels.findMany()
    * ```
    */
  get channels(): Prisma.channelsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.members`: Exposes CRUD operations for the **members** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Members
    * const members = await prisma.members.findMany()
    * ```
    */
  get members(): Prisma.membersDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.messages`: Exposes CRUD operations for the **messages** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.messages.findMany()
    * ```
    */
  get messages(): Prisma.messagesDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.presence`: Exposes CRUD operations for the **presence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Presences
    * const presences = await prisma.presence.findMany()
    * ```
    */
  get presence(): Prisma.presenceDelegate<GlobalReject, ExtArgs>;
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
    servers: 'servers',
    channels: 'channels',
    members: 'members',
    messages: 'messages',
    presence: 'presence'
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
      modelProps: 'servers' | 'channels' | 'members' | 'messages' | 'presence'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      servers: {
        payload: serversPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.serversFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.serversFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          findFirst: {
            args: Prisma.serversFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.serversFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          findMany: {
            args: Prisma.serversFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>[]
          }
          create: {
            args: Prisma.serversCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          createMany: {
            args: Prisma.serversCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.serversDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          update: {
            args: Prisma.serversUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          deleteMany: {
            args: Prisma.serversDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.serversUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.serversUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<serversPayload>
          }
          aggregate: {
            args: Prisma.ServersAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateServers>
          }
          groupBy: {
            args: Prisma.ServersGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ServersGroupByOutputType>[]
          }
          count: {
            args: Prisma.serversCountArgs<ExtArgs>,
            result: $Utils.Optional<ServersCountAggregateOutputType> | number
          }
        }
      }
      channels: {
        payload: channelsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.channelsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.channelsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          findFirst: {
            args: Prisma.channelsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.channelsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          findMany: {
            args: Prisma.channelsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>[]
          }
          create: {
            args: Prisma.channelsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          createMany: {
            args: Prisma.channelsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.channelsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          update: {
            args: Prisma.channelsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          deleteMany: {
            args: Prisma.channelsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.channelsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.channelsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<channelsPayload>
          }
          aggregate: {
            args: Prisma.ChannelsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateChannels>
          }
          groupBy: {
            args: Prisma.ChannelsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ChannelsGroupByOutputType>[]
          }
          count: {
            args: Prisma.channelsCountArgs<ExtArgs>,
            result: $Utils.Optional<ChannelsCountAggregateOutputType> | number
          }
        }
      }
      members: {
        payload: membersPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.membersFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.membersFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          findFirst: {
            args: Prisma.membersFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.membersFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          findMany: {
            args: Prisma.membersFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>[]
          }
          create: {
            args: Prisma.membersCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          createMany: {
            args: Prisma.membersCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.membersDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          update: {
            args: Prisma.membersUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          deleteMany: {
            args: Prisma.membersDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.membersUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.membersUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<membersPayload>
          }
          aggregate: {
            args: Prisma.MembersAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMembers>
          }
          groupBy: {
            args: Prisma.MembersGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MembersGroupByOutputType>[]
          }
          count: {
            args: Prisma.membersCountArgs<ExtArgs>,
            result: $Utils.Optional<MembersCountAggregateOutputType> | number
          }
        }
      }
      messages: {
        payload: messagesPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.messagesFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.messagesFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          findFirst: {
            args: Prisma.messagesFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.messagesFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          findMany: {
            args: Prisma.messagesFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>[]
          }
          create: {
            args: Prisma.messagesCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          createMany: {
            args: Prisma.messagesCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.messagesDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          update: {
            args: Prisma.messagesUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          deleteMany: {
            args: Prisma.messagesDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.messagesUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.messagesUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<messagesPayload>
          }
          aggregate: {
            args: Prisma.MessagesAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMessages>
          }
          groupBy: {
            args: Prisma.MessagesGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MessagesGroupByOutputType>[]
          }
          count: {
            args: Prisma.messagesCountArgs<ExtArgs>,
            result: $Utils.Optional<MessagesCountAggregateOutputType> | number
          }
        }
      }
      presence: {
        payload: presencePayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.presenceFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.presenceFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          findFirst: {
            args: Prisma.presenceFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.presenceFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          findMany: {
            args: Prisma.presenceFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>[]
          }
          create: {
            args: Prisma.presenceCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          createMany: {
            args: Prisma.presenceCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.presenceDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          update: {
            args: Prisma.presenceUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          deleteMany: {
            args: Prisma.presenceDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.presenceUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.presenceUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<presencePayload>
          }
          aggregate: {
            args: Prisma.PresenceAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePresence>
          }
          groupBy: {
            args: Prisma.PresenceGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PresenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.presenceCountArgs<ExtArgs>,
            result: $Utils.Optional<PresenceCountAggregateOutputType> | number
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
   * Count Type ServersCountOutputType
   */


  export type ServersCountOutputType = {
    channels: number
    members: number
  }

  export type ServersCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    channels?: boolean | ServersCountOutputTypeCountChannelsArgs
    members?: boolean | ServersCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes

  /**
   * ServersCountOutputType without action
   */
  export type ServersCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServersCountOutputType
     */
    select?: ServersCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ServersCountOutputType without action
   */
  export type ServersCountOutputTypeCountChannelsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: channelsWhereInput
  }


  /**
   * ServersCountOutputType without action
   */
  export type ServersCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: membersWhereInput
  }



  /**
   * Count Type ChannelsCountOutputType
   */


  export type ChannelsCountOutputType = {
    messages: number
  }

  export type ChannelsCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    messages?: boolean | ChannelsCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes

  /**
   * ChannelsCountOutputType without action
   */
  export type ChannelsCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChannelsCountOutputType
     */
    select?: ChannelsCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ChannelsCountOutputType without action
   */
  export type ChannelsCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
  }



  /**
   * Models
   */

  /**
   * Model servers
   */


  export type AggregateServers = {
    _count: ServersCountAggregateOutputType | null
    _min: ServersMinAggregateOutputType | null
    _max: ServersMaxAggregateOutputType | null
  }

  export type ServersMinAggregateOutputType = {
    server_id: string | null
    name: string | null
    description: string | null
    owner_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ServersMaxAggregateOutputType = {
    server_id: string | null
    name: string | null
    description: string | null
    owner_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ServersCountAggregateOutputType = {
    server_id: number
    name: number
    description: number
    owner_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ServersMinAggregateInputType = {
    server_id?: true
    name?: true
    description?: true
    owner_id?: true
    created_at?: true
    updated_at?: true
  }

  export type ServersMaxAggregateInputType = {
    server_id?: true
    name?: true
    description?: true
    owner_id?: true
    created_at?: true
    updated_at?: true
  }

  export type ServersCountAggregateInputType = {
    server_id?: true
    name?: true
    description?: true
    owner_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ServersAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which servers to aggregate.
     */
    where?: serversWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servers to fetch.
     */
    orderBy?: Enumerable<serversOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: serversWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned servers
    **/
    _count?: true | ServersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServersMaxAggregateInputType
  }

  export type GetServersAggregateType<T extends ServersAggregateArgs> = {
        [P in keyof T & keyof AggregateServers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServers[P]>
      : GetScalarType<T[P], AggregateServers[P]>
  }




  export type ServersGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: serversWhereInput
    orderBy?: Enumerable<serversOrderByWithAggregationInput>
    by: ServersScalarFieldEnum[]
    having?: serversScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServersCountAggregateInputType | true
    _min?: ServersMinAggregateInputType
    _max?: ServersMaxAggregateInputType
  }


  export type ServersGroupByOutputType = {
    server_id: string
    name: string
    description: string | null
    owner_id: string
    created_at: Date
    updated_at: Date
    _count: ServersCountAggregateOutputType | null
    _min: ServersMinAggregateOutputType | null
    _max: ServersMaxAggregateOutputType | null
  }

  type GetServersGroupByPayload<T extends ServersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ServersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServersGroupByOutputType[P]>
            : GetScalarType<T[P], ServersGroupByOutputType[P]>
        }
      >
    >


  export type serversSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    server_id?: boolean
    name?: boolean
    description?: boolean
    owner_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    channels?: boolean | servers$channelsArgs<ExtArgs>
    members?: boolean | servers$membersArgs<ExtArgs>
    _count?: boolean | ServersCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["servers"]>

  export type serversSelectScalar = {
    server_id?: boolean
    name?: boolean
    description?: boolean
    owner_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type serversInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    channels?: boolean | servers$channelsArgs<ExtArgs>
    members?: boolean | servers$membersArgs<ExtArgs>
    _count?: boolean | ServersCountOutputTypeArgs<ExtArgs>
  }


  type serversGetPayload<S extends boolean | null | undefined | serversArgs> = $Types.GetResult<serversPayload, S>

  type serversCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<serversFindManyArgs, 'select' | 'include'> & {
      select?: ServersCountAggregateInputType | true
    }

  export interface serversDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['servers'], meta: { name: 'servers' } }
    /**
     * Find zero or one Servers that matches the filter.
     * @param {serversFindUniqueArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends serversFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, serversFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'servers'> extends True ? Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Servers that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {serversFindUniqueOrThrowArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends serversFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, serversFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Servers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {serversFindFirstArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends serversFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, serversFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'servers'> extends True ? Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Servers that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {serversFindFirstOrThrowArgs} args - Arguments to find a Servers
     * @example
     * // Get one Servers
     * const servers = await prisma.servers.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends serversFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, serversFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Servers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {serversFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Servers
     * const servers = await prisma.servers.findMany()
     * 
     * // Get first 10 Servers
     * const servers = await prisma.servers.findMany({ take: 10 })
     * 
     * // Only select the `server_id`
     * const serversWithServer_idOnly = await prisma.servers.findMany({ select: { server_id: true } })
     * 
    **/
    findMany<T extends serversFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, serversFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<serversPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Servers.
     * @param {serversCreateArgs} args - Arguments to create a Servers.
     * @example
     * // Create one Servers
     * const Servers = await prisma.servers.create({
     *   data: {
     *     // ... data to create a Servers
     *   }
     * })
     * 
    **/
    create<T extends serversCreateArgs<ExtArgs>>(
      args: SelectSubset<T, serversCreateArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Servers.
     *     @param {serversCreateManyArgs} args - Arguments to create many Servers.
     *     @example
     *     // Create many Servers
     *     const servers = await prisma.servers.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends serversCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, serversCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Servers.
     * @param {serversDeleteArgs} args - Arguments to delete one Servers.
     * @example
     * // Delete one Servers
     * const Servers = await prisma.servers.delete({
     *   where: {
     *     // ... filter to delete one Servers
     *   }
     * })
     * 
    **/
    delete<T extends serversDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, serversDeleteArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Servers.
     * @param {serversUpdateArgs} args - Arguments to update one Servers.
     * @example
     * // Update one Servers
     * const servers = await prisma.servers.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends serversUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, serversUpdateArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Servers.
     * @param {serversDeleteManyArgs} args - Arguments to filter Servers to delete.
     * @example
     * // Delete a few Servers
     * const { count } = await prisma.servers.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends serversDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, serversDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {serversUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Servers
     * const servers = await prisma.servers.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends serversUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, serversUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Servers.
     * @param {serversUpsertArgs} args - Arguments to update or create a Servers.
     * @example
     * // Update or create a Servers
     * const servers = await prisma.servers.upsert({
     *   create: {
     *     // ... data to create a Servers
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Servers we want to update
     *   }
     * })
    **/
    upsert<T extends serversUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, serversUpsertArgs<ExtArgs>>
    ): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {serversCountArgs} args - Arguments to filter Servers to count.
     * @example
     * // Count the number of Servers
     * const count = await prisma.servers.count({
     *   where: {
     *     // ... the filter for the Servers we want to count
     *   }
     * })
    **/
    count<T extends serversCountArgs>(
      args?: Subset<T, serversCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServersAggregateArgs>(args: Subset<T, ServersAggregateArgs>): Prisma.PrismaPromise<GetServersAggregateType<T>>

    /**
     * Group by Servers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServersGroupByArgs} args - Group by arguments.
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
      T extends ServersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServersGroupByArgs['orderBy'] }
        : { orderBy?: ServersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ServersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for servers.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__serversClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    channels<T extends servers$channelsArgs<ExtArgs> = {}>(args?: Subset<T, servers$channelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findMany', never>| Null>;

    members<T extends servers$membersArgs<ExtArgs> = {}>(args?: Subset<T, servers$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<membersPayload<ExtArgs>, T, 'findMany', never>| Null>;

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
   * servers base type for findUnique actions
   */
  export type serversFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter, which servers to fetch.
     */
    where: serversWhereUniqueInput
  }

  /**
   * servers findUnique
   */
  export interface serversFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends serversFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * servers findUniqueOrThrow
   */
  export type serversFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter, which servers to fetch.
     */
    where: serversWhereUniqueInput
  }


  /**
   * servers base type for findFirst actions
   */
  export type serversFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter, which servers to fetch.
     */
    where?: serversWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servers to fetch.
     */
    orderBy?: Enumerable<serversOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servers.
     */
    cursor?: serversWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servers.
     */
    distinct?: Enumerable<ServersScalarFieldEnum>
  }

  /**
   * servers findFirst
   */
  export interface serversFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends serversFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * servers findFirstOrThrow
   */
  export type serversFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter, which servers to fetch.
     */
    where?: serversWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servers to fetch.
     */
    orderBy?: Enumerable<serversOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for servers.
     */
    cursor?: serversWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of servers.
     */
    distinct?: Enumerable<ServersScalarFieldEnum>
  }


  /**
   * servers findMany
   */
  export type serversFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter, which servers to fetch.
     */
    where?: serversWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of servers to fetch.
     */
    orderBy?: Enumerable<serversOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing servers.
     */
    cursor?: serversWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` servers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` servers.
     */
    skip?: number
    distinct?: Enumerable<ServersScalarFieldEnum>
  }


  /**
   * servers create
   */
  export type serversCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * The data needed to create a servers.
     */
    data: XOR<serversCreateInput, serversUncheckedCreateInput>
  }


  /**
   * servers createMany
   */
  export type serversCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many servers.
     */
    data: Enumerable<serversCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * servers update
   */
  export type serversUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * The data needed to update a servers.
     */
    data: XOR<serversUpdateInput, serversUncheckedUpdateInput>
    /**
     * Choose, which servers to update.
     */
    where: serversWhereUniqueInput
  }


  /**
   * servers updateMany
   */
  export type serversUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update servers.
     */
    data: XOR<serversUpdateManyMutationInput, serversUncheckedUpdateManyInput>
    /**
     * Filter which servers to update
     */
    where?: serversWhereInput
  }


  /**
   * servers upsert
   */
  export type serversUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * The filter to search for the servers to update in case it exists.
     */
    where: serversWhereUniqueInput
    /**
     * In case the servers found by the `where` argument doesn't exist, create a new servers with this data.
     */
    create: XOR<serversCreateInput, serversUncheckedCreateInput>
    /**
     * In case the servers was found with the provided `where` argument, update it with this data.
     */
    update: XOR<serversUpdateInput, serversUncheckedUpdateInput>
  }


  /**
   * servers delete
   */
  export type serversDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
    /**
     * Filter which servers to delete.
     */
    where: serversWhereUniqueInput
  }


  /**
   * servers deleteMany
   */
  export type serversDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which servers to delete
     */
    where?: serversWhereInput
  }


  /**
   * servers.channels
   */
  export type servers$channelsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    where?: channelsWhereInput
    orderBy?: Enumerable<channelsOrderByWithRelationInput>
    cursor?: channelsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<ChannelsScalarFieldEnum>
  }


  /**
   * servers.members
   */
  export type servers$membersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    where?: membersWhereInput
    orderBy?: Enumerable<membersOrderByWithRelationInput>
    cursor?: membersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<MembersScalarFieldEnum>
  }


  /**
   * servers without action
   */
  export type serversArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the servers
     */
    select?: serversSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: serversInclude<ExtArgs> | null
  }



  /**
   * Model channels
   */


  export type AggregateChannels = {
    _count: ChannelsCountAggregateOutputType | null
    _avg: ChannelsAvgAggregateOutputType | null
    _sum: ChannelsSumAggregateOutputType | null
    _min: ChannelsMinAggregateOutputType | null
    _max: ChannelsMaxAggregateOutputType | null
  }

  export type ChannelsAvgAggregateOutputType = {
    position: number | null
  }

  export type ChannelsSumAggregateOutputType = {
    position: number | null
  }

  export type ChannelsMinAggregateOutputType = {
    channel_id: string | null
    server_id: string | null
    name: string | null
    type: string | null
    topic: string | null
    position: number | null
    created_at: Date | null
  }

  export type ChannelsMaxAggregateOutputType = {
    channel_id: string | null
    server_id: string | null
    name: string | null
    type: string | null
    topic: string | null
    position: number | null
    created_at: Date | null
  }

  export type ChannelsCountAggregateOutputType = {
    channel_id: number
    server_id: number
    name: number
    type: number
    topic: number
    position: number
    created_at: number
    _all: number
  }


  export type ChannelsAvgAggregateInputType = {
    position?: true
  }

  export type ChannelsSumAggregateInputType = {
    position?: true
  }

  export type ChannelsMinAggregateInputType = {
    channel_id?: true
    server_id?: true
    name?: true
    type?: true
    topic?: true
    position?: true
    created_at?: true
  }

  export type ChannelsMaxAggregateInputType = {
    channel_id?: true
    server_id?: true
    name?: true
    type?: true
    topic?: true
    position?: true
    created_at?: true
  }

  export type ChannelsCountAggregateInputType = {
    channel_id?: true
    server_id?: true
    name?: true
    type?: true
    topic?: true
    position?: true
    created_at?: true
    _all?: true
  }

  export type ChannelsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which channels to aggregate.
     */
    where?: channelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: Enumerable<channelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: channelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned channels
    **/
    _count?: true | ChannelsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChannelsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChannelsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChannelsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChannelsMaxAggregateInputType
  }

  export type GetChannelsAggregateType<T extends ChannelsAggregateArgs> = {
        [P in keyof T & keyof AggregateChannels]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChannels[P]>
      : GetScalarType<T[P], AggregateChannels[P]>
  }




  export type ChannelsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: channelsWhereInput
    orderBy?: Enumerable<channelsOrderByWithAggregationInput>
    by: ChannelsScalarFieldEnum[]
    having?: channelsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChannelsCountAggregateInputType | true
    _avg?: ChannelsAvgAggregateInputType
    _sum?: ChannelsSumAggregateInputType
    _min?: ChannelsMinAggregateInputType
    _max?: ChannelsMaxAggregateInputType
  }


  export type ChannelsGroupByOutputType = {
    channel_id: string
    server_id: string
    name: string
    type: string
    topic: string | null
    position: number | null
    created_at: Date
    _count: ChannelsCountAggregateOutputType | null
    _avg: ChannelsAvgAggregateOutputType | null
    _sum: ChannelsSumAggregateOutputType | null
    _min: ChannelsMinAggregateOutputType | null
    _max: ChannelsMaxAggregateOutputType | null
  }

  type GetChannelsGroupByPayload<T extends ChannelsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ChannelsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChannelsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChannelsGroupByOutputType[P]>
            : GetScalarType<T[P], ChannelsGroupByOutputType[P]>
        }
      >
    >


  export type channelsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    channel_id?: boolean
    server_id?: boolean
    name?: boolean
    type?: boolean
    topic?: boolean
    position?: boolean
    created_at?: boolean
    servers?: boolean | serversArgs<ExtArgs>
    messages?: boolean | channels$messagesArgs<ExtArgs>
    _count?: boolean | ChannelsCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["channels"]>

  export type channelsSelectScalar = {
    channel_id?: boolean
    server_id?: boolean
    name?: boolean
    type?: boolean
    topic?: boolean
    position?: boolean
    created_at?: boolean
  }

  export type channelsInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    servers?: boolean | serversArgs<ExtArgs>
    messages?: boolean | channels$messagesArgs<ExtArgs>
    _count?: boolean | ChannelsCountOutputTypeArgs<ExtArgs>
  }


  type channelsGetPayload<S extends boolean | null | undefined | channelsArgs> = $Types.GetResult<channelsPayload, S>

  type channelsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<channelsFindManyArgs, 'select' | 'include'> & {
      select?: ChannelsCountAggregateInputType | true
    }

  export interface channelsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['channels'], meta: { name: 'channels' } }
    /**
     * Find zero or one Channels that matches the filter.
     * @param {channelsFindUniqueArgs} args - Arguments to find a Channels
     * @example
     * // Get one Channels
     * const channels = await prisma.channels.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends channelsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, channelsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'channels'> extends True ? Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Channels that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {channelsFindUniqueOrThrowArgs} args - Arguments to find a Channels
     * @example
     * // Get one Channels
     * const channels = await prisma.channels.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends channelsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, channelsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Channels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelsFindFirstArgs} args - Arguments to find a Channels
     * @example
     * // Get one Channels
     * const channels = await prisma.channels.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends channelsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, channelsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'channels'> extends True ? Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Channels that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelsFindFirstOrThrowArgs} args - Arguments to find a Channels
     * @example
     * // Get one Channels
     * const channels = await prisma.channels.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends channelsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, channelsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Channels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Channels
     * const channels = await prisma.channels.findMany()
     * 
     * // Get first 10 Channels
     * const channels = await prisma.channels.findMany({ take: 10 })
     * 
     * // Only select the `channel_id`
     * const channelsWithChannel_idOnly = await prisma.channels.findMany({ select: { channel_id: true } })
     * 
    **/
    findMany<T extends channelsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, channelsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Channels.
     * @param {channelsCreateArgs} args - Arguments to create a Channels.
     * @example
     * // Create one Channels
     * const Channels = await prisma.channels.create({
     *   data: {
     *     // ... data to create a Channels
     *   }
     * })
     * 
    **/
    create<T extends channelsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, channelsCreateArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Channels.
     *     @param {channelsCreateManyArgs} args - Arguments to create many Channels.
     *     @example
     *     // Create many Channels
     *     const channels = await prisma.channels.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends channelsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, channelsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Channels.
     * @param {channelsDeleteArgs} args - Arguments to delete one Channels.
     * @example
     * // Delete one Channels
     * const Channels = await prisma.channels.delete({
     *   where: {
     *     // ... filter to delete one Channels
     *   }
     * })
     * 
    **/
    delete<T extends channelsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, channelsDeleteArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Channels.
     * @param {channelsUpdateArgs} args - Arguments to update one Channels.
     * @example
     * // Update one Channels
     * const channels = await prisma.channels.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends channelsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, channelsUpdateArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Channels.
     * @param {channelsDeleteManyArgs} args - Arguments to filter Channels to delete.
     * @example
     * // Delete a few Channels
     * const { count } = await prisma.channels.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends channelsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, channelsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Channels
     * const channels = await prisma.channels.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends channelsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, channelsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Channels.
     * @param {channelsUpsertArgs} args - Arguments to update or create a Channels.
     * @example
     * // Update or create a Channels
     * const channels = await prisma.channels.upsert({
     *   create: {
     *     // ... data to create a Channels
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Channels we want to update
     *   }
     * })
    **/
    upsert<T extends channelsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, channelsUpsertArgs<ExtArgs>>
    ): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelsCountArgs} args - Arguments to filter Channels to count.
     * @example
     * // Count the number of Channels
     * const count = await prisma.channels.count({
     *   where: {
     *     // ... the filter for the Channels we want to count
     *   }
     * })
    **/
    count<T extends channelsCountArgs>(
      args?: Subset<T, channelsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChannelsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChannelsAggregateArgs>(args: Subset<T, ChannelsAggregateArgs>): Prisma.PrismaPromise<GetChannelsAggregateType<T>>

    /**
     * Group by Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelsGroupByArgs} args - Group by arguments.
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
      T extends ChannelsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChannelsGroupByArgs['orderBy'] }
        : { orderBy?: ChannelsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChannelsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for channels.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__channelsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    servers<T extends serversArgs<ExtArgs> = {}>(args?: Subset<T, serversArgs<ExtArgs>>): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    messages<T extends channels$messagesArgs<ExtArgs> = {}>(args?: Subset<T, channels$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findMany', never>| Null>;

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
   * channels base type for findUnique actions
   */
  export type channelsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where: channelsWhereUniqueInput
  }

  /**
   * channels findUnique
   */
  export interface channelsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends channelsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * channels findUniqueOrThrow
   */
  export type channelsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where: channelsWhereUniqueInput
  }


  /**
   * channels base type for findFirst actions
   */
  export type channelsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where?: channelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: Enumerable<channelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channels.
     */
    cursor?: channelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channels.
     */
    distinct?: Enumerable<ChannelsScalarFieldEnum>
  }

  /**
   * channels findFirst
   */
  export interface channelsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends channelsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * channels findFirstOrThrow
   */
  export type channelsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where?: channelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: Enumerable<channelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channels.
     */
    cursor?: channelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channels.
     */
    distinct?: Enumerable<ChannelsScalarFieldEnum>
  }


  /**
   * channels findMany
   */
  export type channelsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where?: channelsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: Enumerable<channelsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing channels.
     */
    cursor?: channelsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    distinct?: Enumerable<ChannelsScalarFieldEnum>
  }


  /**
   * channels create
   */
  export type channelsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * The data needed to create a channels.
     */
    data: XOR<channelsCreateInput, channelsUncheckedCreateInput>
  }


  /**
   * channels createMany
   */
  export type channelsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many channels.
     */
    data: Enumerable<channelsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * channels update
   */
  export type channelsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * The data needed to update a channels.
     */
    data: XOR<channelsUpdateInput, channelsUncheckedUpdateInput>
    /**
     * Choose, which channels to update.
     */
    where: channelsWhereUniqueInput
  }


  /**
   * channels updateMany
   */
  export type channelsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update channels.
     */
    data: XOR<channelsUpdateManyMutationInput, channelsUncheckedUpdateManyInput>
    /**
     * Filter which channels to update
     */
    where?: channelsWhereInput
  }


  /**
   * channels upsert
   */
  export type channelsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * The filter to search for the channels to update in case it exists.
     */
    where: channelsWhereUniqueInput
    /**
     * In case the channels found by the `where` argument doesn't exist, create a new channels with this data.
     */
    create: XOR<channelsCreateInput, channelsUncheckedCreateInput>
    /**
     * In case the channels was found with the provided `where` argument, update it with this data.
     */
    update: XOR<channelsUpdateInput, channelsUncheckedUpdateInput>
  }


  /**
   * channels delete
   */
  export type channelsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
    /**
     * Filter which channels to delete.
     */
    where: channelsWhereUniqueInput
  }


  /**
   * channels deleteMany
   */
  export type channelsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which channels to delete
     */
    where?: channelsWhereInput
  }


  /**
   * channels.messages
   */
  export type channels$messagesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    where?: messagesWhereInput
    orderBy?: Enumerable<messagesOrderByWithRelationInput>
    cursor?: messagesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<MessagesScalarFieldEnum>
  }


  /**
   * channels without action
   */
  export type channelsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channels
     */
    select?: channelsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: channelsInclude<ExtArgs> | null
  }



  /**
   * Model members
   */


  export type AggregateMembers = {
    _count: MembersCountAggregateOutputType | null
    _min: MembersMinAggregateOutputType | null
    _max: MembersMaxAggregateOutputType | null
  }

  export type MembersMinAggregateOutputType = {
    member_id: string | null
    server_id: string | null
    user_id: string | null
    role: string | null
    joined_at: Date | null
  }

  export type MembersMaxAggregateOutputType = {
    member_id: string | null
    server_id: string | null
    user_id: string | null
    role: string | null
    joined_at: Date | null
  }

  export type MembersCountAggregateOutputType = {
    member_id: number
    server_id: number
    user_id: number
    role: number
    joined_at: number
    _all: number
  }


  export type MembersMinAggregateInputType = {
    member_id?: true
    server_id?: true
    user_id?: true
    role?: true
    joined_at?: true
  }

  export type MembersMaxAggregateInputType = {
    member_id?: true
    server_id?: true
    user_id?: true
    role?: true
    joined_at?: true
  }

  export type MembersCountAggregateInputType = {
    member_id?: true
    server_id?: true
    user_id?: true
    role?: true
    joined_at?: true
    _all?: true
  }

  export type MembersAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which members to aggregate.
     */
    where?: membersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of members to fetch.
     */
    orderBy?: Enumerable<membersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: membersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned members
    **/
    _count?: true | MembersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MembersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MembersMaxAggregateInputType
  }

  export type GetMembersAggregateType<T extends MembersAggregateArgs> = {
        [P in keyof T & keyof AggregateMembers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMembers[P]>
      : GetScalarType<T[P], AggregateMembers[P]>
  }




  export type MembersGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: membersWhereInput
    orderBy?: Enumerable<membersOrderByWithAggregationInput>
    by: MembersScalarFieldEnum[]
    having?: membersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MembersCountAggregateInputType | true
    _min?: MembersMinAggregateInputType
    _max?: MembersMaxAggregateInputType
  }


  export type MembersGroupByOutputType = {
    member_id: string
    server_id: string
    user_id: string
    role: string
    joined_at: Date
    _count: MembersCountAggregateOutputType | null
    _min: MembersMinAggregateOutputType | null
    _max: MembersMaxAggregateOutputType | null
  }

  type GetMembersGroupByPayload<T extends MembersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<MembersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MembersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MembersGroupByOutputType[P]>
            : GetScalarType<T[P], MembersGroupByOutputType[P]>
        }
      >
    >


  export type membersSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    member_id?: boolean
    server_id?: boolean
    user_id?: boolean
    role?: boolean
    joined_at?: boolean
    servers?: boolean | serversArgs<ExtArgs>
  }, ExtArgs["result"]["members"]>

  export type membersSelectScalar = {
    member_id?: boolean
    server_id?: boolean
    user_id?: boolean
    role?: boolean
    joined_at?: boolean
  }

  export type membersInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    servers?: boolean | serversArgs<ExtArgs>
  }


  type membersGetPayload<S extends boolean | null | undefined | membersArgs> = $Types.GetResult<membersPayload, S>

  type membersCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<membersFindManyArgs, 'select' | 'include'> & {
      select?: MembersCountAggregateInputType | true
    }

  export interface membersDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['members'], meta: { name: 'members' } }
    /**
     * Find zero or one Members that matches the filter.
     * @param {membersFindUniqueArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends membersFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, membersFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'members'> extends True ? Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Members that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {membersFindUniqueOrThrowArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends membersFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, membersFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {membersFindFirstArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends membersFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, membersFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'members'> extends True ? Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Members that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {membersFindFirstOrThrowArgs} args - Arguments to find a Members
     * @example
     * // Get one Members
     * const members = await prisma.members.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends membersFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, membersFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {membersFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Members
     * const members = await prisma.members.findMany()
     * 
     * // Get first 10 Members
     * const members = await prisma.members.findMany({ take: 10 })
     * 
     * // Only select the `member_id`
     * const membersWithMember_idOnly = await prisma.members.findMany({ select: { member_id: true } })
     * 
    **/
    findMany<T extends membersFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, membersFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<membersPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Members.
     * @param {membersCreateArgs} args - Arguments to create a Members.
     * @example
     * // Create one Members
     * const Members = await prisma.members.create({
     *   data: {
     *     // ... data to create a Members
     *   }
     * })
     * 
    **/
    create<T extends membersCreateArgs<ExtArgs>>(
      args: SelectSubset<T, membersCreateArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Members.
     *     @param {membersCreateManyArgs} args - Arguments to create many Members.
     *     @example
     *     // Create many Members
     *     const members = await prisma.members.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends membersCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, membersCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Members.
     * @param {membersDeleteArgs} args - Arguments to delete one Members.
     * @example
     * // Delete one Members
     * const Members = await prisma.members.delete({
     *   where: {
     *     // ... filter to delete one Members
     *   }
     * })
     * 
    **/
    delete<T extends membersDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, membersDeleteArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Members.
     * @param {membersUpdateArgs} args - Arguments to update one Members.
     * @example
     * // Update one Members
     * const members = await prisma.members.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends membersUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, membersUpdateArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Members.
     * @param {membersDeleteManyArgs} args - Arguments to filter Members to delete.
     * @example
     * // Delete a few Members
     * const { count } = await prisma.members.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends membersDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, membersDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {membersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Members
     * const members = await prisma.members.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends membersUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, membersUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Members.
     * @param {membersUpsertArgs} args - Arguments to update or create a Members.
     * @example
     * // Update or create a Members
     * const members = await prisma.members.upsert({
     *   create: {
     *     // ... data to create a Members
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Members we want to update
     *   }
     * })
    **/
    upsert<T extends membersUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, membersUpsertArgs<ExtArgs>>
    ): Prisma__membersClient<$Types.GetResult<membersPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {membersCountArgs} args - Arguments to filter Members to count.
     * @example
     * // Count the number of Members
     * const count = await prisma.members.count({
     *   where: {
     *     // ... the filter for the Members we want to count
     *   }
     * })
    **/
    count<T extends membersCountArgs>(
      args?: Subset<T, membersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MembersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MembersAggregateArgs>(args: Subset<T, MembersAggregateArgs>): Prisma.PrismaPromise<GetMembersAggregateType<T>>

    /**
     * Group by Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MembersGroupByArgs} args - Group by arguments.
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
      T extends MembersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MembersGroupByArgs['orderBy'] }
        : { orderBy?: MembersGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MembersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMembersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for members.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__membersClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    servers<T extends serversArgs<ExtArgs> = {}>(args?: Subset<T, serversArgs<ExtArgs>>): Prisma__serversClient<$Types.GetResult<serversPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

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
   * members base type for findUnique actions
   */
  export type membersFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter, which members to fetch.
     */
    where: membersWhereUniqueInput
  }

  /**
   * members findUnique
   */
  export interface membersFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends membersFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * members findUniqueOrThrow
   */
  export type membersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter, which members to fetch.
     */
    where: membersWhereUniqueInput
  }


  /**
   * members base type for findFirst actions
   */
  export type membersFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter, which members to fetch.
     */
    where?: membersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of members to fetch.
     */
    orderBy?: Enumerable<membersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for members.
     */
    cursor?: membersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of members.
     */
    distinct?: Enumerable<MembersScalarFieldEnum>
  }

  /**
   * members findFirst
   */
  export interface membersFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends membersFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * members findFirstOrThrow
   */
  export type membersFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter, which members to fetch.
     */
    where?: membersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of members to fetch.
     */
    orderBy?: Enumerable<membersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for members.
     */
    cursor?: membersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of members.
     */
    distinct?: Enumerable<MembersScalarFieldEnum>
  }


  /**
   * members findMany
   */
  export type membersFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter, which members to fetch.
     */
    where?: membersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of members to fetch.
     */
    orderBy?: Enumerable<membersOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing members.
     */
    cursor?: membersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` members.
     */
    skip?: number
    distinct?: Enumerable<MembersScalarFieldEnum>
  }


  /**
   * members create
   */
  export type membersCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * The data needed to create a members.
     */
    data: XOR<membersCreateInput, membersUncheckedCreateInput>
  }


  /**
   * members createMany
   */
  export type membersCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many members.
     */
    data: Enumerable<membersCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * members update
   */
  export type membersUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * The data needed to update a members.
     */
    data: XOR<membersUpdateInput, membersUncheckedUpdateInput>
    /**
     * Choose, which members to update.
     */
    where: membersWhereUniqueInput
  }


  /**
   * members updateMany
   */
  export type membersUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update members.
     */
    data: XOR<membersUpdateManyMutationInput, membersUncheckedUpdateManyInput>
    /**
     * Filter which members to update
     */
    where?: membersWhereInput
  }


  /**
   * members upsert
   */
  export type membersUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * The filter to search for the members to update in case it exists.
     */
    where: membersWhereUniqueInput
    /**
     * In case the members found by the `where` argument doesn't exist, create a new members with this data.
     */
    create: XOR<membersCreateInput, membersUncheckedCreateInput>
    /**
     * In case the members was found with the provided `where` argument, update it with this data.
     */
    update: XOR<membersUpdateInput, membersUncheckedUpdateInput>
  }


  /**
   * members delete
   */
  export type membersDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
    /**
     * Filter which members to delete.
     */
    where: membersWhereUniqueInput
  }


  /**
   * members deleteMany
   */
  export type membersDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which members to delete
     */
    where?: membersWhereInput
  }


  /**
   * members without action
   */
  export type membersArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the members
     */
    select?: membersSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: membersInclude<ExtArgs> | null
  }



  /**
   * Model messages
   */


  export type AggregateMessages = {
    _count: MessagesCountAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  export type MessagesMinAggregateOutputType = {
    message_id: string | null
    channel_id: string | null
    user_id: string | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MessagesMaxAggregateOutputType = {
    message_id: string | null
    channel_id: string | null
    user_id: string | null
    content: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MessagesCountAggregateOutputType = {
    message_id: number
    channel_id: number
    user_id: number
    content: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MessagesMinAggregateInputType = {
    message_id?: true
    channel_id?: true
    user_id?: true
    content?: true
    created_at?: true
    updated_at?: true
  }

  export type MessagesMaxAggregateInputType = {
    message_id?: true
    channel_id?: true
    user_id?: true
    content?: true
    created_at?: true
    updated_at?: true
  }

  export type MessagesCountAggregateInputType = {
    message_id?: true
    channel_id?: true
    user_id?: true
    content?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MessagesAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to aggregate.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: Enumerable<messagesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned messages
    **/
    _count?: true | MessagesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessagesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessagesMaxAggregateInputType
  }

  export type GetMessagesAggregateType<T extends MessagesAggregateArgs> = {
        [P in keyof T & keyof AggregateMessages]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessages[P]>
      : GetScalarType<T[P], AggregateMessages[P]>
  }




  export type MessagesGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: messagesWhereInput
    orderBy?: Enumerable<messagesOrderByWithAggregationInput>
    by: MessagesScalarFieldEnum[]
    having?: messagesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessagesCountAggregateInputType | true
    _min?: MessagesMinAggregateInputType
    _max?: MessagesMaxAggregateInputType
  }


  export type MessagesGroupByOutputType = {
    message_id: string
    channel_id: string
    user_id: string
    content: string
    created_at: Date
    updated_at: Date
    _count: MessagesCountAggregateOutputType | null
    _min: MessagesMinAggregateOutputType | null
    _max: MessagesMaxAggregateOutputType | null
  }

  type GetMessagesGroupByPayload<T extends MessagesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<MessagesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessagesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessagesGroupByOutputType[P]>
            : GetScalarType<T[P], MessagesGroupByOutputType[P]>
        }
      >
    >


  export type messagesSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    message_id?: boolean
    channel_id?: boolean
    user_id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
    channels?: boolean | channelsArgs<ExtArgs>
  }, ExtArgs["result"]["messages"]>

  export type messagesSelectScalar = {
    message_id?: boolean
    channel_id?: boolean
    user_id?: boolean
    content?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type messagesInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    channels?: boolean | channelsArgs<ExtArgs>
  }


  type messagesGetPayload<S extends boolean | null | undefined | messagesArgs> = $Types.GetResult<messagesPayload, S>

  type messagesCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<messagesFindManyArgs, 'select' | 'include'> & {
      select?: MessagesCountAggregateInputType | true
    }

  export interface messagesDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['messages'], meta: { name: 'messages' } }
    /**
     * Find zero or one Messages that matches the filter.
     * @param {messagesFindUniqueArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends messagesFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, messagesFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'messages'> extends True ? Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Messages that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {messagesFindUniqueOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends messagesFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, messagesFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends messagesFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, messagesFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'messages'> extends True ? Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Messages that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindFirstOrThrowArgs} args - Arguments to find a Messages
     * @example
     * // Get one Messages
     * const messages = await prisma.messages.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends messagesFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, messagesFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.messages.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.messages.findMany({ take: 10 })
     * 
     * // Only select the `message_id`
     * const messagesWithMessage_idOnly = await prisma.messages.findMany({ select: { message_id: true } })
     * 
    **/
    findMany<T extends messagesFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, messagesFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<messagesPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Messages.
     * @param {messagesCreateArgs} args - Arguments to create a Messages.
     * @example
     * // Create one Messages
     * const Messages = await prisma.messages.create({
     *   data: {
     *     // ... data to create a Messages
     *   }
     * })
     * 
    **/
    create<T extends messagesCreateArgs<ExtArgs>>(
      args: SelectSubset<T, messagesCreateArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Messages.
     *     @param {messagesCreateManyArgs} args - Arguments to create many Messages.
     *     @example
     *     // Create many Messages
     *     const messages = await prisma.messages.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends messagesCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, messagesCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Messages.
     * @param {messagesDeleteArgs} args - Arguments to delete one Messages.
     * @example
     * // Delete one Messages
     * const Messages = await prisma.messages.delete({
     *   where: {
     *     // ... filter to delete one Messages
     *   }
     * })
     * 
    **/
    delete<T extends messagesDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, messagesDeleteArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Messages.
     * @param {messagesUpdateArgs} args - Arguments to update one Messages.
     * @example
     * // Update one Messages
     * const messages = await prisma.messages.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends messagesUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, messagesUpdateArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Messages.
     * @param {messagesDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.messages.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends messagesDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, messagesDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const messages = await prisma.messages.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends messagesUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, messagesUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Messages.
     * @param {messagesUpsertArgs} args - Arguments to update or create a Messages.
     * @example
     * // Update or create a Messages
     * const messages = await prisma.messages.upsert({
     *   create: {
     *     // ... data to create a Messages
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Messages we want to update
     *   }
     * })
    **/
    upsert<T extends messagesUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, messagesUpsertArgs<ExtArgs>>
    ): Prisma__messagesClient<$Types.GetResult<messagesPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messagesCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.messages.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends messagesCountArgs>(
      args?: Subset<T, messagesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessagesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessagesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessagesAggregateArgs>(args: Subset<T, MessagesAggregateArgs>): Prisma.PrismaPromise<GetMessagesAggregateType<T>>

    /**
     * Group by Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessagesGroupByArgs} args - Group by arguments.
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
      T extends MessagesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessagesGroupByArgs['orderBy'] }
        : { orderBy?: MessagesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MessagesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessagesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for messages.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__messagesClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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

    channels<T extends channelsArgs<ExtArgs> = {}>(args?: Subset<T, channelsArgs<ExtArgs>>): Prisma__channelsClient<$Types.GetResult<channelsPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

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
   * messages base type for findUnique actions
   */
  export type messagesFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }

  /**
   * messages findUnique
   */
  export interface messagesFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends messagesFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * messages findUniqueOrThrow
   */
  export type messagesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where: messagesWhereUniqueInput
  }


  /**
   * messages base type for findFirst actions
   */
  export type messagesFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: Enumerable<messagesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: Enumerable<MessagesScalarFieldEnum>
  }

  /**
   * messages findFirst
   */
  export interface messagesFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends messagesFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * messages findFirstOrThrow
   */
  export type messagesFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: Enumerable<messagesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
     */
    distinct?: Enumerable<MessagesScalarFieldEnum>
  }


  /**
   * messages findMany
   */
  export type messagesFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter, which messages to fetch.
     */
    where?: messagesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
     */
    orderBy?: Enumerable<messagesOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing messages.
     */
    cursor?: messagesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
     */
    skip?: number
    distinct?: Enumerable<MessagesScalarFieldEnum>
  }


  /**
   * messages create
   */
  export type messagesCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to create a messages.
     */
    data: XOR<messagesCreateInput, messagesUncheckedCreateInput>
  }


  /**
   * messages createMany
   */
  export type messagesCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many messages.
     */
    data: Enumerable<messagesCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * messages update
   */
  export type messagesUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The data needed to update a messages.
     */
    data: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
    /**
     * Choose, which messages to update.
     */
    where: messagesWhereUniqueInput
  }


  /**
   * messages updateMany
   */
  export type messagesUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update messages.
     */
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyInput>
    /**
     * Filter which messages to update
     */
    where?: messagesWhereInput
  }


  /**
   * messages upsert
   */
  export type messagesUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * The filter to search for the messages to update in case it exists.
     */
    where: messagesWhereUniqueInput
    /**
     * In case the messages found by the `where` argument doesn't exist, create a new messages with this data.
     */
    create: XOR<messagesCreateInput, messagesUncheckedCreateInput>
    /**
     * In case the messages was found with the provided `where` argument, update it with this data.
     */
    update: XOR<messagesUpdateInput, messagesUncheckedUpdateInput>
  }


  /**
   * messages delete
   */
  export type messagesDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
    /**
     * Filter which messages to delete.
     */
    where: messagesWhereUniqueInput
  }


  /**
   * messages deleteMany
   */
  export type messagesDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which messages to delete
     */
    where?: messagesWhereInput
  }


  /**
   * messages without action
   */
  export type messagesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the messages
     */
    select?: messagesSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: messagesInclude<ExtArgs> | null
  }



  /**
   * Model presence
   */


  export type AggregatePresence = {
    _count: PresenceCountAggregateOutputType | null
    _min: PresenceMinAggregateOutputType | null
    _max: PresenceMaxAggregateOutputType | null
  }

  export type PresenceMinAggregateOutputType = {
    presence_id: string | null
    user_id: string | null
    status: string | null
    last_seen: Date | null
    created_at: Date | null
  }

  export type PresenceMaxAggregateOutputType = {
    presence_id: string | null
    user_id: string | null
    status: string | null
    last_seen: Date | null
    created_at: Date | null
  }

  export type PresenceCountAggregateOutputType = {
    presence_id: number
    user_id: number
    status: number
    last_seen: number
    created_at: number
    _all: number
  }


  export type PresenceMinAggregateInputType = {
    presence_id?: true
    user_id?: true
    status?: true
    last_seen?: true
    created_at?: true
  }

  export type PresenceMaxAggregateInputType = {
    presence_id?: true
    user_id?: true
    status?: true
    last_seen?: true
    created_at?: true
  }

  export type PresenceCountAggregateInputType = {
    presence_id?: true
    user_id?: true
    status?: true
    last_seen?: true
    created_at?: true
    _all?: true
  }

  export type PresenceAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which presence to aggregate.
     */
    where?: presenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of presences to fetch.
     */
    orderBy?: Enumerable<presenceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: presenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` presences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` presences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned presences
    **/
    _count?: true | PresenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PresenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PresenceMaxAggregateInputType
  }

  export type GetPresenceAggregateType<T extends PresenceAggregateArgs> = {
        [P in keyof T & keyof AggregatePresence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePresence[P]>
      : GetScalarType<T[P], AggregatePresence[P]>
  }




  export type PresenceGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: presenceWhereInput
    orderBy?: Enumerable<presenceOrderByWithAggregationInput>
    by: PresenceScalarFieldEnum[]
    having?: presenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PresenceCountAggregateInputType | true
    _min?: PresenceMinAggregateInputType
    _max?: PresenceMaxAggregateInputType
  }


  export type PresenceGroupByOutputType = {
    presence_id: string
    user_id: string
    status: string
    last_seen: Date | null
    created_at: Date
    _count: PresenceCountAggregateOutputType | null
    _min: PresenceMinAggregateOutputType | null
    _max: PresenceMaxAggregateOutputType | null
  }

  type GetPresenceGroupByPayload<T extends PresenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<PresenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PresenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PresenceGroupByOutputType[P]>
            : GetScalarType<T[P], PresenceGroupByOutputType[P]>
        }
      >
    >


  export type presenceSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    presence_id?: boolean
    user_id?: boolean
    status?: boolean
    last_seen?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["presence"]>

  export type presenceSelectScalar = {
    presence_id?: boolean
    user_id?: boolean
    status?: boolean
    last_seen?: boolean
    created_at?: boolean
  }


  type presenceGetPayload<S extends boolean | null | undefined | presenceArgs> = $Types.GetResult<presencePayload, S>

  type presenceCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<presenceFindManyArgs, 'select' | 'include'> & {
      select?: PresenceCountAggregateInputType | true
    }

  export interface presenceDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['presence'], meta: { name: 'presence' } }
    /**
     * Find zero or one Presence that matches the filter.
     * @param {presenceFindUniqueArgs} args - Arguments to find a Presence
     * @example
     * // Get one Presence
     * const presence = await prisma.presence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends presenceFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, presenceFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'presence'> extends True ? Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Presence that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {presenceFindUniqueOrThrowArgs} args - Arguments to find a Presence
     * @example
     * // Get one Presence
     * const presence = await prisma.presence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends presenceFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, presenceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Presence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {presenceFindFirstArgs} args - Arguments to find a Presence
     * @example
     * // Get one Presence
     * const presence = await prisma.presence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends presenceFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, presenceFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'presence'> extends True ? Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Presence that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {presenceFindFirstOrThrowArgs} args - Arguments to find a Presence
     * @example
     * // Get one Presence
     * const presence = await prisma.presence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends presenceFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, presenceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Presences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {presenceFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Presences
     * const presences = await prisma.presence.findMany()
     * 
     * // Get first 10 Presences
     * const presences = await prisma.presence.findMany({ take: 10 })
     * 
     * // Only select the `presence_id`
     * const presenceWithPresence_idOnly = await prisma.presence.findMany({ select: { presence_id: true } })
     * 
    **/
    findMany<T extends presenceFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, presenceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<presencePayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Presence.
     * @param {presenceCreateArgs} args - Arguments to create a Presence.
     * @example
     * // Create one Presence
     * const Presence = await prisma.presence.create({
     *   data: {
     *     // ... data to create a Presence
     *   }
     * })
     * 
    **/
    create<T extends presenceCreateArgs<ExtArgs>>(
      args: SelectSubset<T, presenceCreateArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Presences.
     *     @param {presenceCreateManyArgs} args - Arguments to create many Presences.
     *     @example
     *     // Create many Presences
     *     const presence = await prisma.presence.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends presenceCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, presenceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Presence.
     * @param {presenceDeleteArgs} args - Arguments to delete one Presence.
     * @example
     * // Delete one Presence
     * const Presence = await prisma.presence.delete({
     *   where: {
     *     // ... filter to delete one Presence
     *   }
     * })
     * 
    **/
    delete<T extends presenceDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, presenceDeleteArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Presence.
     * @param {presenceUpdateArgs} args - Arguments to update one Presence.
     * @example
     * // Update one Presence
     * const presence = await prisma.presence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends presenceUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, presenceUpdateArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Presences.
     * @param {presenceDeleteManyArgs} args - Arguments to filter Presences to delete.
     * @example
     * // Delete a few Presences
     * const { count } = await prisma.presence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends presenceDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, presenceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Presences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {presenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Presences
     * const presence = await prisma.presence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends presenceUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, presenceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Presence.
     * @param {presenceUpsertArgs} args - Arguments to update or create a Presence.
     * @example
     * // Update or create a Presence
     * const presence = await prisma.presence.upsert({
     *   create: {
     *     // ... data to create a Presence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Presence we want to update
     *   }
     * })
    **/
    upsert<T extends presenceUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, presenceUpsertArgs<ExtArgs>>
    ): Prisma__presenceClient<$Types.GetResult<presencePayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Presences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {presenceCountArgs} args - Arguments to filter Presences to count.
     * @example
     * // Count the number of Presences
     * const count = await prisma.presence.count({
     *   where: {
     *     // ... the filter for the Presences we want to count
     *   }
     * })
    **/
    count<T extends presenceCountArgs>(
      args?: Subset<T, presenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PresenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Presence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PresenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PresenceAggregateArgs>(args: Subset<T, PresenceAggregateArgs>): Prisma.PrismaPromise<GetPresenceAggregateType<T>>

    /**
     * Group by Presence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PresenceGroupByArgs} args - Group by arguments.
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
      T extends PresenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PresenceGroupByArgs['orderBy'] }
        : { orderBy?: PresenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PresenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPresenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for presence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__presenceClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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
   * presence base type for findUnique actions
   */
  export type presenceFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter, which presence to fetch.
     */
    where: presenceWhereUniqueInput
  }

  /**
   * presence findUnique
   */
  export interface presenceFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends presenceFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * presence findUniqueOrThrow
   */
  export type presenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter, which presence to fetch.
     */
    where: presenceWhereUniqueInput
  }


  /**
   * presence base type for findFirst actions
   */
  export type presenceFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter, which presence to fetch.
     */
    where?: presenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of presences to fetch.
     */
    orderBy?: Enumerable<presenceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for presences.
     */
    cursor?: presenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` presences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` presences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of presences.
     */
    distinct?: Enumerable<PresenceScalarFieldEnum>
  }

  /**
   * presence findFirst
   */
  export interface presenceFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends presenceFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * presence findFirstOrThrow
   */
  export type presenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter, which presence to fetch.
     */
    where?: presenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of presences to fetch.
     */
    orderBy?: Enumerable<presenceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for presences.
     */
    cursor?: presenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` presences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` presences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of presences.
     */
    distinct?: Enumerable<PresenceScalarFieldEnum>
  }


  /**
   * presence findMany
   */
  export type presenceFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter, which presences to fetch.
     */
    where?: presenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of presences to fetch.
     */
    orderBy?: Enumerable<presenceOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing presences.
     */
    cursor?: presenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` presences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` presences.
     */
    skip?: number
    distinct?: Enumerable<PresenceScalarFieldEnum>
  }


  /**
   * presence create
   */
  export type presenceCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * The data needed to create a presence.
     */
    data: XOR<presenceCreateInput, presenceUncheckedCreateInput>
  }


  /**
   * presence createMany
   */
  export type presenceCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many presences.
     */
    data: Enumerable<presenceCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * presence update
   */
  export type presenceUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * The data needed to update a presence.
     */
    data: XOR<presenceUpdateInput, presenceUncheckedUpdateInput>
    /**
     * Choose, which presence to update.
     */
    where: presenceWhereUniqueInput
  }


  /**
   * presence updateMany
   */
  export type presenceUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update presences.
     */
    data: XOR<presenceUpdateManyMutationInput, presenceUncheckedUpdateManyInput>
    /**
     * Filter which presences to update
     */
    where?: presenceWhereInput
  }


  /**
   * presence upsert
   */
  export type presenceUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * The filter to search for the presence to update in case it exists.
     */
    where: presenceWhereUniqueInput
    /**
     * In case the presence found by the `where` argument doesn't exist, create a new presence with this data.
     */
    create: XOR<presenceCreateInput, presenceUncheckedCreateInput>
    /**
     * In case the presence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<presenceUpdateInput, presenceUncheckedUpdateInput>
  }


  /**
   * presence delete
   */
  export type presenceDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
    /**
     * Filter which presence to delete.
     */
    where: presenceWhereUniqueInput
  }


  /**
   * presence deleteMany
   */
  export type presenceDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which presences to delete
     */
    where?: presenceWhereInput
  }


  /**
   * presence without action
   */
  export type presenceArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the presence
     */
    select?: presenceSelect<ExtArgs> | null
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


  export const ServersScalarFieldEnum: {
    server_id: 'server_id',
    name: 'name',
    description: 'description',
    owner_id: 'owner_id',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ServersScalarFieldEnum = (typeof ServersScalarFieldEnum)[keyof typeof ServersScalarFieldEnum]


  export const ChannelsScalarFieldEnum: {
    channel_id: 'channel_id',
    server_id: 'server_id',
    name: 'name',
    type: 'type',
    topic: 'topic',
    position: 'position',
    created_at: 'created_at'
  };

  export type ChannelsScalarFieldEnum = (typeof ChannelsScalarFieldEnum)[keyof typeof ChannelsScalarFieldEnum]


  export const MembersScalarFieldEnum: {
    member_id: 'member_id',
    server_id: 'server_id',
    user_id: 'user_id',
    role: 'role',
    joined_at: 'joined_at'
  };

  export type MembersScalarFieldEnum = (typeof MembersScalarFieldEnum)[keyof typeof MembersScalarFieldEnum]


  export const MessagesScalarFieldEnum: {
    message_id: 'message_id',
    channel_id: 'channel_id',
    user_id: 'user_id',
    content: 'content',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MessagesScalarFieldEnum = (typeof MessagesScalarFieldEnum)[keyof typeof MessagesScalarFieldEnum]


  export const PresenceScalarFieldEnum: {
    presence_id: 'presence_id',
    user_id: 'user_id',
    status: 'status',
    last_seen: 'last_seen',
    created_at: 'created_at'
  };

  export type PresenceScalarFieldEnum = (typeof PresenceScalarFieldEnum)[keyof typeof PresenceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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


  /**
   * Deep Input Types
   */


  export type serversWhereInput = {
    AND?: Enumerable<serversWhereInput>
    OR?: Enumerable<serversWhereInput>
    NOT?: Enumerable<serversWhereInput>
    server_id?: UuidFilter | string
    name?: StringFilter | string
    description?: StringNullableFilter | string | null
    owner_id?: UuidFilter | string
    created_at?: DateTimeFilter | Date | string
    updated_at?: DateTimeFilter | Date | string
    channels?: ChannelsListRelationFilter
    members?: MembersListRelationFilter
  }

  export type serversOrderByWithRelationInput = {
    server_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    owner_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    channels?: channelsOrderByRelationAggregateInput
    members?: membersOrderByRelationAggregateInput
  }

  export type serversWhereUniqueInput = {
    server_id?: string
  }

  export type serversOrderByWithAggregationInput = {
    server_id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    owner_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: serversCountOrderByAggregateInput
    _max?: serversMaxOrderByAggregateInput
    _min?: serversMinOrderByAggregateInput
  }

  export type serversScalarWhereWithAggregatesInput = {
    AND?: Enumerable<serversScalarWhereWithAggregatesInput>
    OR?: Enumerable<serversScalarWhereWithAggregatesInput>
    NOT?: Enumerable<serversScalarWhereWithAggregatesInput>
    server_id?: UuidWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    description?: StringNullableWithAggregatesFilter | string | null
    owner_id?: UuidWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
    updated_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type channelsWhereInput = {
    AND?: Enumerable<channelsWhereInput>
    OR?: Enumerable<channelsWhereInput>
    NOT?: Enumerable<channelsWhereInput>
    channel_id?: UuidFilter | string
    server_id?: UuidFilter | string
    name?: StringFilter | string
    type?: StringFilter | string
    topic?: StringNullableFilter | string | null
    position?: IntNullableFilter | number | null
    created_at?: DateTimeFilter | Date | string
    servers?: XOR<ServersRelationFilter, serversWhereInput>
    messages?: MessagesListRelationFilter
  }

  export type channelsOrderByWithRelationInput = {
    channel_id?: SortOrder
    server_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    topic?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    created_at?: SortOrder
    servers?: serversOrderByWithRelationInput
    messages?: messagesOrderByRelationAggregateInput
  }

  export type channelsWhereUniqueInput = {
    channel_id?: string
    server_id_name?: channelsServer_idNameCompoundUniqueInput
  }

  export type channelsOrderByWithAggregationInput = {
    channel_id?: SortOrder
    server_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    topic?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: channelsCountOrderByAggregateInput
    _avg?: channelsAvgOrderByAggregateInput
    _max?: channelsMaxOrderByAggregateInput
    _min?: channelsMinOrderByAggregateInput
    _sum?: channelsSumOrderByAggregateInput
  }

  export type channelsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<channelsScalarWhereWithAggregatesInput>
    OR?: Enumerable<channelsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<channelsScalarWhereWithAggregatesInput>
    channel_id?: UuidWithAggregatesFilter | string
    server_id?: UuidWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    type?: StringWithAggregatesFilter | string
    topic?: StringNullableWithAggregatesFilter | string | null
    position?: IntNullableWithAggregatesFilter | number | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type membersWhereInput = {
    AND?: Enumerable<membersWhereInput>
    OR?: Enumerable<membersWhereInput>
    NOT?: Enumerable<membersWhereInput>
    member_id?: UuidFilter | string
    server_id?: UuidFilter | string
    user_id?: UuidFilter | string
    role?: StringFilter | string
    joined_at?: DateTimeFilter | Date | string
    servers?: XOR<ServersRelationFilter, serversWhereInput>
  }

  export type membersOrderByWithRelationInput = {
    member_id?: SortOrder
    server_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    servers?: serversOrderByWithRelationInput
  }

  export type membersWhereUniqueInput = {
    member_id?: string
    server_id_user_id?: membersServer_idUser_idCompoundUniqueInput
  }

  export type membersOrderByWithAggregationInput = {
    member_id?: SortOrder
    server_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
    _count?: membersCountOrderByAggregateInput
    _max?: membersMaxOrderByAggregateInput
    _min?: membersMinOrderByAggregateInput
  }

  export type membersScalarWhereWithAggregatesInput = {
    AND?: Enumerable<membersScalarWhereWithAggregatesInput>
    OR?: Enumerable<membersScalarWhereWithAggregatesInput>
    NOT?: Enumerable<membersScalarWhereWithAggregatesInput>
    member_id?: UuidWithAggregatesFilter | string
    server_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    role?: StringWithAggregatesFilter | string
    joined_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type messagesWhereInput = {
    AND?: Enumerable<messagesWhereInput>
    OR?: Enumerable<messagesWhereInput>
    NOT?: Enumerable<messagesWhereInput>
    message_id?: UuidFilter | string
    channel_id?: UuidFilter | string
    user_id?: UuidFilter | string
    content?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    updated_at?: DateTimeFilter | Date | string
    channels?: XOR<ChannelsRelationFilter, channelsWhereInput>
  }

  export type messagesOrderByWithRelationInput = {
    message_id?: SortOrder
    channel_id?: SortOrder
    user_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    channels?: channelsOrderByWithRelationInput
  }

  export type messagesWhereUniqueInput = {
    message_id?: string
  }

  export type messagesOrderByWithAggregationInput = {
    message_id?: SortOrder
    channel_id?: SortOrder
    user_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: messagesCountOrderByAggregateInput
    _max?: messagesMaxOrderByAggregateInput
    _min?: messagesMinOrderByAggregateInput
  }

  export type messagesScalarWhereWithAggregatesInput = {
    AND?: Enumerable<messagesScalarWhereWithAggregatesInput>
    OR?: Enumerable<messagesScalarWhereWithAggregatesInput>
    NOT?: Enumerable<messagesScalarWhereWithAggregatesInput>
    message_id?: UuidWithAggregatesFilter | string
    channel_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    content?: StringWithAggregatesFilter | string
    created_at?: DateTimeWithAggregatesFilter | Date | string
    updated_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type presenceWhereInput = {
    AND?: Enumerable<presenceWhereInput>
    OR?: Enumerable<presenceWhereInput>
    NOT?: Enumerable<presenceWhereInput>
    presence_id?: UuidFilter | string
    user_id?: UuidFilter | string
    status?: StringFilter | string
    last_seen?: DateTimeNullableFilter | Date | string | null
    created_at?: DateTimeFilter | Date | string
  }

  export type presenceOrderByWithRelationInput = {
    presence_id?: SortOrder
    user_id?: SortOrder
    status?: SortOrder
    last_seen?: SortOrderInput | SortOrder
    created_at?: SortOrder
  }

  export type presenceWhereUniqueInput = {
    presence_id?: string
  }

  export type presenceOrderByWithAggregationInput = {
    presence_id?: SortOrder
    user_id?: SortOrder
    status?: SortOrder
    last_seen?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: presenceCountOrderByAggregateInput
    _max?: presenceMaxOrderByAggregateInput
    _min?: presenceMinOrderByAggregateInput
  }

  export type presenceScalarWhereWithAggregatesInput = {
    AND?: Enumerable<presenceScalarWhereWithAggregatesInput>
    OR?: Enumerable<presenceScalarWhereWithAggregatesInput>
    NOT?: Enumerable<presenceScalarWhereWithAggregatesInput>
    presence_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    status?: StringWithAggregatesFilter | string
    last_seen?: DateTimeNullableWithAggregatesFilter | Date | string | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type serversCreateInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    channels?: channelsCreateNestedManyWithoutServersInput
    members?: membersCreateNestedManyWithoutServersInput
  }

  export type serversUncheckedCreateInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    channels?: channelsUncheckedCreateNestedManyWithoutServersInput
    members?: membersUncheckedCreateNestedManyWithoutServersInput
  }

  export type serversUpdateInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    channels?: channelsUpdateManyWithoutServersNestedInput
    members?: membersUpdateManyWithoutServersNestedInput
  }

  export type serversUncheckedUpdateInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    channels?: channelsUncheckedUpdateManyWithoutServersNestedInput
    members?: membersUncheckedUpdateManyWithoutServersNestedInput
  }

  export type serversCreateManyInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type serversUpdateManyMutationInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type serversUncheckedUpdateManyInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type channelsCreateInput = {
    channel_id?: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
    servers: serversCreateNestedOneWithoutChannelsInput
    messages?: messagesCreateNestedManyWithoutChannelsInput
  }

  export type channelsUncheckedCreateInput = {
    channel_id?: string
    server_id: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
    messages?: messagesUncheckedCreateNestedManyWithoutChannelsInput
  }

  export type channelsUpdateInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    servers?: serversUpdateOneRequiredWithoutChannelsNestedInput
    messages?: messagesUpdateManyWithoutChannelsNestedInput
  }

  export type channelsUncheckedUpdateInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: messagesUncheckedUpdateManyWithoutChannelsNestedInput
  }

  export type channelsCreateManyInput = {
    channel_id?: string
    server_id: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
  }

  export type channelsUpdateManyMutationInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type channelsUncheckedUpdateManyInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersCreateInput = {
    member_id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
    servers: serversCreateNestedOneWithoutMembersInput
  }

  export type membersUncheckedCreateInput = {
    member_id?: string
    server_id: string
    user_id: string
    role?: string
    joined_at?: Date | string
  }

  export type membersUpdateInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    servers?: serversUpdateOneRequiredWithoutMembersNestedInput
  }

  export type membersUncheckedUpdateInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    server_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersCreateManyInput = {
    member_id?: string
    server_id: string
    user_id: string
    role?: string
    joined_at?: Date | string
  }

  export type membersUpdateManyMutationInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersUncheckedUpdateManyInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    server_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesCreateInput = {
    message_id?: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
    channels: channelsCreateNestedOneWithoutMessagesInput
  }

  export type messagesUncheckedCreateInput = {
    message_id?: string
    channel_id: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type messagesUpdateInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    channels?: channelsUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type messagesUncheckedUpdateInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesCreateManyInput = {
    message_id?: string
    channel_id: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type messagesUpdateManyMutationInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateManyInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    channel_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type presenceCreateInput = {
    presence_id?: string
    user_id: string
    status?: string
    last_seen?: Date | string | null
    created_at?: Date | string
  }

  export type presenceUncheckedCreateInput = {
    presence_id?: string
    user_id: string
    status?: string
    last_seen?: Date | string | null
    created_at?: Date | string
  }

  export type presenceUpdateInput = {
    presence_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type presenceUncheckedUpdateInput = {
    presence_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type presenceCreateManyInput = {
    presence_id?: string
    user_id: string
    status?: string
    last_seen?: Date | string | null
    created_at?: Date | string
  }

  export type presenceUpdateManyMutationInput = {
    presence_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type presenceUncheckedUpdateManyInput = {
    presence_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    last_seen?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ChannelsListRelationFilter = {
    every?: channelsWhereInput
    some?: channelsWhereInput
    none?: channelsWhereInput
  }

  export type MembersListRelationFilter = {
    every?: membersWhereInput
    some?: membersWhereInput
    none?: membersWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type channelsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type membersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type serversCountOrderByAggregateInput = {
    server_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type serversMaxOrderByAggregateInput = {
    server_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type serversMinOrderByAggregateInput = {
    server_id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    owner_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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

  export type ServersRelationFilter = {
    is?: serversWhereInput | null
    isNot?: serversWhereInput | null
  }

  export type MessagesListRelationFilter = {
    every?: messagesWhereInput
    some?: messagesWhereInput
    none?: messagesWhereInput
  }

  export type messagesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type channelsServer_idNameCompoundUniqueInput = {
    server_id: string
    name: string
  }

  export type channelsCountOrderByAggregateInput = {
    channel_id?: SortOrder
    server_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    topic?: SortOrder
    position?: SortOrder
    created_at?: SortOrder
  }

  export type channelsAvgOrderByAggregateInput = {
    position?: SortOrder
  }

  export type channelsMaxOrderByAggregateInput = {
    channel_id?: SortOrder
    server_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    topic?: SortOrder
    position?: SortOrder
    created_at?: SortOrder
  }

  export type channelsMinOrderByAggregateInput = {
    channel_id?: SortOrder
    server_id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    topic?: SortOrder
    position?: SortOrder
    created_at?: SortOrder
  }

  export type channelsSumOrderByAggregateInput = {
    position?: SortOrder
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

  export type membersServer_idUser_idCompoundUniqueInput = {
    server_id: string
    user_id: string
  }

  export type membersCountOrderByAggregateInput = {
    member_id?: SortOrder
    server_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
  }

  export type membersMaxOrderByAggregateInput = {
    member_id?: SortOrder
    server_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
  }

  export type membersMinOrderByAggregateInput = {
    member_id?: SortOrder
    server_id?: SortOrder
    user_id?: SortOrder
    role?: SortOrder
    joined_at?: SortOrder
  }

  export type ChannelsRelationFilter = {
    is?: channelsWhereInput | null
    isNot?: channelsWhereInput | null
  }

  export type messagesCountOrderByAggregateInput = {
    message_id?: SortOrder
    channel_id?: SortOrder
    user_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type messagesMaxOrderByAggregateInput = {
    message_id?: SortOrder
    channel_id?: SortOrder
    user_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type messagesMinOrderByAggregateInput = {
    message_id?: SortOrder
    channel_id?: SortOrder
    user_id?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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

  export type presenceCountOrderByAggregateInput = {
    presence_id?: SortOrder
    user_id?: SortOrder
    status?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
  }

  export type presenceMaxOrderByAggregateInput = {
    presence_id?: SortOrder
    user_id?: SortOrder
    status?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
  }

  export type presenceMinOrderByAggregateInput = {
    presence_id?: SortOrder
    user_id?: SortOrder
    status?: SortOrder
    last_seen?: SortOrder
    created_at?: SortOrder
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

  export type channelsCreateNestedManyWithoutServersInput = {
    create?: XOR<Enumerable<channelsCreateWithoutServersInput>, Enumerable<channelsUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<channelsCreateOrConnectWithoutServersInput>
    createMany?: channelsCreateManyServersInputEnvelope
    connect?: Enumerable<channelsWhereUniqueInput>
  }

  export type membersCreateNestedManyWithoutServersInput = {
    create?: XOR<Enumerable<membersCreateWithoutServersInput>, Enumerable<membersUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<membersCreateOrConnectWithoutServersInput>
    createMany?: membersCreateManyServersInputEnvelope
    connect?: Enumerable<membersWhereUniqueInput>
  }

  export type channelsUncheckedCreateNestedManyWithoutServersInput = {
    create?: XOR<Enumerable<channelsCreateWithoutServersInput>, Enumerable<channelsUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<channelsCreateOrConnectWithoutServersInput>
    createMany?: channelsCreateManyServersInputEnvelope
    connect?: Enumerable<channelsWhereUniqueInput>
  }

  export type membersUncheckedCreateNestedManyWithoutServersInput = {
    create?: XOR<Enumerable<membersCreateWithoutServersInput>, Enumerable<membersUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<membersCreateOrConnectWithoutServersInput>
    createMany?: membersCreateManyServersInputEnvelope
    connect?: Enumerable<membersWhereUniqueInput>
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

  export type channelsUpdateManyWithoutServersNestedInput = {
    create?: XOR<Enumerable<channelsCreateWithoutServersInput>, Enumerable<channelsUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<channelsCreateOrConnectWithoutServersInput>
    upsert?: Enumerable<channelsUpsertWithWhereUniqueWithoutServersInput>
    createMany?: channelsCreateManyServersInputEnvelope
    set?: Enumerable<channelsWhereUniqueInput>
    disconnect?: Enumerable<channelsWhereUniqueInput>
    delete?: Enumerable<channelsWhereUniqueInput>
    connect?: Enumerable<channelsWhereUniqueInput>
    update?: Enumerable<channelsUpdateWithWhereUniqueWithoutServersInput>
    updateMany?: Enumerable<channelsUpdateManyWithWhereWithoutServersInput>
    deleteMany?: Enumerable<channelsScalarWhereInput>
  }

  export type membersUpdateManyWithoutServersNestedInput = {
    create?: XOR<Enumerable<membersCreateWithoutServersInput>, Enumerable<membersUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<membersCreateOrConnectWithoutServersInput>
    upsert?: Enumerable<membersUpsertWithWhereUniqueWithoutServersInput>
    createMany?: membersCreateManyServersInputEnvelope
    set?: Enumerable<membersWhereUniqueInput>
    disconnect?: Enumerable<membersWhereUniqueInput>
    delete?: Enumerable<membersWhereUniqueInput>
    connect?: Enumerable<membersWhereUniqueInput>
    update?: Enumerable<membersUpdateWithWhereUniqueWithoutServersInput>
    updateMany?: Enumerable<membersUpdateManyWithWhereWithoutServersInput>
    deleteMany?: Enumerable<membersScalarWhereInput>
  }

  export type channelsUncheckedUpdateManyWithoutServersNestedInput = {
    create?: XOR<Enumerable<channelsCreateWithoutServersInput>, Enumerable<channelsUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<channelsCreateOrConnectWithoutServersInput>
    upsert?: Enumerable<channelsUpsertWithWhereUniqueWithoutServersInput>
    createMany?: channelsCreateManyServersInputEnvelope
    set?: Enumerable<channelsWhereUniqueInput>
    disconnect?: Enumerable<channelsWhereUniqueInput>
    delete?: Enumerable<channelsWhereUniqueInput>
    connect?: Enumerable<channelsWhereUniqueInput>
    update?: Enumerable<channelsUpdateWithWhereUniqueWithoutServersInput>
    updateMany?: Enumerable<channelsUpdateManyWithWhereWithoutServersInput>
    deleteMany?: Enumerable<channelsScalarWhereInput>
  }

  export type membersUncheckedUpdateManyWithoutServersNestedInput = {
    create?: XOR<Enumerable<membersCreateWithoutServersInput>, Enumerable<membersUncheckedCreateWithoutServersInput>>
    connectOrCreate?: Enumerable<membersCreateOrConnectWithoutServersInput>
    upsert?: Enumerable<membersUpsertWithWhereUniqueWithoutServersInput>
    createMany?: membersCreateManyServersInputEnvelope
    set?: Enumerable<membersWhereUniqueInput>
    disconnect?: Enumerable<membersWhereUniqueInput>
    delete?: Enumerable<membersWhereUniqueInput>
    connect?: Enumerable<membersWhereUniqueInput>
    update?: Enumerable<membersUpdateWithWhereUniqueWithoutServersInput>
    updateMany?: Enumerable<membersUpdateManyWithWhereWithoutServersInput>
    deleteMany?: Enumerable<membersScalarWhereInput>
  }

  export type serversCreateNestedOneWithoutChannelsInput = {
    create?: XOR<serversCreateWithoutChannelsInput, serversUncheckedCreateWithoutChannelsInput>
    connectOrCreate?: serversCreateOrConnectWithoutChannelsInput
    connect?: serversWhereUniqueInput
  }

  export type messagesCreateNestedManyWithoutChannelsInput = {
    create?: XOR<Enumerable<messagesCreateWithoutChannelsInput>, Enumerable<messagesUncheckedCreateWithoutChannelsInput>>
    connectOrCreate?: Enumerable<messagesCreateOrConnectWithoutChannelsInput>
    createMany?: messagesCreateManyChannelsInputEnvelope
    connect?: Enumerable<messagesWhereUniqueInput>
  }

  export type messagesUncheckedCreateNestedManyWithoutChannelsInput = {
    create?: XOR<Enumerable<messagesCreateWithoutChannelsInput>, Enumerable<messagesUncheckedCreateWithoutChannelsInput>>
    connectOrCreate?: Enumerable<messagesCreateOrConnectWithoutChannelsInput>
    createMany?: messagesCreateManyChannelsInputEnvelope
    connect?: Enumerable<messagesWhereUniqueInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type serversUpdateOneRequiredWithoutChannelsNestedInput = {
    create?: XOR<serversCreateWithoutChannelsInput, serversUncheckedCreateWithoutChannelsInput>
    connectOrCreate?: serversCreateOrConnectWithoutChannelsInput
    upsert?: serversUpsertWithoutChannelsInput
    connect?: serversWhereUniqueInput
    update?: XOR<serversUpdateWithoutChannelsInput, serversUncheckedUpdateWithoutChannelsInput>
  }

  export type messagesUpdateManyWithoutChannelsNestedInput = {
    create?: XOR<Enumerable<messagesCreateWithoutChannelsInput>, Enumerable<messagesUncheckedCreateWithoutChannelsInput>>
    connectOrCreate?: Enumerable<messagesCreateOrConnectWithoutChannelsInput>
    upsert?: Enumerable<messagesUpsertWithWhereUniqueWithoutChannelsInput>
    createMany?: messagesCreateManyChannelsInputEnvelope
    set?: Enumerable<messagesWhereUniqueInput>
    disconnect?: Enumerable<messagesWhereUniqueInput>
    delete?: Enumerable<messagesWhereUniqueInput>
    connect?: Enumerable<messagesWhereUniqueInput>
    update?: Enumerable<messagesUpdateWithWhereUniqueWithoutChannelsInput>
    updateMany?: Enumerable<messagesUpdateManyWithWhereWithoutChannelsInput>
    deleteMany?: Enumerable<messagesScalarWhereInput>
  }

  export type messagesUncheckedUpdateManyWithoutChannelsNestedInput = {
    create?: XOR<Enumerable<messagesCreateWithoutChannelsInput>, Enumerable<messagesUncheckedCreateWithoutChannelsInput>>
    connectOrCreate?: Enumerable<messagesCreateOrConnectWithoutChannelsInput>
    upsert?: Enumerable<messagesUpsertWithWhereUniqueWithoutChannelsInput>
    createMany?: messagesCreateManyChannelsInputEnvelope
    set?: Enumerable<messagesWhereUniqueInput>
    disconnect?: Enumerable<messagesWhereUniqueInput>
    delete?: Enumerable<messagesWhereUniqueInput>
    connect?: Enumerable<messagesWhereUniqueInput>
    update?: Enumerable<messagesUpdateWithWhereUniqueWithoutChannelsInput>
    updateMany?: Enumerable<messagesUpdateManyWithWhereWithoutChannelsInput>
    deleteMany?: Enumerable<messagesScalarWhereInput>
  }

  export type serversCreateNestedOneWithoutMembersInput = {
    create?: XOR<serversCreateWithoutMembersInput, serversUncheckedCreateWithoutMembersInput>
    connectOrCreate?: serversCreateOrConnectWithoutMembersInput
    connect?: serversWhereUniqueInput
  }

  export type serversUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<serversCreateWithoutMembersInput, serversUncheckedCreateWithoutMembersInput>
    connectOrCreate?: serversCreateOrConnectWithoutMembersInput
    upsert?: serversUpsertWithoutMembersInput
    connect?: serversWhereUniqueInput
    update?: XOR<serversUpdateWithoutMembersInput, serversUncheckedUpdateWithoutMembersInput>
  }

  export type channelsCreateNestedOneWithoutMessagesInput = {
    create?: XOR<channelsCreateWithoutMessagesInput, channelsUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: channelsCreateOrConnectWithoutMessagesInput
    connect?: channelsWhereUniqueInput
  }

  export type channelsUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<channelsCreateWithoutMessagesInput, channelsUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: channelsCreateOrConnectWithoutMessagesInput
    upsert?: channelsUpsertWithoutMessagesInput
    connect?: channelsWhereUniqueInput
    update?: XOR<channelsUpdateWithoutMessagesInput, channelsUncheckedUpdateWithoutMessagesInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type channelsCreateWithoutServersInput = {
    channel_id?: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
    messages?: messagesCreateNestedManyWithoutChannelsInput
  }

  export type channelsUncheckedCreateWithoutServersInput = {
    channel_id?: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
    messages?: messagesUncheckedCreateNestedManyWithoutChannelsInput
  }

  export type channelsCreateOrConnectWithoutServersInput = {
    where: channelsWhereUniqueInput
    create: XOR<channelsCreateWithoutServersInput, channelsUncheckedCreateWithoutServersInput>
  }

  export type channelsCreateManyServersInputEnvelope = {
    data: Enumerable<channelsCreateManyServersInput>
    skipDuplicates?: boolean
  }

  export type membersCreateWithoutServersInput = {
    member_id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
  }

  export type membersUncheckedCreateWithoutServersInput = {
    member_id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
  }

  export type membersCreateOrConnectWithoutServersInput = {
    where: membersWhereUniqueInput
    create: XOR<membersCreateWithoutServersInput, membersUncheckedCreateWithoutServersInput>
  }

  export type membersCreateManyServersInputEnvelope = {
    data: Enumerable<membersCreateManyServersInput>
    skipDuplicates?: boolean
  }

  export type channelsUpsertWithWhereUniqueWithoutServersInput = {
    where: channelsWhereUniqueInput
    update: XOR<channelsUpdateWithoutServersInput, channelsUncheckedUpdateWithoutServersInput>
    create: XOR<channelsCreateWithoutServersInput, channelsUncheckedCreateWithoutServersInput>
  }

  export type channelsUpdateWithWhereUniqueWithoutServersInput = {
    where: channelsWhereUniqueInput
    data: XOR<channelsUpdateWithoutServersInput, channelsUncheckedUpdateWithoutServersInput>
  }

  export type channelsUpdateManyWithWhereWithoutServersInput = {
    where: channelsScalarWhereInput
    data: XOR<channelsUpdateManyMutationInput, channelsUncheckedUpdateManyWithoutChannelsInput>
  }

  export type channelsScalarWhereInput = {
    AND?: Enumerable<channelsScalarWhereInput>
    OR?: Enumerable<channelsScalarWhereInput>
    NOT?: Enumerable<channelsScalarWhereInput>
    channel_id?: UuidFilter | string
    server_id?: UuidFilter | string
    name?: StringFilter | string
    type?: StringFilter | string
    topic?: StringNullableFilter | string | null
    position?: IntNullableFilter | number | null
    created_at?: DateTimeFilter | Date | string
  }

  export type membersUpsertWithWhereUniqueWithoutServersInput = {
    where: membersWhereUniqueInput
    update: XOR<membersUpdateWithoutServersInput, membersUncheckedUpdateWithoutServersInput>
    create: XOR<membersCreateWithoutServersInput, membersUncheckedCreateWithoutServersInput>
  }

  export type membersUpdateWithWhereUniqueWithoutServersInput = {
    where: membersWhereUniqueInput
    data: XOR<membersUpdateWithoutServersInput, membersUncheckedUpdateWithoutServersInput>
  }

  export type membersUpdateManyWithWhereWithoutServersInput = {
    where: membersScalarWhereInput
    data: XOR<membersUpdateManyMutationInput, membersUncheckedUpdateManyWithoutMembersInput>
  }

  export type membersScalarWhereInput = {
    AND?: Enumerable<membersScalarWhereInput>
    OR?: Enumerable<membersScalarWhereInput>
    NOT?: Enumerable<membersScalarWhereInput>
    member_id?: UuidFilter | string
    server_id?: UuidFilter | string
    user_id?: UuidFilter | string
    role?: StringFilter | string
    joined_at?: DateTimeFilter | Date | string
  }

  export type serversCreateWithoutChannelsInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: membersCreateNestedManyWithoutServersInput
  }

  export type serversUncheckedCreateWithoutChannelsInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    members?: membersUncheckedCreateNestedManyWithoutServersInput
  }

  export type serversCreateOrConnectWithoutChannelsInput = {
    where: serversWhereUniqueInput
    create: XOR<serversCreateWithoutChannelsInput, serversUncheckedCreateWithoutChannelsInput>
  }

  export type messagesCreateWithoutChannelsInput = {
    message_id?: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type messagesUncheckedCreateWithoutChannelsInput = {
    message_id?: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type messagesCreateOrConnectWithoutChannelsInput = {
    where: messagesWhereUniqueInput
    create: XOR<messagesCreateWithoutChannelsInput, messagesUncheckedCreateWithoutChannelsInput>
  }

  export type messagesCreateManyChannelsInputEnvelope = {
    data: Enumerable<messagesCreateManyChannelsInput>
    skipDuplicates?: boolean
  }

  export type serversUpsertWithoutChannelsInput = {
    update: XOR<serversUpdateWithoutChannelsInput, serversUncheckedUpdateWithoutChannelsInput>
    create: XOR<serversCreateWithoutChannelsInput, serversUncheckedCreateWithoutChannelsInput>
  }

  export type serversUpdateWithoutChannelsInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: membersUpdateManyWithoutServersNestedInput
  }

  export type serversUncheckedUpdateWithoutChannelsInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: membersUncheckedUpdateManyWithoutServersNestedInput
  }

  export type messagesUpsertWithWhereUniqueWithoutChannelsInput = {
    where: messagesWhereUniqueInput
    update: XOR<messagesUpdateWithoutChannelsInput, messagesUncheckedUpdateWithoutChannelsInput>
    create: XOR<messagesCreateWithoutChannelsInput, messagesUncheckedCreateWithoutChannelsInput>
  }

  export type messagesUpdateWithWhereUniqueWithoutChannelsInput = {
    where: messagesWhereUniqueInput
    data: XOR<messagesUpdateWithoutChannelsInput, messagesUncheckedUpdateWithoutChannelsInput>
  }

  export type messagesUpdateManyWithWhereWithoutChannelsInput = {
    where: messagesScalarWhereInput
    data: XOR<messagesUpdateManyMutationInput, messagesUncheckedUpdateManyWithoutMessagesInput>
  }

  export type messagesScalarWhereInput = {
    AND?: Enumerable<messagesScalarWhereInput>
    OR?: Enumerable<messagesScalarWhereInput>
    NOT?: Enumerable<messagesScalarWhereInput>
    message_id?: UuidFilter | string
    channel_id?: UuidFilter | string
    user_id?: UuidFilter | string
    content?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    updated_at?: DateTimeFilter | Date | string
  }

  export type serversCreateWithoutMembersInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    channels?: channelsCreateNestedManyWithoutServersInput
  }

  export type serversUncheckedCreateWithoutMembersInput = {
    server_id?: string
    name: string
    description?: string | null
    owner_id: string
    created_at?: Date | string
    updated_at?: Date | string
    channels?: channelsUncheckedCreateNestedManyWithoutServersInput
  }

  export type serversCreateOrConnectWithoutMembersInput = {
    where: serversWhereUniqueInput
    create: XOR<serversCreateWithoutMembersInput, serversUncheckedCreateWithoutMembersInput>
  }

  export type serversUpsertWithoutMembersInput = {
    update: XOR<serversUpdateWithoutMembersInput, serversUncheckedUpdateWithoutMembersInput>
    create: XOR<serversCreateWithoutMembersInput, serversUncheckedCreateWithoutMembersInput>
  }

  export type serversUpdateWithoutMembersInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    channels?: channelsUpdateManyWithoutServersNestedInput
  }

  export type serversUncheckedUpdateWithoutMembersInput = {
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    owner_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    channels?: channelsUncheckedUpdateManyWithoutServersNestedInput
  }

  export type channelsCreateWithoutMessagesInput = {
    channel_id?: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
    servers: serversCreateNestedOneWithoutChannelsInput
  }

  export type channelsUncheckedCreateWithoutMessagesInput = {
    channel_id?: string
    server_id: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
  }

  export type channelsCreateOrConnectWithoutMessagesInput = {
    where: channelsWhereUniqueInput
    create: XOR<channelsCreateWithoutMessagesInput, channelsUncheckedCreateWithoutMessagesInput>
  }

  export type channelsUpsertWithoutMessagesInput = {
    update: XOR<channelsUpdateWithoutMessagesInput, channelsUncheckedUpdateWithoutMessagesInput>
    create: XOR<channelsCreateWithoutMessagesInput, channelsUncheckedCreateWithoutMessagesInput>
  }

  export type channelsUpdateWithoutMessagesInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    servers?: serversUpdateOneRequiredWithoutChannelsNestedInput
  }

  export type channelsUncheckedUpdateWithoutMessagesInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    server_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type channelsCreateManyServersInput = {
    channel_id?: string
    name: string
    type?: string
    topic?: string | null
    position?: number | null
    created_at?: Date | string
  }

  export type membersCreateManyServersInput = {
    member_id?: string
    user_id: string
    role?: string
    joined_at?: Date | string
  }

  export type channelsUpdateWithoutServersInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: messagesUpdateManyWithoutChannelsNestedInput
  }

  export type channelsUncheckedUpdateWithoutServersInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: messagesUncheckedUpdateManyWithoutChannelsNestedInput
  }

  export type channelsUncheckedUpdateManyWithoutChannelsInput = {
    channel_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    topic?: NullableStringFieldUpdateOperationsInput | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersUpdateWithoutServersInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersUncheckedUpdateWithoutServersInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type membersUncheckedUpdateManyWithoutMembersInput = {
    member_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesCreateManyChannelsInput = {
    message_id?: string
    user_id: string
    content: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type messagesUpdateWithoutChannelsInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateWithoutChannelsInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messagesUncheckedUpdateManyWithoutMessagesInput = {
    message_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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