# refactoring the fees

```js

import {getUniquePropListBy, downloadAsCSV, filterData} from "./../utils/utils.js"
```

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
const fullParks = FileAttachment("./../data/NPS/full_parks_dataset.csv").csv({typed: true})
const parkFees = FileAttachment("./../data/NPS/park_fees.csv").csv({typed: true})
const parkFeesRefactored = FileAttachment("./../data/NPS/park_fees_refactored.csv").csv({typed: true})
```

```js
fullParks
```
```js
let parkFeesRefac = parkFees
```


```js
const newFeesArray =[]
for (const park of fullParks) {
  if (park.entranceFees == "no") {
   parkFeesRefac.push({name: park.name, feeType: "None", cost: 0, description: "No fees charged."})
  }
}
```

```js
parkFeesRefac
```
```js
    view(downloadAsCSV(async () => {
      const csvFullString = d3.csvFormat(parkFeesRefac);
      return new Blob([csvFullString], { type: "text/csv" });
    }, "untitled", "Save Full Data Set As CSV"));
```
```js
parkFeesRefactored
```