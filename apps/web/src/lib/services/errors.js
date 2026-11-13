/**
 * Domain error shared by the service layer. Transports translate it:
 *   REST    -> NextResponse.json({ error, code }, { status })
 *   GraphQL -> GraphQLError with extensions.code
 * Keeping HTTP/GraphQL concerns out of services is what lets both APIs share one
 * implementation of every business rule.
 */
export class ServiceError extends Error {
  /**
   * @param {string} code    machine-readable, e.g. "NOT_FOUND"
   * @param {string} message human-readable
   * @param {number} status  HTTP status used by the REST transport
   */
  constructor(code, message, status = 400) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.status = status
  }
}
