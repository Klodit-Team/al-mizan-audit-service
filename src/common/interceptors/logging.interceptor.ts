import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: ApiResponse<T> | T) => {
        if (typeof data === 'object' && data !== null && 'success' in data && 'message' in data) {
          return data as ApiResponse<T>;
        }
        return {
          success: true,
          data: data as T,
          message: 'OK',
        };
      }),
    );
  }
}
