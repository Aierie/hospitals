/**
 * Scrape MOH public hospital listing
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const d3 = require("d3-dsv");

const nHospitals = 145; // as of 5:17pm on 27 September 2020
const link = `https://www.moh.gov.my/index.php/database_stores/store_view/3?items=${nHospitals}`;

const indexPageGetter = {
  1: ($, res, el) => (res.name = $(el).text()),
  3: ($, res, el) => (res.city = $(el).text()),
  4: ($, res, el) => (res.state = $(el).text()),
  5: ($, res, el) => (res.mohLink = $(el).find("a").attr("href")),
};

const trimPrevRegex = /.+ : /;

const reversedItemPageGetter = {
  0: ($, res, el) => {
    let match = $(el).text().replace(trimPrevRegex, "");
    res.beds = match ? +match.trim() : null;
  },
  1: ($, res, el) => {
    res.website = $(el).text().trim();
  },
  2: ($, res, el) => {
    let match = $(el).text().replace(trimPrevRegex, "");
    res.fax = match ? match.trim() : null;
  },
  3: ($, res, el) => {
    let match = $(el).text().replace(trimPrevRegex, "");
    res.phone = match ? match.trim() : null;
  },
};

axios
  .get(link)
  .then((v) => {
    const $ = cheerio.load(v.data);
    return $;
  })
  .then(($) => {
    const deets = [];
    $(".view_page_list_table tbody tr").each((index, el) => {
      const res = {};
      $(el)
        .find("td")
        .each((index, el) => {
          const f = indexPageGetter[index];
          f ? f($, res, el) : null;
        });
      deets.push(res);
    });
    return deets;
  })
  .then(async (deets) => {
    await Promise.all(
      deets.map(async (o) => {
        const { data } = await axios.get(o.mohLink);
        const $ = cheerio.load(data);
        const trs = $(".database_store_page_view_div > table tbody tr");
        const length = trs.length;
        const range = [1, length - 4];
        let address = [];

        trs.each((index, el) => {
          if (index === 0) {
            return;
          } else if (index >= range[0] && index < range[1]) {
            address.push($(el).text().trim());
          } else {
            reversedItemPageGetter[length - index - 1]($, o, el);
          }
        });
        o.address = address.filter(v => v).join(",\n");
      })
    );

    fs.writeFile(
      "./data/hospitalData.json",
      JSON.stringify(deets, null, 2),
      null,
      (err) => err || console.log("successfully wrote json")
    );

    fs.writeFile(
      "./data/hospitalData.csv",
      d3.csvFormat(deets),
      null,
      (err) => err || console.log("successfully wrote csv")
    )
  });
