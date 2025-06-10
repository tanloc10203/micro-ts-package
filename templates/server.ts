import dotenv from 'dotenv';

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`,
});

if (process.env.NODE_ENV !== 'development') {
  require('module-alias/register');
}

import application from '@/app';
import mainConfigs from '@/config/env.config';

application.run(mainConfigs.app.port);
