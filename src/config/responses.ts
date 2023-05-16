const responses = {
  OK: {
    message: "OK",
    status: 200,
  },
  CREATED: {
    message: "Created",
    status: 201,
  },
  BAD_REQUEST: {
    message: "Bad request",
    status: 400,
  },
  UNAUTHORIZED: {
    message: "Unauthorized",
    status: 401,
  },
  NOT_FOUND: {
    message: "Not found",
    status: 404,
  },
  CONFLICT: {
    message: "Conflict",
    status: 409,
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal server error",
    status: 500,
  },
}

export default responses
