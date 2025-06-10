interface UserPayload {
  uid: string;
  email: string;
}

declare namespace Express {
  export interface Request {
    user?: UserPayload;
  }
}