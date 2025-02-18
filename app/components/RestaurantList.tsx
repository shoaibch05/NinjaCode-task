import React from "react";

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  address: string;
}

interface RestaurantsProps {
  data: any;
}

const Restaurants: React.FC<RestaurantsProps> = ({ data }) => {
  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">Restaurants Near You</h2>
      {data?.nearByRestaurants?.restaurants?.length === 0 ? (
        <p>No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.nearByRestaurants?.restaurants?.map(
            (restaurant: Restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white p-4 shadow-md rounded-lg"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                <p className="text-gray-500">{restaurant.address}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Restaurants;