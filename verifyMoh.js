/**
 * Verify MOH data
 */

const data = require("./data/hospitalData.json");
const throwIfNot = (o, k) => {
  if (o[k] === null || !o[k] || o[k] === "null") {
    console.log(`Missing ${k}`, o.name);
  }
};

// make sure that all these properties are on the object
data.forEach((o) => {
  ["address", "state", "city", "name", "phone"].forEach((k) => throwIfNot(o, k));
});

// No duplicate names
if (!data.map((o) => o.name).every((v, i, a) => a.indexOf(v) === i)) {
  throw new Error("Duplicated name");
}
