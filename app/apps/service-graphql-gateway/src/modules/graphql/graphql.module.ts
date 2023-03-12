import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { DateScalar } from './scalars/DateScalarType';
import { GraphqlOptions } from './graphql.options';
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [],
      useClass: GraphqlOptions,
    }),
  ],
  // providers: [DateScalar],
})
export class GraphqlModule {}
