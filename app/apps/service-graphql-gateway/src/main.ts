/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import compression from 'compression';
import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app/app.module';
import {getLogLevels} from "@mp-workspace/util";
import {extendBorsh} from "./utils/extend-borsh";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // compression
  app.use(compression());

  extendBorsh();

  const port = process.env.PORT || 3333;
  const server = await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  // https://stackoverflow.com/questions/49187932/nestjs-request-timeout
  server.setTimeout(300 * 1000); // 5 min
}

bootstrap();




