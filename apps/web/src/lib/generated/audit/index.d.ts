
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type audit_logsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "audit_logs"
  objects: {}
  scalars: $Extensions.GetResult<{
    audit_id: string
    user_id: string | null
    action_type: string
    resource: string | null
    resource_id: string | null
    details: Prisma.JsonValue | null
    performed_by: string | null
    event_time: Date
  }, ExtArgs["result"]["audit_logs"]>
  composites: {}
}

/**
 * Model audit_logs
 * 
 */
export type audit_logs = runtime.Types.DefaultSelection<audit_logsPayload>
export type api_logsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "api_logs"
  objects: {}
  scalars: $Extensions.GetResult<{
    log_id: string
    user_id: string | null
    endpoint: string
    method: string
    status_code: number
    response_time: number | null
    error_message: string | null
    created_at: Date
  }, ExtArgs["result"]["api_logs"]>
  composites: {}
}

/**
 * Model api_logs
 * 
 */
export type api_logs = runtime.Types.DefaultSelection<api_logsPayload>
export type access_logsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "access_logs"
  objects: {}
  scalars: $Extensions.GetResult<{
    log_id: string
    user_id: string
    resource: string
    action: string
    status: string
    ip_address: string | null
    created_at: Date
  }, ExtArgs["result"]["access_logs"]>
  composites: {}
}

/**
 * Model access_logs
 * 
 */
export type access_logs = runtime.Types.DefaultSelection<access_logsPayload>
export type error_logsPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "error_logs"
  objects: {}
  scalars: $Extensions.GetResult<{
    log_id: string
    service: string
    error_type: string
    message: string
    stack_trace: string | null
    user_id: string | null
    created_at: Date
  }, ExtArgs["result"]["error_logs"]>
  composites: {}
}

/**
 * Model error_logs
 * 
 */
export type error_logs = runtime.Types.DefaultSelection<error_logsPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Audit_logs
 * const audit_logs = await prisma.audit_logs.findMany()
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
   * // Fetch zero or more Audit_logs
   * const audit_logs = await prisma.audit_logs.findMany()
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
   * `prisma.audit_logs`: Exposes CRUD operations for the **audit_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Audit_logs
    * const audit_logs = await prisma.audit_logs.findMany()
    * ```
    */
  get audit_logs(): Prisma.audit_logsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.api_logs`: Exposes CRUD operations for the **api_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Api_logs
    * const api_logs = await prisma.api_logs.findMany()
    * ```
    */
  get api_logs(): Prisma.api_logsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.access_logs`: Exposes CRUD operations for the **access_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Access_logs
    * const access_logs = await prisma.access_logs.findMany()
    * ```
    */
  get access_logs(): Prisma.access_logsDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.error_logs`: Exposes CRUD operations for the **error_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Error_logs
    * const error_logs = await prisma.error_logs.findMany()
    * ```
    */
  get error_logs(): Prisma.error_logsDelegate<GlobalReject, ExtArgs>;
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
    audit_logs: 'audit_logs',
    api_logs: 'api_logs',
    access_logs: 'access_logs',
    error_logs: 'error_logs'
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
      modelProps: 'audit_logs' | 'api_logs' | 'access_logs' | 'error_logs'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      audit_logs: {
        payload: audit_logsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.audit_logsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.audit_logsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          findFirst: {
            args: Prisma.audit_logsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.audit_logsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          findMany: {
            args: Prisma.audit_logsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>[]
          }
          create: {
            args: Prisma.audit_logsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          createMany: {
            args: Prisma.audit_logsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.audit_logsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          update: {
            args: Prisma.audit_logsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          deleteMany: {
            args: Prisma.audit_logsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.audit_logsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.audit_logsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<audit_logsPayload>
          }
          aggregate: {
            args: Prisma.Audit_logsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAudit_logs>
          }
          groupBy: {
            args: Prisma.Audit_logsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Audit_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.audit_logsCountArgs<ExtArgs>,
            result: $Utils.Optional<Audit_logsCountAggregateOutputType> | number
          }
        }
      }
      api_logs: {
        payload: api_logsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.api_logsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.api_logsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          findFirst: {
            args: Prisma.api_logsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.api_logsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          findMany: {
            args: Prisma.api_logsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>[]
          }
          create: {
            args: Prisma.api_logsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          createMany: {
            args: Prisma.api_logsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.api_logsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          update: {
            args: Prisma.api_logsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          deleteMany: {
            args: Prisma.api_logsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.api_logsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.api_logsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<api_logsPayload>
          }
          aggregate: {
            args: Prisma.Api_logsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateApi_logs>
          }
          groupBy: {
            args: Prisma.Api_logsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Api_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.api_logsCountArgs<ExtArgs>,
            result: $Utils.Optional<Api_logsCountAggregateOutputType> | number
          }
        }
      }
      access_logs: {
        payload: access_logsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.access_logsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.access_logsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          findFirst: {
            args: Prisma.access_logsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.access_logsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          findMany: {
            args: Prisma.access_logsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>[]
          }
          create: {
            args: Prisma.access_logsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          createMany: {
            args: Prisma.access_logsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.access_logsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          update: {
            args: Prisma.access_logsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          deleteMany: {
            args: Prisma.access_logsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.access_logsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.access_logsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<access_logsPayload>
          }
          aggregate: {
            args: Prisma.Access_logsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAccess_logs>
          }
          groupBy: {
            args: Prisma.Access_logsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Access_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.access_logsCountArgs<ExtArgs>,
            result: $Utils.Optional<Access_logsCountAggregateOutputType> | number
          }
        }
      }
      error_logs: {
        payload: error_logsPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.error_logsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.error_logsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          findFirst: {
            args: Prisma.error_logsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.error_logsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          findMany: {
            args: Prisma.error_logsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>[]
          }
          create: {
            args: Prisma.error_logsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          createMany: {
            args: Prisma.error_logsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.error_logsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          update: {
            args: Prisma.error_logsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          deleteMany: {
            args: Prisma.error_logsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.error_logsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.error_logsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<error_logsPayload>
          }
          aggregate: {
            args: Prisma.Error_logsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateError_logs>
          }
          groupBy: {
            args: Prisma.Error_logsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<Error_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.error_logsCountArgs<ExtArgs>,
            result: $Utils.Optional<Error_logsCountAggregateOutputType> | number
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
   * Models
   */

  /**
   * Model audit_logs
   */


  export type AggregateAudit_logs = {
    _count: Audit_logsCountAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  export type Audit_logsMinAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    action_type: string | null
    resource: string | null
    resource_id: string | null
    performed_by: string | null
    event_time: Date | null
  }

  export type Audit_logsMaxAggregateOutputType = {
    audit_id: string | null
    user_id: string | null
    action_type: string | null
    resource: string | null
    resource_id: string | null
    performed_by: string | null
    event_time: Date | null
  }

  export type Audit_logsCountAggregateOutputType = {
    audit_id: number
    user_id: number
    action_type: number
    resource: number
    resource_id: number
    details: number
    performed_by: number
    event_time: number
    _all: number
  }


  export type Audit_logsMinAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    resource?: true
    resource_id?: true
    performed_by?: true
    event_time?: true
  }

  export type Audit_logsMaxAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    resource?: true
    resource_id?: true
    performed_by?: true
    event_time?: true
  }

  export type Audit_logsCountAggregateInputType = {
    audit_id?: true
    user_id?: true
    action_type?: true
    resource?: true
    resource_id?: true
    details?: true
    performed_by?: true
    event_time?: true
    _all?: true
  }

  export type Audit_logsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to aggregate.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: Enumerable<audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned audit_logs
    **/
    _count?: true | Audit_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Audit_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Audit_logsMaxAggregateInputType
  }

  export type GetAudit_logsAggregateType<T extends Audit_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateAudit_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudit_logs[P]>
      : GetScalarType<T[P], AggregateAudit_logs[P]>
  }




  export type Audit_logsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: audit_logsWhereInput
    orderBy?: Enumerable<audit_logsOrderByWithAggregationInput>
    by: Audit_logsScalarFieldEnum[]
    having?: audit_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Audit_logsCountAggregateInputType | true
    _min?: Audit_logsMinAggregateInputType
    _max?: Audit_logsMaxAggregateInputType
  }


  export type Audit_logsGroupByOutputType = {
    audit_id: string
    user_id: string | null
    action_type: string
    resource: string | null
    resource_id: string | null
    details: JsonValue | null
    performed_by: string | null
    event_time: Date
    _count: Audit_logsCountAggregateOutputType | null
    _min: Audit_logsMinAggregateOutputType | null
    _max: Audit_logsMaxAggregateOutputType | null
  }

  type GetAudit_logsGroupByPayload<T extends Audit_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<Audit_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Audit_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Audit_logsGroupByOutputType[P]>
        }
      >
    >


  export type audit_logsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    audit_id?: boolean
    user_id?: boolean
    action_type?: boolean
    resource?: boolean
    resource_id?: boolean
    details?: boolean
    performed_by?: boolean
    event_time?: boolean
  }, ExtArgs["result"]["audit_logs"]>

  export type audit_logsSelectScalar = {
    audit_id?: boolean
    user_id?: boolean
    action_type?: boolean
    resource?: boolean
    resource_id?: boolean
    details?: boolean
    performed_by?: boolean
    event_time?: boolean
  }


  type audit_logsGetPayload<S extends boolean | null | undefined | audit_logsArgs> = $Types.GetResult<audit_logsPayload, S>

  type audit_logsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<audit_logsFindManyArgs, 'select' | 'include'> & {
      select?: Audit_logsCountAggregateInputType | true
    }

  export interface audit_logsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['audit_logs'], meta: { name: 'audit_logs' } }
    /**
     * Find zero or one Audit_logs that matches the filter.
     * @param {audit_logsFindUniqueArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends audit_logsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, audit_logsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'audit_logs'> extends True ? Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Audit_logs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {audit_logsFindUniqueOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends audit_logsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, audit_logsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends audit_logsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, audit_logsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'audit_logs'> extends True ? Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Audit_logs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindFirstOrThrowArgs} args - Arguments to find a Audit_logs
     * @example
     * // Get one Audit_logs
     * const audit_logs = await prisma.audit_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends audit_logsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, audit_logsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Audit_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany()
     * 
     * // Get first 10 Audit_logs
     * const audit_logs = await prisma.audit_logs.findMany({ take: 10 })
     * 
     * // Only select the `audit_id`
     * const audit_logsWithAudit_idOnly = await prisma.audit_logs.findMany({ select: { audit_id: true } })
     * 
    **/
    findMany<T extends audit_logsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, audit_logsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Audit_logs.
     * @param {audit_logsCreateArgs} args - Arguments to create a Audit_logs.
     * @example
     * // Create one Audit_logs
     * const Audit_logs = await prisma.audit_logs.create({
     *   data: {
     *     // ... data to create a Audit_logs
     *   }
     * })
     * 
    **/
    create<T extends audit_logsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, audit_logsCreateArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Audit_logs.
     *     @param {audit_logsCreateManyArgs} args - Arguments to create many Audit_logs.
     *     @example
     *     // Create many Audit_logs
     *     const audit_logs = await prisma.audit_logs.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends audit_logsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, audit_logsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Audit_logs.
     * @param {audit_logsDeleteArgs} args - Arguments to delete one Audit_logs.
     * @example
     * // Delete one Audit_logs
     * const Audit_logs = await prisma.audit_logs.delete({
     *   where: {
     *     // ... filter to delete one Audit_logs
     *   }
     * })
     * 
    **/
    delete<T extends audit_logsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, audit_logsDeleteArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Audit_logs.
     * @param {audit_logsUpdateArgs} args - Arguments to update one Audit_logs.
     * @example
     * // Update one Audit_logs
     * const audit_logs = await prisma.audit_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends audit_logsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, audit_logsUpdateArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Audit_logs.
     * @param {audit_logsDeleteManyArgs} args - Arguments to filter Audit_logs to delete.
     * @example
     * // Delete a few Audit_logs
     * const { count } = await prisma.audit_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends audit_logsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, audit_logsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Audit_logs
     * const audit_logs = await prisma.audit_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends audit_logsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, audit_logsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Audit_logs.
     * @param {audit_logsUpsertArgs} args - Arguments to update or create a Audit_logs.
     * @example
     * // Update or create a Audit_logs
     * const audit_logs = await prisma.audit_logs.upsert({
     *   create: {
     *     // ... data to create a Audit_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Audit_logs we want to update
     *   }
     * })
    **/
    upsert<T extends audit_logsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, audit_logsUpsertArgs<ExtArgs>>
    ): Prisma__audit_logsClient<$Types.GetResult<audit_logsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {audit_logsCountArgs} args - Arguments to filter Audit_logs to count.
     * @example
     * // Count the number of Audit_logs
     * const count = await prisma.audit_logs.count({
     *   where: {
     *     // ... the filter for the Audit_logs we want to count
     *   }
     * })
    **/
    count<T extends audit_logsCountArgs>(
      args?: Subset<T, audit_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Audit_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Audit_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Audit_logsAggregateArgs>(args: Subset<T, Audit_logsAggregateArgs>): Prisma.PrismaPromise<GetAudit_logsAggregateType<T>>

    /**
     * Group by Audit_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Audit_logsGroupByArgs} args - Group by arguments.
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
      T extends Audit_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Audit_logsGroupByArgs['orderBy'] }
        : { orderBy?: Audit_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Audit_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudit_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for audit_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__audit_logsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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
   * audit_logs base type for findUnique actions
   */
  export type audit_logsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }

  /**
   * audit_logs findUnique
   */
  export interface audit_logsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends audit_logsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * audit_logs findUniqueOrThrow
   */
  export type audit_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where: audit_logsWhereUniqueInput
  }


  /**
   * audit_logs base type for findFirst actions
   */
  export type audit_logsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: Enumerable<audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Enumerable<Audit_logsScalarFieldEnum>
  }

  /**
   * audit_logs findFirst
   */
  export interface audit_logsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends audit_logsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * audit_logs findFirstOrThrow
   */
  export type audit_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: Enumerable<audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of audit_logs.
     */
    distinct?: Enumerable<Audit_logsScalarFieldEnum>
  }


  /**
   * audit_logs findMany
   */
  export type audit_logsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter, which audit_logs to fetch.
     */
    where?: audit_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of audit_logs to fetch.
     */
    orderBy?: Enumerable<audit_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing audit_logs.
     */
    cursor?: audit_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` audit_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` audit_logs.
     */
    skip?: number
    distinct?: Enumerable<Audit_logsScalarFieldEnum>
  }


  /**
   * audit_logs create
   */
  export type audit_logsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * The data needed to create a audit_logs.
     */
    data: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
  }


  /**
   * audit_logs createMany
   */
  export type audit_logsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many audit_logs.
     */
    data: Enumerable<audit_logsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * audit_logs update
   */
  export type audit_logsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * The data needed to update a audit_logs.
     */
    data: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
    /**
     * Choose, which audit_logs to update.
     */
    where: audit_logsWhereUniqueInput
  }


  /**
   * audit_logs updateMany
   */
  export type audit_logsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update audit_logs.
     */
    data: XOR<audit_logsUpdateManyMutationInput, audit_logsUncheckedUpdateManyInput>
    /**
     * Filter which audit_logs to update
     */
    where?: audit_logsWhereInput
  }


  /**
   * audit_logs upsert
   */
  export type audit_logsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * The filter to search for the audit_logs to update in case it exists.
     */
    where: audit_logsWhereUniqueInput
    /**
     * In case the audit_logs found by the `where` argument doesn't exist, create a new audit_logs with this data.
     */
    create: XOR<audit_logsCreateInput, audit_logsUncheckedCreateInput>
    /**
     * In case the audit_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<audit_logsUpdateInput, audit_logsUncheckedUpdateInput>
  }


  /**
   * audit_logs delete
   */
  export type audit_logsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
    /**
     * Filter which audit_logs to delete.
     */
    where: audit_logsWhereUniqueInput
  }


  /**
   * audit_logs deleteMany
   */
  export type audit_logsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which audit_logs to delete
     */
    where?: audit_logsWhereInput
  }


  /**
   * audit_logs without action
   */
  export type audit_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the audit_logs
     */
    select?: audit_logsSelect<ExtArgs> | null
  }



  /**
   * Model api_logs
   */


  export type AggregateApi_logs = {
    _count: Api_logsCountAggregateOutputType | null
    _avg: Api_logsAvgAggregateOutputType | null
    _sum: Api_logsSumAggregateOutputType | null
    _min: Api_logsMinAggregateOutputType | null
    _max: Api_logsMaxAggregateOutputType | null
  }

  export type Api_logsAvgAggregateOutputType = {
    status_code: number | null
    response_time: number | null
  }

  export type Api_logsSumAggregateOutputType = {
    status_code: number | null
    response_time: number | null
  }

  export type Api_logsMinAggregateOutputType = {
    log_id: string | null
    user_id: string | null
    endpoint: string | null
    method: string | null
    status_code: number | null
    response_time: number | null
    error_message: string | null
    created_at: Date | null
  }

  export type Api_logsMaxAggregateOutputType = {
    log_id: string | null
    user_id: string | null
    endpoint: string | null
    method: string | null
    status_code: number | null
    response_time: number | null
    error_message: string | null
    created_at: Date | null
  }

  export type Api_logsCountAggregateOutputType = {
    log_id: number
    user_id: number
    endpoint: number
    method: number
    status_code: number
    response_time: number
    error_message: number
    created_at: number
    _all: number
  }


  export type Api_logsAvgAggregateInputType = {
    status_code?: true
    response_time?: true
  }

  export type Api_logsSumAggregateInputType = {
    status_code?: true
    response_time?: true
  }

  export type Api_logsMinAggregateInputType = {
    log_id?: true
    user_id?: true
    endpoint?: true
    method?: true
    status_code?: true
    response_time?: true
    error_message?: true
    created_at?: true
  }

  export type Api_logsMaxAggregateInputType = {
    log_id?: true
    user_id?: true
    endpoint?: true
    method?: true
    status_code?: true
    response_time?: true
    error_message?: true
    created_at?: true
  }

  export type Api_logsCountAggregateInputType = {
    log_id?: true
    user_id?: true
    endpoint?: true
    method?: true
    status_code?: true
    response_time?: true
    error_message?: true
    created_at?: true
    _all?: true
  }

  export type Api_logsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_logs to aggregate.
     */
    where?: api_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_logs to fetch.
     */
    orderBy?: Enumerable<api_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: api_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned api_logs
    **/
    _count?: true | Api_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Api_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Api_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Api_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Api_logsMaxAggregateInputType
  }

  export type GetApi_logsAggregateType<T extends Api_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateApi_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApi_logs[P]>
      : GetScalarType<T[P], AggregateApi_logs[P]>
  }




  export type Api_logsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: api_logsWhereInput
    orderBy?: Enumerable<api_logsOrderByWithAggregationInput>
    by: Api_logsScalarFieldEnum[]
    having?: api_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Api_logsCountAggregateInputType | true
    _avg?: Api_logsAvgAggregateInputType
    _sum?: Api_logsSumAggregateInputType
    _min?: Api_logsMinAggregateInputType
    _max?: Api_logsMaxAggregateInputType
  }


  export type Api_logsGroupByOutputType = {
    log_id: string
    user_id: string | null
    endpoint: string
    method: string
    status_code: number
    response_time: number | null
    error_message: string | null
    created_at: Date
    _count: Api_logsCountAggregateOutputType | null
    _avg: Api_logsAvgAggregateOutputType | null
    _sum: Api_logsSumAggregateOutputType | null
    _min: Api_logsMinAggregateOutputType | null
    _max: Api_logsMaxAggregateOutputType | null
  }

  type GetApi_logsGroupByPayload<T extends Api_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<Api_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Api_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Api_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Api_logsGroupByOutputType[P]>
        }
      >
    >


  export type api_logsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    user_id?: boolean
    endpoint?: boolean
    method?: boolean
    status_code?: boolean
    response_time?: boolean
    error_message?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["api_logs"]>

  export type api_logsSelectScalar = {
    log_id?: boolean
    user_id?: boolean
    endpoint?: boolean
    method?: boolean
    status_code?: boolean
    response_time?: boolean
    error_message?: boolean
    created_at?: boolean
  }


  type api_logsGetPayload<S extends boolean | null | undefined | api_logsArgs> = $Types.GetResult<api_logsPayload, S>

  type api_logsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<api_logsFindManyArgs, 'select' | 'include'> & {
      select?: Api_logsCountAggregateInputType | true
    }

  export interface api_logsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['api_logs'], meta: { name: 'api_logs' } }
    /**
     * Find zero or one Api_logs that matches the filter.
     * @param {api_logsFindUniqueArgs} args - Arguments to find a Api_logs
     * @example
     * // Get one Api_logs
     * const api_logs = await prisma.api_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends api_logsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, api_logsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'api_logs'> extends True ? Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Api_logs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {api_logsFindUniqueOrThrowArgs} args - Arguments to find a Api_logs
     * @example
     * // Get one Api_logs
     * const api_logs = await prisma.api_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends api_logsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, api_logsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Api_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_logsFindFirstArgs} args - Arguments to find a Api_logs
     * @example
     * // Get one Api_logs
     * const api_logs = await prisma.api_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends api_logsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, api_logsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'api_logs'> extends True ? Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Api_logs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_logsFindFirstOrThrowArgs} args - Arguments to find a Api_logs
     * @example
     * // Get one Api_logs
     * const api_logs = await prisma.api_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends api_logsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, api_logsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Api_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_logsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Api_logs
     * const api_logs = await prisma.api_logs.findMany()
     * 
     * // Get first 10 Api_logs
     * const api_logs = await prisma.api_logs.findMany({ take: 10 })
     * 
     * // Only select the `log_id`
     * const api_logsWithLog_idOnly = await prisma.api_logs.findMany({ select: { log_id: true } })
     * 
    **/
    findMany<T extends api_logsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, api_logsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Api_logs.
     * @param {api_logsCreateArgs} args - Arguments to create a Api_logs.
     * @example
     * // Create one Api_logs
     * const Api_logs = await prisma.api_logs.create({
     *   data: {
     *     // ... data to create a Api_logs
     *   }
     * })
     * 
    **/
    create<T extends api_logsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, api_logsCreateArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Api_logs.
     *     @param {api_logsCreateManyArgs} args - Arguments to create many Api_logs.
     *     @example
     *     // Create many Api_logs
     *     const api_logs = await prisma.api_logs.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends api_logsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, api_logsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Api_logs.
     * @param {api_logsDeleteArgs} args - Arguments to delete one Api_logs.
     * @example
     * // Delete one Api_logs
     * const Api_logs = await prisma.api_logs.delete({
     *   where: {
     *     // ... filter to delete one Api_logs
     *   }
     * })
     * 
    **/
    delete<T extends api_logsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, api_logsDeleteArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Api_logs.
     * @param {api_logsUpdateArgs} args - Arguments to update one Api_logs.
     * @example
     * // Update one Api_logs
     * const api_logs = await prisma.api_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends api_logsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, api_logsUpdateArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Api_logs.
     * @param {api_logsDeleteManyArgs} args - Arguments to filter Api_logs to delete.
     * @example
     * // Delete a few Api_logs
     * const { count } = await prisma.api_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends api_logsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, api_logsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Api_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Api_logs
     * const api_logs = await prisma.api_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends api_logsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, api_logsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Api_logs.
     * @param {api_logsUpsertArgs} args - Arguments to update or create a Api_logs.
     * @example
     * // Update or create a Api_logs
     * const api_logs = await prisma.api_logs.upsert({
     *   create: {
     *     // ... data to create a Api_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Api_logs we want to update
     *   }
     * })
    **/
    upsert<T extends api_logsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, api_logsUpsertArgs<ExtArgs>>
    ): Prisma__api_logsClient<$Types.GetResult<api_logsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Api_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_logsCountArgs} args - Arguments to filter Api_logs to count.
     * @example
     * // Count the number of Api_logs
     * const count = await prisma.api_logs.count({
     *   where: {
     *     // ... the filter for the Api_logs we want to count
     *   }
     * })
    **/
    count<T extends api_logsCountArgs>(
      args?: Subset<T, api_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Api_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Api_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Api_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Api_logsAggregateArgs>(args: Subset<T, Api_logsAggregateArgs>): Prisma.PrismaPromise<GetApi_logsAggregateType<T>>

    /**
     * Group by Api_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Api_logsGroupByArgs} args - Group by arguments.
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
      T extends Api_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Api_logsGroupByArgs['orderBy'] }
        : { orderBy?: Api_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Api_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApi_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for api_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__api_logsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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
   * api_logs base type for findUnique actions
   */
  export type api_logsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter, which api_logs to fetch.
     */
    where: api_logsWhereUniqueInput
  }

  /**
   * api_logs findUnique
   */
  export interface api_logsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends api_logsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * api_logs findUniqueOrThrow
   */
  export type api_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter, which api_logs to fetch.
     */
    where: api_logsWhereUniqueInput
  }


  /**
   * api_logs base type for findFirst actions
   */
  export type api_logsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter, which api_logs to fetch.
     */
    where?: api_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_logs to fetch.
     */
    orderBy?: Enumerable<api_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_logs.
     */
    cursor?: api_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_logs.
     */
    distinct?: Enumerable<Api_logsScalarFieldEnum>
  }

  /**
   * api_logs findFirst
   */
  export interface api_logsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends api_logsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * api_logs findFirstOrThrow
   */
  export type api_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter, which api_logs to fetch.
     */
    where?: api_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_logs to fetch.
     */
    orderBy?: Enumerable<api_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_logs.
     */
    cursor?: api_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_logs.
     */
    distinct?: Enumerable<Api_logsScalarFieldEnum>
  }


  /**
   * api_logs findMany
   */
  export type api_logsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter, which api_logs to fetch.
     */
    where?: api_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_logs to fetch.
     */
    orderBy?: Enumerable<api_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing api_logs.
     */
    cursor?: api_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_logs.
     */
    skip?: number
    distinct?: Enumerable<Api_logsScalarFieldEnum>
  }


  /**
   * api_logs create
   */
  export type api_logsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * The data needed to create a api_logs.
     */
    data: XOR<api_logsCreateInput, api_logsUncheckedCreateInput>
  }


  /**
   * api_logs createMany
   */
  export type api_logsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many api_logs.
     */
    data: Enumerable<api_logsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * api_logs update
   */
  export type api_logsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * The data needed to update a api_logs.
     */
    data: XOR<api_logsUpdateInput, api_logsUncheckedUpdateInput>
    /**
     * Choose, which api_logs to update.
     */
    where: api_logsWhereUniqueInput
  }


  /**
   * api_logs updateMany
   */
  export type api_logsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update api_logs.
     */
    data: XOR<api_logsUpdateManyMutationInput, api_logsUncheckedUpdateManyInput>
    /**
     * Filter which api_logs to update
     */
    where?: api_logsWhereInput
  }


  /**
   * api_logs upsert
   */
  export type api_logsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * The filter to search for the api_logs to update in case it exists.
     */
    where: api_logsWhereUniqueInput
    /**
     * In case the api_logs found by the `where` argument doesn't exist, create a new api_logs with this data.
     */
    create: XOR<api_logsCreateInput, api_logsUncheckedCreateInput>
    /**
     * In case the api_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<api_logsUpdateInput, api_logsUncheckedUpdateInput>
  }


  /**
   * api_logs delete
   */
  export type api_logsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
    /**
     * Filter which api_logs to delete.
     */
    where: api_logsWhereUniqueInput
  }


  /**
   * api_logs deleteMany
   */
  export type api_logsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_logs to delete
     */
    where?: api_logsWhereInput
  }


  /**
   * api_logs without action
   */
  export type api_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_logs
     */
    select?: api_logsSelect<ExtArgs> | null
  }



  /**
   * Model access_logs
   */


  export type AggregateAccess_logs = {
    _count: Access_logsCountAggregateOutputType | null
    _min: Access_logsMinAggregateOutputType | null
    _max: Access_logsMaxAggregateOutputType | null
  }

  export type Access_logsMinAggregateOutputType = {
    log_id: string | null
    user_id: string | null
    resource: string | null
    action: string | null
    status: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Access_logsMaxAggregateOutputType = {
    log_id: string | null
    user_id: string | null
    resource: string | null
    action: string | null
    status: string | null
    ip_address: string | null
    created_at: Date | null
  }

  export type Access_logsCountAggregateOutputType = {
    log_id: number
    user_id: number
    resource: number
    action: number
    status: number
    ip_address: number
    created_at: number
    _all: number
  }


  export type Access_logsMinAggregateInputType = {
    log_id?: true
    user_id?: true
    resource?: true
    action?: true
    status?: true
    ip_address?: true
    created_at?: true
  }

  export type Access_logsMaxAggregateInputType = {
    log_id?: true
    user_id?: true
    resource?: true
    action?: true
    status?: true
    ip_address?: true
    created_at?: true
  }

  export type Access_logsCountAggregateInputType = {
    log_id?: true
    user_id?: true
    resource?: true
    action?: true
    status?: true
    ip_address?: true
    created_at?: true
    _all?: true
  }

  export type Access_logsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which access_logs to aggregate.
     */
    where?: access_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of access_logs to fetch.
     */
    orderBy?: Enumerable<access_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: access_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` access_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` access_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned access_logs
    **/
    _count?: true | Access_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Access_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Access_logsMaxAggregateInputType
  }

  export type GetAccess_logsAggregateType<T extends Access_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateAccess_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccess_logs[P]>
      : GetScalarType<T[P], AggregateAccess_logs[P]>
  }




  export type Access_logsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: access_logsWhereInput
    orderBy?: Enumerable<access_logsOrderByWithAggregationInput>
    by: Access_logsScalarFieldEnum[]
    having?: access_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Access_logsCountAggregateInputType | true
    _min?: Access_logsMinAggregateInputType
    _max?: Access_logsMaxAggregateInputType
  }


  export type Access_logsGroupByOutputType = {
    log_id: string
    user_id: string
    resource: string
    action: string
    status: string
    ip_address: string | null
    created_at: Date
    _count: Access_logsCountAggregateOutputType | null
    _min: Access_logsMinAggregateOutputType | null
    _max: Access_logsMaxAggregateOutputType | null
  }

  type GetAccess_logsGroupByPayload<T extends Access_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<Access_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Access_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Access_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Access_logsGroupByOutputType[P]>
        }
      >
    >


  export type access_logsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    user_id?: boolean
    resource?: boolean
    action?: boolean
    status?: boolean
    ip_address?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["access_logs"]>

  export type access_logsSelectScalar = {
    log_id?: boolean
    user_id?: boolean
    resource?: boolean
    action?: boolean
    status?: boolean
    ip_address?: boolean
    created_at?: boolean
  }


  type access_logsGetPayload<S extends boolean | null | undefined | access_logsArgs> = $Types.GetResult<access_logsPayload, S>

  type access_logsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<access_logsFindManyArgs, 'select' | 'include'> & {
      select?: Access_logsCountAggregateInputType | true
    }

  export interface access_logsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['access_logs'], meta: { name: 'access_logs' } }
    /**
     * Find zero or one Access_logs that matches the filter.
     * @param {access_logsFindUniqueArgs} args - Arguments to find a Access_logs
     * @example
     * // Get one Access_logs
     * const access_logs = await prisma.access_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends access_logsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, access_logsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'access_logs'> extends True ? Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Access_logs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {access_logsFindUniqueOrThrowArgs} args - Arguments to find a Access_logs
     * @example
     * // Get one Access_logs
     * const access_logs = await prisma.access_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends access_logsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, access_logsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Access_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {access_logsFindFirstArgs} args - Arguments to find a Access_logs
     * @example
     * // Get one Access_logs
     * const access_logs = await prisma.access_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends access_logsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, access_logsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'access_logs'> extends True ? Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Access_logs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {access_logsFindFirstOrThrowArgs} args - Arguments to find a Access_logs
     * @example
     * // Get one Access_logs
     * const access_logs = await prisma.access_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends access_logsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, access_logsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Access_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {access_logsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Access_logs
     * const access_logs = await prisma.access_logs.findMany()
     * 
     * // Get first 10 Access_logs
     * const access_logs = await prisma.access_logs.findMany({ take: 10 })
     * 
     * // Only select the `log_id`
     * const access_logsWithLog_idOnly = await prisma.access_logs.findMany({ select: { log_id: true } })
     * 
    **/
    findMany<T extends access_logsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, access_logsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Access_logs.
     * @param {access_logsCreateArgs} args - Arguments to create a Access_logs.
     * @example
     * // Create one Access_logs
     * const Access_logs = await prisma.access_logs.create({
     *   data: {
     *     // ... data to create a Access_logs
     *   }
     * })
     * 
    **/
    create<T extends access_logsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, access_logsCreateArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Access_logs.
     *     @param {access_logsCreateManyArgs} args - Arguments to create many Access_logs.
     *     @example
     *     // Create many Access_logs
     *     const access_logs = await prisma.access_logs.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends access_logsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, access_logsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Access_logs.
     * @param {access_logsDeleteArgs} args - Arguments to delete one Access_logs.
     * @example
     * // Delete one Access_logs
     * const Access_logs = await prisma.access_logs.delete({
     *   where: {
     *     // ... filter to delete one Access_logs
     *   }
     * })
     * 
    **/
    delete<T extends access_logsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, access_logsDeleteArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Access_logs.
     * @param {access_logsUpdateArgs} args - Arguments to update one Access_logs.
     * @example
     * // Update one Access_logs
     * const access_logs = await prisma.access_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends access_logsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, access_logsUpdateArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Access_logs.
     * @param {access_logsDeleteManyArgs} args - Arguments to filter Access_logs to delete.
     * @example
     * // Delete a few Access_logs
     * const { count } = await prisma.access_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends access_logsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, access_logsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Access_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {access_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Access_logs
     * const access_logs = await prisma.access_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends access_logsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, access_logsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Access_logs.
     * @param {access_logsUpsertArgs} args - Arguments to update or create a Access_logs.
     * @example
     * // Update or create a Access_logs
     * const access_logs = await prisma.access_logs.upsert({
     *   create: {
     *     // ... data to create a Access_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Access_logs we want to update
     *   }
     * })
    **/
    upsert<T extends access_logsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, access_logsUpsertArgs<ExtArgs>>
    ): Prisma__access_logsClient<$Types.GetResult<access_logsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Access_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {access_logsCountArgs} args - Arguments to filter Access_logs to count.
     * @example
     * // Count the number of Access_logs
     * const count = await prisma.access_logs.count({
     *   where: {
     *     // ... the filter for the Access_logs we want to count
     *   }
     * })
    **/
    count<T extends access_logsCountArgs>(
      args?: Subset<T, access_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Access_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Access_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Access_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Access_logsAggregateArgs>(args: Subset<T, Access_logsAggregateArgs>): Prisma.PrismaPromise<GetAccess_logsAggregateType<T>>

    /**
     * Group by Access_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Access_logsGroupByArgs} args - Group by arguments.
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
      T extends Access_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Access_logsGroupByArgs['orderBy'] }
        : { orderBy?: Access_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Access_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccess_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for access_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__access_logsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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
   * access_logs base type for findUnique actions
   */
  export type access_logsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter, which access_logs to fetch.
     */
    where: access_logsWhereUniqueInput
  }

  /**
   * access_logs findUnique
   */
  export interface access_logsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends access_logsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * access_logs findUniqueOrThrow
   */
  export type access_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter, which access_logs to fetch.
     */
    where: access_logsWhereUniqueInput
  }


  /**
   * access_logs base type for findFirst actions
   */
  export type access_logsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter, which access_logs to fetch.
     */
    where?: access_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of access_logs to fetch.
     */
    orderBy?: Enumerable<access_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for access_logs.
     */
    cursor?: access_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` access_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` access_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of access_logs.
     */
    distinct?: Enumerable<Access_logsScalarFieldEnum>
  }

  /**
   * access_logs findFirst
   */
  export interface access_logsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends access_logsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * access_logs findFirstOrThrow
   */
  export type access_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter, which access_logs to fetch.
     */
    where?: access_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of access_logs to fetch.
     */
    orderBy?: Enumerable<access_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for access_logs.
     */
    cursor?: access_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` access_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` access_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of access_logs.
     */
    distinct?: Enumerable<Access_logsScalarFieldEnum>
  }


  /**
   * access_logs findMany
   */
  export type access_logsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter, which access_logs to fetch.
     */
    where?: access_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of access_logs to fetch.
     */
    orderBy?: Enumerable<access_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing access_logs.
     */
    cursor?: access_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` access_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` access_logs.
     */
    skip?: number
    distinct?: Enumerable<Access_logsScalarFieldEnum>
  }


  /**
   * access_logs create
   */
  export type access_logsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * The data needed to create a access_logs.
     */
    data: XOR<access_logsCreateInput, access_logsUncheckedCreateInput>
  }


  /**
   * access_logs createMany
   */
  export type access_logsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many access_logs.
     */
    data: Enumerable<access_logsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * access_logs update
   */
  export type access_logsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * The data needed to update a access_logs.
     */
    data: XOR<access_logsUpdateInput, access_logsUncheckedUpdateInput>
    /**
     * Choose, which access_logs to update.
     */
    where: access_logsWhereUniqueInput
  }


  /**
   * access_logs updateMany
   */
  export type access_logsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update access_logs.
     */
    data: XOR<access_logsUpdateManyMutationInput, access_logsUncheckedUpdateManyInput>
    /**
     * Filter which access_logs to update
     */
    where?: access_logsWhereInput
  }


  /**
   * access_logs upsert
   */
  export type access_logsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * The filter to search for the access_logs to update in case it exists.
     */
    where: access_logsWhereUniqueInput
    /**
     * In case the access_logs found by the `where` argument doesn't exist, create a new access_logs with this data.
     */
    create: XOR<access_logsCreateInput, access_logsUncheckedCreateInput>
    /**
     * In case the access_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<access_logsUpdateInput, access_logsUncheckedUpdateInput>
  }


  /**
   * access_logs delete
   */
  export type access_logsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
    /**
     * Filter which access_logs to delete.
     */
    where: access_logsWhereUniqueInput
  }


  /**
   * access_logs deleteMany
   */
  export type access_logsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which access_logs to delete
     */
    where?: access_logsWhereInput
  }


  /**
   * access_logs without action
   */
  export type access_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the access_logs
     */
    select?: access_logsSelect<ExtArgs> | null
  }



  /**
   * Model error_logs
   */


  export type AggregateError_logs = {
    _count: Error_logsCountAggregateOutputType | null
    _min: Error_logsMinAggregateOutputType | null
    _max: Error_logsMaxAggregateOutputType | null
  }

  export type Error_logsMinAggregateOutputType = {
    log_id: string | null
    service: string | null
    error_type: string | null
    message: string | null
    stack_trace: string | null
    user_id: string | null
    created_at: Date | null
  }

  export type Error_logsMaxAggregateOutputType = {
    log_id: string | null
    service: string | null
    error_type: string | null
    message: string | null
    stack_trace: string | null
    user_id: string | null
    created_at: Date | null
  }

  export type Error_logsCountAggregateOutputType = {
    log_id: number
    service: number
    error_type: number
    message: number
    stack_trace: number
    user_id: number
    created_at: number
    _all: number
  }


  export type Error_logsMinAggregateInputType = {
    log_id?: true
    service?: true
    error_type?: true
    message?: true
    stack_trace?: true
    user_id?: true
    created_at?: true
  }

  export type Error_logsMaxAggregateInputType = {
    log_id?: true
    service?: true
    error_type?: true
    message?: true
    stack_trace?: true
    user_id?: true
    created_at?: true
  }

  export type Error_logsCountAggregateInputType = {
    log_id?: true
    service?: true
    error_type?: true
    message?: true
    stack_trace?: true
    user_id?: true
    created_at?: true
    _all?: true
  }

  export type Error_logsAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which error_logs to aggregate.
     */
    where?: error_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of error_logs to fetch.
     */
    orderBy?: Enumerable<error_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: error_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` error_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` error_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned error_logs
    **/
    _count?: true | Error_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Error_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Error_logsMaxAggregateInputType
  }

  export type GetError_logsAggregateType<T extends Error_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateError_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateError_logs[P]>
      : GetScalarType<T[P], AggregateError_logs[P]>
  }




  export type Error_logsGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: error_logsWhereInput
    orderBy?: Enumerable<error_logsOrderByWithAggregationInput>
    by: Error_logsScalarFieldEnum[]
    having?: error_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Error_logsCountAggregateInputType | true
    _min?: Error_logsMinAggregateInputType
    _max?: Error_logsMaxAggregateInputType
  }


  export type Error_logsGroupByOutputType = {
    log_id: string
    service: string
    error_type: string
    message: string
    stack_trace: string | null
    user_id: string | null
    created_at: Date
    _count: Error_logsCountAggregateOutputType | null
    _min: Error_logsMinAggregateOutputType | null
    _max: Error_logsMaxAggregateOutputType | null
  }

  type GetError_logsGroupByPayload<T extends Error_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<Error_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Error_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Error_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Error_logsGroupByOutputType[P]>
        }
      >
    >


  export type error_logsSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    service?: boolean
    error_type?: boolean
    message?: boolean
    stack_trace?: boolean
    user_id?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["error_logs"]>

  export type error_logsSelectScalar = {
    log_id?: boolean
    service?: boolean
    error_type?: boolean
    message?: boolean
    stack_trace?: boolean
    user_id?: boolean
    created_at?: boolean
  }


  type error_logsGetPayload<S extends boolean | null | undefined | error_logsArgs> = $Types.GetResult<error_logsPayload, S>

  type error_logsCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<error_logsFindManyArgs, 'select' | 'include'> & {
      select?: Error_logsCountAggregateInputType | true
    }

  export interface error_logsDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['error_logs'], meta: { name: 'error_logs' } }
    /**
     * Find zero or one Error_logs that matches the filter.
     * @param {error_logsFindUniqueArgs} args - Arguments to find a Error_logs
     * @example
     * // Get one Error_logs
     * const error_logs = await prisma.error_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends error_logsFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, error_logsFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'error_logs'> extends True ? Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Error_logs that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {error_logsFindUniqueOrThrowArgs} args - Arguments to find a Error_logs
     * @example
     * // Get one Error_logs
     * const error_logs = await prisma.error_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends error_logsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, error_logsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Error_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {error_logsFindFirstArgs} args - Arguments to find a Error_logs
     * @example
     * // Get one Error_logs
     * const error_logs = await prisma.error_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends error_logsFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, error_logsFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'error_logs'> extends True ? Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Error_logs that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {error_logsFindFirstOrThrowArgs} args - Arguments to find a Error_logs
     * @example
     * // Get one Error_logs
     * const error_logs = await prisma.error_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends error_logsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, error_logsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Error_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {error_logsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Error_logs
     * const error_logs = await prisma.error_logs.findMany()
     * 
     * // Get first 10 Error_logs
     * const error_logs = await prisma.error_logs.findMany({ take: 10 })
     * 
     * // Only select the `log_id`
     * const error_logsWithLog_idOnly = await prisma.error_logs.findMany({ select: { log_id: true } })
     * 
    **/
    findMany<T extends error_logsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, error_logsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Error_logs.
     * @param {error_logsCreateArgs} args - Arguments to create a Error_logs.
     * @example
     * // Create one Error_logs
     * const Error_logs = await prisma.error_logs.create({
     *   data: {
     *     // ... data to create a Error_logs
     *   }
     * })
     * 
    **/
    create<T extends error_logsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, error_logsCreateArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Error_logs.
     *     @param {error_logsCreateManyArgs} args - Arguments to create many Error_logs.
     *     @example
     *     // Create many Error_logs
     *     const error_logs = await prisma.error_logs.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends error_logsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, error_logsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Error_logs.
     * @param {error_logsDeleteArgs} args - Arguments to delete one Error_logs.
     * @example
     * // Delete one Error_logs
     * const Error_logs = await prisma.error_logs.delete({
     *   where: {
     *     // ... filter to delete one Error_logs
     *   }
     * })
     * 
    **/
    delete<T extends error_logsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, error_logsDeleteArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Error_logs.
     * @param {error_logsUpdateArgs} args - Arguments to update one Error_logs.
     * @example
     * // Update one Error_logs
     * const error_logs = await prisma.error_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends error_logsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, error_logsUpdateArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Error_logs.
     * @param {error_logsDeleteManyArgs} args - Arguments to filter Error_logs to delete.
     * @example
     * // Delete a few Error_logs
     * const { count } = await prisma.error_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends error_logsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, error_logsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Error_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {error_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Error_logs
     * const error_logs = await prisma.error_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends error_logsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, error_logsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Error_logs.
     * @param {error_logsUpsertArgs} args - Arguments to update or create a Error_logs.
     * @example
     * // Update or create a Error_logs
     * const error_logs = await prisma.error_logs.upsert({
     *   create: {
     *     // ... data to create a Error_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Error_logs we want to update
     *   }
     * })
    **/
    upsert<T extends error_logsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, error_logsUpsertArgs<ExtArgs>>
    ): Prisma__error_logsClient<$Types.GetResult<error_logsPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Error_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {error_logsCountArgs} args - Arguments to filter Error_logs to count.
     * @example
     * // Count the number of Error_logs
     * const count = await prisma.error_logs.count({
     *   where: {
     *     // ... the filter for the Error_logs we want to count
     *   }
     * })
    **/
    count<T extends error_logsCountArgs>(
      args?: Subset<T, error_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Error_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Error_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Error_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Error_logsAggregateArgs>(args: Subset<T, Error_logsAggregateArgs>): Prisma.PrismaPromise<GetError_logsAggregateType<T>>

    /**
     * Group by Error_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Error_logsGroupByArgs} args - Group by arguments.
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
      T extends Error_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Error_logsGroupByArgs['orderBy'] }
        : { orderBy?: Error_logsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, Error_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetError_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for error_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__error_logsClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
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
   * error_logs base type for findUnique actions
   */
  export type error_logsFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter, which error_logs to fetch.
     */
    where: error_logsWhereUniqueInput
  }

  /**
   * error_logs findUnique
   */
  export interface error_logsFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends error_logsFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * error_logs findUniqueOrThrow
   */
  export type error_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter, which error_logs to fetch.
     */
    where: error_logsWhereUniqueInput
  }


  /**
   * error_logs base type for findFirst actions
   */
  export type error_logsFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter, which error_logs to fetch.
     */
    where?: error_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of error_logs to fetch.
     */
    orderBy?: Enumerable<error_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for error_logs.
     */
    cursor?: error_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` error_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` error_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of error_logs.
     */
    distinct?: Enumerable<Error_logsScalarFieldEnum>
  }

  /**
   * error_logs findFirst
   */
  export interface error_logsFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends error_logsFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * error_logs findFirstOrThrow
   */
  export type error_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter, which error_logs to fetch.
     */
    where?: error_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of error_logs to fetch.
     */
    orderBy?: Enumerable<error_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for error_logs.
     */
    cursor?: error_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` error_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` error_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of error_logs.
     */
    distinct?: Enumerable<Error_logsScalarFieldEnum>
  }


  /**
   * error_logs findMany
   */
  export type error_logsFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter, which error_logs to fetch.
     */
    where?: error_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of error_logs to fetch.
     */
    orderBy?: Enumerable<error_logsOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing error_logs.
     */
    cursor?: error_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` error_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` error_logs.
     */
    skip?: number
    distinct?: Enumerable<Error_logsScalarFieldEnum>
  }


  /**
   * error_logs create
   */
  export type error_logsCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * The data needed to create a error_logs.
     */
    data: XOR<error_logsCreateInput, error_logsUncheckedCreateInput>
  }


  /**
   * error_logs createMany
   */
  export type error_logsCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many error_logs.
     */
    data: Enumerable<error_logsCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * error_logs update
   */
  export type error_logsUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * The data needed to update a error_logs.
     */
    data: XOR<error_logsUpdateInput, error_logsUncheckedUpdateInput>
    /**
     * Choose, which error_logs to update.
     */
    where: error_logsWhereUniqueInput
  }


  /**
   * error_logs updateMany
   */
  export type error_logsUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update error_logs.
     */
    data: XOR<error_logsUpdateManyMutationInput, error_logsUncheckedUpdateManyInput>
    /**
     * Filter which error_logs to update
     */
    where?: error_logsWhereInput
  }


  /**
   * error_logs upsert
   */
  export type error_logsUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * The filter to search for the error_logs to update in case it exists.
     */
    where: error_logsWhereUniqueInput
    /**
     * In case the error_logs found by the `where` argument doesn't exist, create a new error_logs with this data.
     */
    create: XOR<error_logsCreateInput, error_logsUncheckedCreateInput>
    /**
     * In case the error_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<error_logsUpdateInput, error_logsUncheckedUpdateInput>
  }


  /**
   * error_logs delete
   */
  export type error_logsDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
    /**
     * Filter which error_logs to delete.
     */
    where: error_logsWhereUniqueInput
  }


  /**
   * error_logs deleteMany
   */
  export type error_logsDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which error_logs to delete
     */
    where?: error_logsWhereInput
  }


  /**
   * error_logs without action
   */
  export type error_logsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the error_logs
     */
    select?: error_logsSelect<ExtArgs> | null
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


  export const Audit_logsScalarFieldEnum: {
    audit_id: 'audit_id',
    user_id: 'user_id',
    action_type: 'action_type',
    resource: 'resource',
    resource_id: 'resource_id',
    details: 'details',
    performed_by: 'performed_by',
    event_time: 'event_time'
  };

  export type Audit_logsScalarFieldEnum = (typeof Audit_logsScalarFieldEnum)[keyof typeof Audit_logsScalarFieldEnum]


  export const Api_logsScalarFieldEnum: {
    log_id: 'log_id',
    user_id: 'user_id',
    endpoint: 'endpoint',
    method: 'method',
    status_code: 'status_code',
    response_time: 'response_time',
    error_message: 'error_message',
    created_at: 'created_at'
  };

  export type Api_logsScalarFieldEnum = (typeof Api_logsScalarFieldEnum)[keyof typeof Api_logsScalarFieldEnum]


  export const Access_logsScalarFieldEnum: {
    log_id: 'log_id',
    user_id: 'user_id',
    resource: 'resource',
    action: 'action',
    status: 'status',
    ip_address: 'ip_address',
    created_at: 'created_at'
  };

  export type Access_logsScalarFieldEnum = (typeof Access_logsScalarFieldEnum)[keyof typeof Access_logsScalarFieldEnum]


  export const Error_logsScalarFieldEnum: {
    log_id: 'log_id',
    service: 'service',
    error_type: 'error_type',
    message: 'message',
    stack_trace: 'stack_trace',
    user_id: 'user_id',
    created_at: 'created_at'
  };

  export type Error_logsScalarFieldEnum = (typeof Error_logsScalarFieldEnum)[keyof typeof Error_logsScalarFieldEnum]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Deep Input Types
   */


  export type audit_logsWhereInput = {
    AND?: Enumerable<audit_logsWhereInput>
    OR?: Enumerable<audit_logsWhereInput>
    NOT?: Enumerable<audit_logsWhereInput>
    audit_id?: UuidFilter | string
    user_id?: UuidNullableFilter | string | null
    action_type?: StringFilter | string
    resource?: StringNullableFilter | string | null
    resource_id?: UuidNullableFilter | string | null
    details?: JsonNullableFilter
    performed_by?: UuidNullableFilter | string | null
    event_time?: DateTimeFilter | Date | string
  }

  export type audit_logsOrderByWithRelationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    action_type?: SortOrder
    resource?: SortOrderInput | SortOrder
    resource_id?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    performed_by?: SortOrderInput | SortOrder
    event_time?: SortOrder
  }

  export type audit_logsWhereUniqueInput = {
    audit_id?: string
  }

  export type audit_logsOrderByWithAggregationInput = {
    audit_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    action_type?: SortOrder
    resource?: SortOrderInput | SortOrder
    resource_id?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    performed_by?: SortOrderInput | SortOrder
    event_time?: SortOrder
    _count?: audit_logsCountOrderByAggregateInput
    _max?: audit_logsMaxOrderByAggregateInput
    _min?: audit_logsMinOrderByAggregateInput
  }

  export type audit_logsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<audit_logsScalarWhereWithAggregatesInput>
    OR?: Enumerable<audit_logsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<audit_logsScalarWhereWithAggregatesInput>
    audit_id?: UuidWithAggregatesFilter | string
    user_id?: UuidNullableWithAggregatesFilter | string | null
    action_type?: StringWithAggregatesFilter | string
    resource?: StringNullableWithAggregatesFilter | string | null
    resource_id?: UuidNullableWithAggregatesFilter | string | null
    details?: JsonNullableWithAggregatesFilter
    performed_by?: UuidNullableWithAggregatesFilter | string | null
    event_time?: DateTimeWithAggregatesFilter | Date | string
  }

  export type api_logsWhereInput = {
    AND?: Enumerable<api_logsWhereInput>
    OR?: Enumerable<api_logsWhereInput>
    NOT?: Enumerable<api_logsWhereInput>
    log_id?: UuidFilter | string
    user_id?: UuidNullableFilter | string | null
    endpoint?: StringFilter | string
    method?: StringFilter | string
    status_code?: IntFilter | number
    response_time?: IntNullableFilter | number | null
    error_message?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
  }

  export type api_logsOrderByWithRelationInput = {
    log_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    endpoint?: SortOrder
    method?: SortOrder
    status_code?: SortOrder
    response_time?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    created_at?: SortOrder
  }

  export type api_logsWhereUniqueInput = {
    log_id?: string
  }

  export type api_logsOrderByWithAggregationInput = {
    log_id?: SortOrder
    user_id?: SortOrderInput | SortOrder
    endpoint?: SortOrder
    method?: SortOrder
    status_code?: SortOrder
    response_time?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: api_logsCountOrderByAggregateInput
    _avg?: api_logsAvgOrderByAggregateInput
    _max?: api_logsMaxOrderByAggregateInput
    _min?: api_logsMinOrderByAggregateInput
    _sum?: api_logsSumOrderByAggregateInput
  }

  export type api_logsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<api_logsScalarWhereWithAggregatesInput>
    OR?: Enumerable<api_logsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<api_logsScalarWhereWithAggregatesInput>
    log_id?: UuidWithAggregatesFilter | string
    user_id?: UuidNullableWithAggregatesFilter | string | null
    endpoint?: StringWithAggregatesFilter | string
    method?: StringWithAggregatesFilter | string
    status_code?: IntWithAggregatesFilter | number
    response_time?: IntNullableWithAggregatesFilter | number | null
    error_message?: StringNullableWithAggregatesFilter | string | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type access_logsWhereInput = {
    AND?: Enumerable<access_logsWhereInput>
    OR?: Enumerable<access_logsWhereInput>
    NOT?: Enumerable<access_logsWhereInput>
    log_id?: UuidFilter | string
    user_id?: UuidFilter | string
    resource?: StringFilter | string
    action?: StringFilter | string
    status?: StringFilter | string
    ip_address?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
  }

  export type access_logsOrderByWithRelationInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    resource?: SortOrder
    action?: SortOrder
    status?: SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrder
  }

  export type access_logsWhereUniqueInput = {
    log_id?: string
  }

  export type access_logsOrderByWithAggregationInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    resource?: SortOrder
    action?: SortOrder
    status?: SortOrder
    ip_address?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: access_logsCountOrderByAggregateInput
    _max?: access_logsMaxOrderByAggregateInput
    _min?: access_logsMinOrderByAggregateInput
  }

  export type access_logsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<access_logsScalarWhereWithAggregatesInput>
    OR?: Enumerable<access_logsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<access_logsScalarWhereWithAggregatesInput>
    log_id?: UuidWithAggregatesFilter | string
    user_id?: UuidWithAggregatesFilter | string
    resource?: StringWithAggregatesFilter | string
    action?: StringWithAggregatesFilter | string
    status?: StringWithAggregatesFilter | string
    ip_address?: StringNullableWithAggregatesFilter | string | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type error_logsWhereInput = {
    AND?: Enumerable<error_logsWhereInput>
    OR?: Enumerable<error_logsWhereInput>
    NOT?: Enumerable<error_logsWhereInput>
    log_id?: UuidFilter | string
    service?: StringFilter | string
    error_type?: StringFilter | string
    message?: StringFilter | string
    stack_trace?: StringNullableFilter | string | null
    user_id?: UuidNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
  }

  export type error_logsOrderByWithRelationInput = {
    log_id?: SortOrder
    service?: SortOrder
    error_type?: SortOrder
    message?: SortOrder
    stack_trace?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
  }

  export type error_logsWhereUniqueInput = {
    log_id?: string
  }

  export type error_logsOrderByWithAggregationInput = {
    log_id?: SortOrder
    service?: SortOrder
    error_type?: SortOrder
    message?: SortOrder
    stack_trace?: SortOrderInput | SortOrder
    user_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: error_logsCountOrderByAggregateInput
    _max?: error_logsMaxOrderByAggregateInput
    _min?: error_logsMinOrderByAggregateInput
  }

  export type error_logsScalarWhereWithAggregatesInput = {
    AND?: Enumerable<error_logsScalarWhereWithAggregatesInput>
    OR?: Enumerable<error_logsScalarWhereWithAggregatesInput>
    NOT?: Enumerable<error_logsScalarWhereWithAggregatesInput>
    log_id?: UuidWithAggregatesFilter | string
    service?: StringWithAggregatesFilter | string
    error_type?: StringWithAggregatesFilter | string
    message?: StringWithAggregatesFilter | string
    stack_trace?: StringNullableWithAggregatesFilter | string | null
    user_id?: UuidNullableWithAggregatesFilter | string | null
    created_at?: DateTimeWithAggregatesFilter | Date | string
  }

  export type audit_logsCreateInput = {
    audit_id?: string
    user_id?: string | null
    action_type: string
    resource?: string | null
    resource_id?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type audit_logsUncheckedCreateInput = {
    audit_id?: string
    user_id?: string | null
    action_type: string
    resource?: string | null
    resource_id?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type audit_logsUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type audit_logsUncheckedUpdateInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type audit_logsCreateManyInput = {
    audit_id?: string
    user_id?: string | null
    action_type: string
    resource?: string | null
    resource_id?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: string | null
    event_time?: Date | string
  }

  export type audit_logsUpdateManyMutationInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type audit_logsUncheckedUpdateManyInput = {
    audit_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    action_type?: StringFieldUpdateOperationsInput | string
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    resource_id?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    performed_by?: NullableStringFieldUpdateOperationsInput | string | null
    event_time?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type api_logsCreateInput = {
    log_id?: string
    user_id?: string | null
    endpoint: string
    method: string
    status_code: number
    response_time?: number | null
    error_message?: string | null
    created_at?: Date | string
  }

  export type api_logsUncheckedCreateInput = {
    log_id?: string
    user_id?: string | null
    endpoint: string
    method: string
    status_code: number
    response_time?: number | null
    error_message?: string | null
    created_at?: Date | string
  }

  export type api_logsUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    endpoint?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status_code?: IntFieldUpdateOperationsInput | number
    response_time?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type api_logsUncheckedUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    endpoint?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status_code?: IntFieldUpdateOperationsInput | number
    response_time?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type api_logsCreateManyInput = {
    log_id?: string
    user_id?: string | null
    endpoint: string
    method: string
    status_code: number
    response_time?: number | null
    error_message?: string | null
    created_at?: Date | string
  }

  export type api_logsUpdateManyMutationInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    endpoint?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status_code?: IntFieldUpdateOperationsInput | number
    response_time?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type api_logsUncheckedUpdateManyInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    endpoint?: StringFieldUpdateOperationsInput | string
    method?: StringFieldUpdateOperationsInput | string
    status_code?: IntFieldUpdateOperationsInput | number
    response_time?: NullableIntFieldUpdateOperationsInput | number | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type access_logsCreateInput = {
    log_id?: string
    user_id: string
    resource: string
    action: string
    status: string
    ip_address?: string | null
    created_at?: Date | string
  }

  export type access_logsUncheckedCreateInput = {
    log_id?: string
    user_id: string
    resource: string
    action: string
    status: string
    ip_address?: string | null
    created_at?: Date | string
  }

  export type access_logsUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type access_logsUncheckedUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type access_logsCreateManyInput = {
    log_id?: string
    user_id: string
    resource: string
    action: string
    status: string
    ip_address?: string | null
    created_at?: Date | string
  }

  export type access_logsUpdateManyMutationInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type access_logsUncheckedUpdateManyInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    ip_address?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type error_logsCreateInput = {
    log_id?: string
    service: string
    error_type: string
    message: string
    stack_trace?: string | null
    user_id?: string | null
    created_at?: Date | string
  }

  export type error_logsUncheckedCreateInput = {
    log_id?: string
    service: string
    error_type: string
    message: string
    stack_trace?: string | null
    user_id?: string | null
    created_at?: Date | string
  }

  export type error_logsUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    error_type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack_trace?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type error_logsUncheckedUpdateInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    error_type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack_trace?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type error_logsCreateManyInput = {
    log_id?: string
    service: string
    error_type: string
    message: string
    stack_trace?: string | null
    user_id?: string | null
    created_at?: Date | string
  }

  export type error_logsUpdateManyMutationInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    error_type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack_trace?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type error_logsUncheckedUpdateManyInput = {
    log_id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    error_type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack_trace?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type audit_logsCountOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    resource?: SortOrder
    resource_id?: SortOrder
    details?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
  }

  export type audit_logsMaxOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    resource?: SortOrder
    resource_id?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
  }

  export type audit_logsMinOrderByAggregateInput = {
    audit_id?: SortOrder
    user_id?: SortOrder
    action_type?: SortOrder
    resource?: SortOrder
    resource_id?: SortOrder
    performed_by?: SortOrder
    event_time?: SortOrder
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

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
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

  export type api_logsCountOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    method?: SortOrder
    status_code?: SortOrder
    response_time?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
  }

  export type api_logsAvgOrderByAggregateInput = {
    status_code?: SortOrder
    response_time?: SortOrder
  }

  export type api_logsMaxOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    method?: SortOrder
    status_code?: SortOrder
    response_time?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
  }

  export type api_logsMinOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    endpoint?: SortOrder
    method?: SortOrder
    status_code?: SortOrder
    response_time?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
  }

  export type api_logsSumOrderByAggregateInput = {
    status_code?: SortOrder
    response_time?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
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

  export type access_logsCountOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    resource?: SortOrder
    action?: SortOrder
    status?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type access_logsMaxOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    resource?: SortOrder
    action?: SortOrder
    status?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type access_logsMinOrderByAggregateInput = {
    log_id?: SortOrder
    user_id?: SortOrder
    resource?: SortOrder
    action?: SortOrder
    status?: SortOrder
    ip_address?: SortOrder
    created_at?: SortOrder
  }

  export type error_logsCountOrderByAggregateInput = {
    log_id?: SortOrder
    service?: SortOrder
    error_type?: SortOrder
    message?: SortOrder
    stack_trace?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type error_logsMaxOrderByAggregateInput = {
    log_id?: SortOrder
    service?: SortOrder
    error_type?: SortOrder
    message?: SortOrder
    stack_trace?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type error_logsMinOrderByAggregateInput = {
    log_id?: SortOrder
    service?: SortOrder
    error_type?: SortOrder
    message?: SortOrder
    stack_trace?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
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