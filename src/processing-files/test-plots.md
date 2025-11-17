# testing out different plots

```js

import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"
```

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024_reformatted.csv").csv({typed: true})
const fullParks = FileAttachment("./../data/NPS/full_parks_dataset.csv").csv({typed: true})
const parkFees = FileAttachment("./../data/NPS/park_fees.csv").csv({typed: true})
```
Looking at GDP and Unemployment and Visitation
```js
unEmpData
```
```js
fullParks
```
```js
const parkSelection = 0
for (const park of fullParks) {
  for (const yearData of annualVisits) {

  }
}
```

```js
let selectState = view(
  Inputs.select(
    fullParks.map(d => d.states),
    {
      unique: true,
      label: "Select states:",
      multiple: true,
      value: [""],
    }
  )
)
```
```js
console.log(selectState)
```
```js
Plot.plot({

  grid: true,
  x: {
    axis: "bottom",
    label: "Year (2008-2024)"

  },
  marks: [
    Plot.ruleY([0]),
    Plot.line(unEmpData, {x: "Year", y: "California", tip: true, stroke: "white"}),
    //  Plot.barY(annualVisits, {x: "Year", y: "Acadia National Park", tip: true, stroke: "red",})
  ]
}

)
```
```js
```

```js
{}
```
