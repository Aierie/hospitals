const geoCodeData = require("../data/geocodeData.json");

geoCodeData.forEach((o) => {
  if (o.results.length !== 1) {
    throw new Error("Oh no wrong number of results for " + o.name);
  }
});
