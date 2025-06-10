import Express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mainConfigs from './config/env.config';
import { CorsMiddleware } from './middleware/cors.middleware';
import ErrorMiddleware from './middleware/error.middleware';
import mainRouter from './routes';

class Application {
  private _app: Express.Application;

  constructor() {
    this._app = Express();
  }

  private middlewares() {
    new CorsMiddleware(this._app).use();

    this._app.use(morgan(mainConfigs.env.name === 'development' ? 'dev' : 'combined'));
    this._app.use(helmet());
    this._app.use(Express.json());
    this._app.use(Express.urlencoded({ extended: true }));
  }

  private routes() {
    this._app.use(mainRouter);
  }

  private errorHandler() {
    new ErrorMiddleware(this._app).use();
  }

  public run(port: number) {
    this.middlewares();
    this.routes();
    this.errorHandler();
    this._app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const application = new Application();

export default application;
