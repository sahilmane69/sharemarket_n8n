import { Request, Response } from 'express';

export interface ApiRequest<T = any> extends Request {
  body: T;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
