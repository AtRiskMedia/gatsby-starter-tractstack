import { useStaticQuery, graphql } from 'gatsby'

export const useProductData = () => {
  const { allShopifyProduct } = useStaticQuery(graphql`
    query shopifyProducts {
      allShopifyProduct(filter: { status: { eq: ACTIVE } }) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            priceRangeV2 {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            storefrontId
            tags
            status
            featuredImage {
              altText
              gatsbyImageData(layout: CONSTRAINED, width: 640, aspectRatio: 1)
            }
            variants {
              availableForSale
              storefrontId
              title
              price
              selectedOptions {
                name
                value
              }
            }
            options {
              name
              values
            }
          }
        }
      }
    }
  `)

  return allShopifyProduct.edges
}
