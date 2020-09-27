/**
 * Merge existing MOH data with geocode data
 */

const fs = require("fs");
const d3 = require("d3-dsv");

const hospitalData = require("./data/hospitalData.json");
const geocodeData = require("./data/geocodeData.json");
const mapsData = d3.csvParse(
  fs.readFileSync("./data/googleMapsLocations.csv", { encoding: "utf-8" })
);

const res = [];

for (let item of hospitalData) {
  let merged = {
    name: item.name,
  };
  const geocode = geocodeData.find((o) => o.name === item.name);
  const maps = mapsData.find((o) => o.name === item.name);
  merged = {
    ...merged,
    ...maps,
    ...geocode.results[0].geometry.location,
    global_plus_code: geocode.results[0].plus_code.global_code,
  };

  res.push(merged);
}

fs.writeFile(
  "./data/results.json",
  JSON.stringify(res, null, 2),
  null,
  (err) => err || console.log("wrote json")
);

fs.writeFile(
  "./data/results.csv",
  d3.csvFormat(res),
  null,
  (err) => err || console.log("wrote csv")
);
