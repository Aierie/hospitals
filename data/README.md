# File descriptions
## hospitalData.csv + hospitalData.json
Files with data scraped from moh's list of public hospitals

## googleMapsLocations.csv
Manually collected data (plus code and google maps address) from google maps

## geoCodeData.json
Data collected by using plus codes to get geocode data from the google Geocoding API.

## results.csv + results.json
Compilation of geocode data + hospital data from moh + maps data


# Details of results.csv + results.json
- name: name of the hospital, as shown on the moh listing. may not be the same as google maps name.
- latitude: latitude
- longitude: longitude
- globalPlusCode: plus code from google maps geocoding api
- phone: phone number of the hospital
- website: website of the hospital
- beds: number of beds the hospital has
- address: address as shown by the moh listing
- city: city the hospital is in
- state: state the hospital is in
- notes: some notes I took while manually collecting data from google maps
- mapsAddress: address as shown by google maps
