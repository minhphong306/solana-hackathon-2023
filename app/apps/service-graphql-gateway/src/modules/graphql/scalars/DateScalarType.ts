// // https://github.com/graphql-compose/graphql-compose/blob/master/src/type/date.js
// import isNaN from 'lodash/isNaN';
// import { Scalar, CustomScalar } from '@nestjs/graphql';
// import { Kind, ValueNode } from 'graphql';
// import { GraphQLError } from 'graphql/error';
//
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function parseDate(value: any): Date {
//   const result = new Date(value);
//   if (isNaN(result.getTime())) {
//     throw new TypeError(`Invalid date: ${value}`);
//   }
//   if (value !== result.toJSON()) {
//     throw new TypeError(`Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSSZ: ${value}`);
//   }
//   return result;
// }
//
//
// @Scalar('Date')
// export class DateScalar implements CustomScalar<string, Date> {
//   description = 'Date custom scalar type';
//
//   // Serialize a date to send to the client.
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   serialize(value: any): string {
//     // Valid string values from server side:
//     // 2016-02-02
//     // 2016-02-02T00:13:22Z
//     // 2016-02-02T00:13:22.000Z
//     if (
//       typeof value === 'string' &&
//       /^(\d{4})-(\d{2})-(\d{2})(T((\d{2}):(\d{2}):(\d{2}))(\.(\d{1,3}))?Z)?$/.test(value)
//     ) {
//       return value;
//     }
//
//     if (typeof value === 'number' && Number.isFinite(value)) {
//       return new Date(value).toJSON();
//     }
//
//     if (!(value instanceof Date)) {
//       throw new TypeError('Field error: value is not an instance of Date');
//     }
//
//     if (isNaN(value.getTime())) {
//       throw new TypeError('Field error: value is an invalid Date');
//     }
//
//     // will be serialized to '2019-01-10T08:55:04.913Z'
//     return value.toJSON();
//   }
//   // Parse a date received as a query variable.
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   parseValue(value: any): Date {
//     if (typeof value !== 'string') {
//       throw new TypeError('Field error: value is not an instance of string');
//     }
//     return parseDate(value);
//   }
//
//   // Parse a date received as an inline value.
//   parseLiteral(ast: ValueNode): Date {
//     if (ast.kind !== Kind.STRING) {
//       throw new GraphQLError(`Query error: Can only parse strings to dates but got a: ${ast.kind}`, [ast]);
//     }
//     try {
//       return parseDate(ast.value);
//     } catch (e) {
//       throw new GraphQLError(`Query error: ${e.message}`, [ast]);
//     }
//   }
// }
