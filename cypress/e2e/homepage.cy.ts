describe("Homepage Functionality", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the homepage before each test
  });

  it("should fetch user location and update the input field", () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((callback) => {
        callback({
          coords: {
            latitude: 51.505,
            longitude: -0.09,
          },
        });
      });
    });

    // Click the location icon to fetch user location
    cy.get(".pi-map-marker").click();

    // Verify the input field is updated with a location
    cy.get('input[placeholder="Enter a location"]').should("not.be.empty");
  });

  it("should fetch and display restaurants in a grid", () => {
    cy.intercept("POST", "/graphql", {
      fixture: "restaurants.json", // Mock response
    }).as("getRestaurants");

    // Click the "Find Restaurants" button
    cy.contains("Find Restaurants").click();

    // Wait for the API request to complete
    cy.wait("@getRestaurants");

    // Verify restaurants are displayed in a grid
    cy.get(".grid").should("exist");
    cy.get(".grid > div").should("have.length.greaterThan", 0);
  });

  it("should display autocomplete suggestions when typing a location", () => {
    cy.intercept("GET", "https://nominatim.openstreetmap.org/search*", {
      fixture: "autocomplete.json", // Mock response
    }).as("getAutocomplete");

    // Type into the location input field
    cy.get('input[placeholder="Enter a location"]').type("London");

    // Wait for API response
    cy.wait("@getAutocomplete");

    // Verify suggestions are displayed
    cy.get(".absolute.z-20").should("exist");
    cy.get(".absolute.z-20 > div").should("have.length.greaterThan", 0);
  });

  it("should sync dropdown selection with the input field", () => {
    // Open the country dropdown
    cy.get(".p-dropdown").click();

    // Select a country (e.g., Cyprus)
    cy.contains("Cyprus").click();

    // Verify that the input field updates accordingly
    cy.get('input[placeholder="Enter a location"]').should("have.value", "Cyprus");
  });
});
