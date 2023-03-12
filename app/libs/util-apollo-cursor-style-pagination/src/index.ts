// import keys from 'lodash/keys';
import { FieldPolicy, Reference, StoreObject } from '@apollo/client';
// import { mergeDeep } from '@apollo/client/utilities';

type KeyArgs = FieldPolicy<any>["keyArgs"];

export function mergePagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing, incoming) {
      return existing ? {
        ...existing,
        ...incoming,
       } : incoming;
    },
  };
}

// A very basic pagination field policy that always concatenates new
// results onto the existing array, without examining options.args.
export function concatPagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing, incoming) {
      return existing ? [
        ...existing,
        ...incoming,
      ] : incoming;
    },
  };
}

// A basic field policy that uses options.args.{offset,limit} to splice
// the incoming data into the existing array. If your arguments are called
// something different (like args.{start,count}), feel free to copy/paste
// this implementation and make the appropriate changes.
export function offsetLimitPagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      // console.log(existing, incoming, args, 'existing, incoming');
      const merged = existing ? existing.slice(0) : [];
      if (args) {
        // Assume an offset of 0 if args.offset omitted.
        const { offset = 0 } = args;
        for (let i = 0; i < incoming.length; ++i) {
          merged[offset + i] = incoming[i];
        }
      } else {
        // It's unusual (probably a mistake) for a paginated field not
        // to receive any arguments, so you might prefer to throw an
        // exception here, instead of recovering by appending incoming
        // onto the existing array.
        merged.push.apply(merged, incoming);
      }
      return merged;
    },
  };
}

type TInternalRelay<TNode> = Readonly<{
  edges?: TMyPagingEdge<TNode>[];
  pageInfo: Readonly<{
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
  }>;
}>;

export function cursorStylePagination<TNode = Reference | StoreObject>(
  keyArgs: KeyArgs = false,
): FieldPolicy<TInternalRelay<TNode>> {
  return {
    // Don't cache separate results based on
    // any of this field's arguments.
    keyArgs,
    merge(existing = makeEmptyData(), incoming, { args, isReference, readField }) {

      // console.log('existing', existing);
      // console.log('incoming', incoming);
      // console.log('args', args);

      if (!args) return existing; // TODO Maybe throw?

      const incomingEdges = incoming.edges.slice(0);

      // if (incoming.pageInfo) {
      //   updateCursor(incomingEdges, 0, incoming.pageInfo.startCursor);
      //   updateCursor(incomingEdges, -1, incoming.pageInfo.endCursor);
      // }

      // data trước data mới
      let prefix = existing.edges;

      // data sau data mới
      let suffix: typeof prefix = [];

      // Cách hoạt động
      // Tìm vị trí cần insert (index posion)
      // nếu after thì xóa hết data sau data mới (suffix)
      // nếu before thì xóa hết data trước data mới (prefix)

      if (args.after) {
        const index = prefix.findIndex(edge => {
          if (isReference(edge = { ...edge })) {
            // In case edge is a Reference, we read out its cursor field and
            // store it as an extra property of the Reference object.
            return readField<string>("_id", edge) === args.after;
          }
          return edge._id && edge._id === args.after;
        });

        // console.log(index, 'index');

        if (index >= 0) {
          prefix = prefix.slice(0, index + 1);
          // suffix = []; // already true
        }
      } else if (args.before) {
        const index = prefix.findIndex(edge => readField("_id", edge) === args.before);

        // console.log(index, 'index');

        suffix = index < 0 ? prefix : prefix.slice(index);
        prefix = [];
      } else {
        // If we have neither args.after nor args.before, the incoming
        // edges cannot be spliced into the existing edges, so they must
        // replace the existing edges. See #6592 for a motivating example.
        prefix = [];
      }

      const edges = [
        ...prefix,
        ...incomingEdges,
        ...suffix,
      ];

      const pageInfo = {
        ...incoming.pageInfo,
        ...existing.pageInfo,
      };

      const updatePageInfo = (name: keyof TInternalRelay<TNode>["pageInfo"]) => {
        if(!incoming.pageInfo) {
          return
        }
        const value = incoming.pageInfo[name];
        if (value !== void 0) {
          (pageInfo as any)[name] = value;
        }
      };

      if (!prefix.length) {
        updatePageInfo("hasPreviousPage");
        updatePageInfo("startCursor");
      }

      if (!suffix.length) {
        updatePageInfo("hasNextPage");
        updatePageInfo("endCursor");
      }

      return {
        ...existing,
        ...incoming,
        pageInfo,
        edges
      };
    },
  };
}

// My Style cursor paging

// Whether TRelayEdge<TNode> is a normalized Reference or a non-normalized
// object, it needs a ._id property where the relayStylePagination
// merge function can store cursor strings taken from pageInfo. Storing an
// extra reference._id property should be safe, and is easier than
// attempting to update the cursor field of the normalized StoreObject
// that the reference refers to, or managing edge wrapper objects
// (something I attempted in #7023, but abandoned because of #7088).
export type TMyPagingEdge<TNode> = (TNode & {
  _id?: string;
}) | (Reference & { _id?: string });

export type TMyPagingPageInfo = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
};

export type TExistingMyPaging<TNode> = Readonly<{
  edges: TMyPagingEdge<TNode>[];
  pageInfo: TMyPagingPageInfo;
}>;

export type TIncomingMyPaging<TNode> = {
  edges?: TMyPagingEdge<TNode>[];
  pageInfo?: TMyPagingPageInfo;
};

export type MyPagingFieldPolicy<TNode> = FieldPolicy<
  TExistingMyPaging<TNode>,
  TIncomingMyPaging<TNode>,
  TIncomingMyPaging<TNode>
>;

function makeEmptyData(): TExistingMyPaging<any> {
  return {
    edges: [],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

// function mergeArrays() {
//   const mp = {};

//   const a = [1, 3, 5, 6];

//   const b = [2, 4, 5, 6, 7];

//   for(let i = 0; i < a.length; i += 1) {
//     const e = a[i];
//     if(!mp[e]) {
//       mp[e] = true;
//     }
//   }

//   for(let i = 0; i < b.length; i += 1) {
//     const e = b[i];
//     if(!mp[e]) {
//       mp[e] = true;
//     }
//   }
//   return keys(mp);
// }
