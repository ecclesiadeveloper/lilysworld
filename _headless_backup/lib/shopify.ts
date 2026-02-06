import { SHOPIFY_GRAPHQL_API_ENDPOINT } from './constants';
import { Product, Connection, Cart, Collection } from '@/types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01';

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: object;
}): Promise<{ status: number; body: T } | never> {
  if (!domain || !accessToken) {
    console.warn("Shopify credentials missing. Returning mock data.");
    return {
      status: 200,
      body: {
        products: { edges: [] },
        product: null,
        cart: null,
        cartCreate: { cart: { id: 'mock', lines: { edges: [] }, cost: { subtotalAmount: { amount: '0', currencyCode: 'USD' } } } },
        cartLinesAdd: { cart: { id: 'mock', lines: { edges: [] }, cost: { subtotalAmount: { amount: '0', currencyCode: 'USD' } } } },
        cartLinesRemove: { cart: { id: 'mock', lines: { edges: [] }, cost: { subtotalAmount: { amount: '0', currencyCode: 'USD' } } } },
        cartLinesUpdate: { cart: { id: 'mock', lines: { edges: [] }, cost: { subtotalAmount: { amount: '0', currencyCode: 'USD' } } } }
      } as unknown as T
    };
  }

  const endpoint = `https://${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
  const key = accessToken;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body: body.data
    };
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }

    throw {
      error: e,
      query
    };
  }
}

const PRODUCTS_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    seo {
      title
      description
    }
    updatedAt
  }
`;

const GET_PRODUCTS_QUERY = `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCTS_FRAGMENT}
`;

const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCTS_FRAGMENT}
`;

const CREATE_CART_MUTATION = `
  mutation createCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        totalQuantity
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        totalQuantity
      }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        totalQuantity
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        totalQuantity
      }
    }
  }
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                selectedOptions {
                  name
                  value
                }
                product {
                  title
                  handle
                }
              }
            }
          }
        }
      }
      totalQuantity
    }
  }
`;

const COLLECTION_FRAGMENT = `
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    seo {
      title
      description
    }
    updatedAt
  }
`;

const GET_COLLECTION_QUERY = `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFragment
      products(first: 100, sortKey: TITLE) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCTS_FRAGMENT}
`;

const GET_COLLECTIONS_QUERY = `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...CollectionFragment
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export async function getProducts({ sortKey, reverse, query }: { sortKey?: string, reverse?: boolean, query?: string }): Promise<Product[]> {
  const res = await shopifyFetch<{ products: Connection<Product> }>({
    query: GET_PRODUCTS_QUERY,
    tags: ['products'],
    variables: {
      sortKey,
      reverse,
      query
    }
  });

  return res.body.products.edges.map((edge) => edge.node);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<{ product: Product }>({
    query: GET_PRODUCT_QUERY,
    tags: ['products'],
    variables: {
      handle
    }
  });

  return res.body.product;
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<{ cartCreate: { cart: Cart } }>({
    query: CREATE_CART_MUTATION,
    cache: 'no-store'
  });

  return res.body.cartCreate.cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const res = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return res.body.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return res.body.cartLinesRemove.cart;
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const res = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>({
    query: UPDATE_CART_MUTATION,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return res.body.cartLinesUpdate.cart;
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<{ cart: Cart }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store'
  });

  return res.body.cart;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<{ collections: Connection<Collection> }>({
    query: GET_COLLECTIONS_QUERY,
    tags: ['collections']
  });

  return res.body?.collections?.edges?.map((edge) => edge.node) || [];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<{ collection: Collection }>({
    query: GET_COLLECTION_QUERY,
    tags: ['collections'],
    variables: {
      handle
    }
  });

  return res.body.collection;
}
