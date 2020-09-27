/**
 * Get geocode data using plus codes manually collected from google maps
 */

require("dotenv").config();
const fs = require("fs");
const d3 = require("d3-dsv");
const googleMapsLocations = d3.csvParse(
  fs.readFileSync("./data/googleMapsLocations.csv", { encoding: "utf-8" })
);
const axios = require("axios");

const waitAQuarterSecond = () =>
  new Promise((resolve) => setTimeout(resolve, 250));

const api = "https://maps.googleapis.com/maps/api/geocode/";
const outputFormat = "json";
const geocode = async (plusCode) => {
  const address = encodeURIComponent(plusCode);
  return await axios
    .get(
      `${api}${outputFormat}?address=${address}&key=${process.env.GEOCODING_API_KEY}`
    )
    .then((v) => v.data.results);
};

const data = [];
(async () => {
  for (let o of googleMapsLocations) {
    await waitAQuarterSecond();
    const res = {
      name: o.name,
    };
    res.results = await geocode(o.plus);
    data.push(res);
  }
  return data;
})().then(() =>
  fs.writeFile(
    "geocodeData.json",
    JSON.stringify(data, null, 2),
    null,
    (err) => err || console.log("wrote geocode json")
  )
);
