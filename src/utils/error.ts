export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

export class UserExistsError extends AuthError {
  constructor(message: string = "User already exists") {
    super(message, 409); //
    this.name = "UserExistsError";
  }
}

export class UsernameNotFoundError extends AuthError {
  constructor(message: string = "Username not found") {
    super(message, 404);
    this.name = "UsernameNotFoundError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = "Invalid credentials") {
    super(message, 401);
    this.name = "InvalidCredentialsError";
  }
}
