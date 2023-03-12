import {
  SchemaDirectiveVisitor,
  AuthenticationError
} from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export default class IsAuthenticated extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = function(...args) {
      const { currentUser } = args[2];

      if (!currentUser || Object.keys(currentUser).length === 0) {
        throw new AuthenticationError(
          'Authentication token is invalid, please try again.'
        );
      }

      return resolve.apply(this, args);
    };
  }
}
