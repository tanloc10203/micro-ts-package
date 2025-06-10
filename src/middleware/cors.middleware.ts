import mainConfigs from '@/config/env.config';
import cors from 'cors';
import { Application } from 'express';

export class CorsMiddleware {
  constructor(private _app: Application) {}
  
  public use() {
    this._app.use(
      cors({
        origin: mainConfigs.cors.origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      })
    );
  }
}
