// https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/initApollo.js
import { InMemoryCache  } from '@apollo/client';
import { mergePagination, cursorStylePagination } from '@mp-workspace/util-apollo-cursor-style-pagination';
// import { offsetLimitPagination } from '@mp-workspace/util-apollo-cursor-style-pagination';
import possibleTypes from './possibleTypes.json';

let cache = null;

export default function setupCache() {
  // Reuse client on the client-side
  if (!cache) {
    const config = {
      possibleTypes,
      // https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
      // dataIdFromObject: result => {
      //   if (result._id && result.__typename) {
      //     return result.__typename + result._id;
      //   }
      //   if (result.id && result.__typename) {
      //     return result.__typename + result.id;
      //   }
      //   // NOTE: Dont uncomment this, same type will be same record
      //   // if (result.__typename) {
      //   //   return result.__typename
      //   // }
      //   if (result._id) {
      //     return result._id;
      //   }
      //   if (result.id) {
      //     return result.id;
      //   }
      //   return null;
      // },
      typePolicies: {
        // https://www.apollographql.com/docs/react/caching/cache-configuration/#data-normalization
        Query: {
          fields: {
            categories: cursorStylePagination(getKeyArgs),
            // books: cursorStylePagination(["orderBy"]),
            books: cursorStylePagination(getKeyArgs),

            findBookByCategory: cursorStylePagination((_ /** _args */, context) => {
              const { fieldName, field } = context;
              // console.log(context, _, 'context');
              return `${fieldName}:${field.alias.value}:${_.category || _.slug}`;
            }),
            // chapters: cursorStylePagination(),
            // findChapterByBookSlug: cursorStylePagination()
            findChaptersByBookSlugOffsetPaging: mergePagination(),
          },
        },
      },
    };
    cache = new InMemoryCache(config);
  }

  return cache;
}

function getKeyArgs(_ /** _args */, context) {
  const { fieldName, field } = context;

  const { orderBy } = _;
  let args = null;
  if(orderBy) {
    args = JSON.stringify(orderBy);
  }
  let result = fieldName;
  if(field.alias) {
    result = `${result}:${field.alias.value}`;
  }
  if(args) {
    result = `${result}:${args}`;
  }
  return result;
}
