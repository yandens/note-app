import type { ZodIssue } from 'zod';

export default class ApiError extends Error {
  statusCode!: number;

  constructor(statusCode = 500, message = 'internal_server_error') {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  issues!: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    super();
    this.issues = issues;
  }
}
