module.exports = {
  client: {
    name: 'localhost [www]',
    service: {
      name: 'localhost',
      url: 'http://localhost:4300/graphql',
      // optional disable SSL validation check
      skipSSLValidation: true
    },
    tagName: "gql",
    addTypename: true,
    includes: [
      'libraries/**/*.ts',
      'components/**/*.ts',
      'components/**/*.tsx',
      'containers/**/*.ts',
      'containers/**/*.tsx'
    ],
  },
};

// yarn run apollo codegen:generate --target=typescript --globalTypesFile=src/types/graphql-global-types.ts types
