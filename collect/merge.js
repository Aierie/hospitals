/**
 * Merge existing MOH data with geocode data
 */

const fs = require("fs");
const d3 = require("d3-dsv");

const mohData = require("../data/hospitalData.json");
const geocodeData = require("../data/geocodeData.json");
const mapsData = d3.csvParse(
  fs.readFileSync("../data/googleMapsLocations.csv", { encoding: "utf-8" })
);

const res = [];

for (let item of mohData) {
  const geocode = geocodeData.find((o) => o.name === item.name);
  const maps = mapsData.find((o) => o.name === item.name);
  const {
    lat: latitude,
    lng: longitude,
  } = geocode.results[0].geometry.location;
  const merged = {
    name: item.name,
    latitude,
    longitude,
    globalPlusCode: geocode.results[0].plus_code.global_code,
    phone: item.phone,
    website: item.website,
    beds: item.beds,
    address: item.address,
    city: item.city,
    state: item.state,
    notes: maps.notes,
    mapsAddress: maps["maps address"],
  };
  res.push(merged);
}

fs.writeFile(
  "../data/results.json",
  JSON.stringify(res, null, 2),
  null,
  (err) => err || console.log("wrote json")
);

fs.writeFile(
  "../data/results.csv",
  d3.csvFormat(res),
  null,
  (err) => err || console.log("wrote csv")
);
