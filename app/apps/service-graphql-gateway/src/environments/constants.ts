import * as path from 'path';

const { NODE_ENV = 'development' } = process.env;

export const basePath =
  NODE_ENV === 'production'
    ? process.cwd()
    : path.resolve(process.cwd(), 'apps', 'service-graphql-gateway');

export const envFilePath = [path.join(basePath, 'env', '.env')];
