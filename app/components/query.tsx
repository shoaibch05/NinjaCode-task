import { gql } from "@apollo/client";

export const restaurantQuery = gql`
  query Restaurants($latitude: Float, $longitude: Float) {
    nearByRestaurants(latitude: $latitude, longitude: $longitude) {
      restaurants {
        _id
        name
        image
        slug
        address
        location {
          coordinates
        }
        deliveryTime
        minimumOrder
        tax
        rating
        isAvailable
        openingTimes {
          day
          times {
            startTime
            endTime
          }
        }
      }
    }
  }
`;