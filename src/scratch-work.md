# template for each new page

```js

import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"
```

```js
const gdpData = FileAttachment("./data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
const fullParks = FileAttachment("./data/NPS/full_parks_dataset.csv").csv({typed: true})
const parkFees = FileAttachment("./data/NPS/park_fees.csv").csv({typed: true})
```

```js
parkFees
```

```js
const multiDay = []
const singleDay = []
for (const fee of parkFees) {
  if (fee.feeType.includes("Reservation") == false) {
    if (fee.feeType.includes("Group") == false){
      if (fee.description.includes("seven") || fee.description.includes("7") && fee.description.includes("7 am") == false || fee.description.includes("days")) {
        multiDay.push({name:fee.name, type: fee.feeType, cost: fee.cost})
      }
      else {
        singleDay.push({name:fee.name, type: fee.feeType, cost: fee.cost})
      }
    }
  }
} 
```
multi day

```js
singleDay
```
### Multi-Day Entry
The following parks charge an entrance fee that allows entry to the park for up to seven days.

***Note:** Group rates not included in this list.*
```js
Inputs.table(multiDay,{
    columns: [
      "name",
      "type",
      "cost",
    ],
    header: {
      name: "Park",
      type: "Entrance Type",
      cost: "Cost (USD)",
    },
    width: {
      name: "40%",
      type: "40%",
      cost: "20%",
    },
  }
)
```
### Multi-Day Entry
The following parks charge an entrance fee that allows entry to the park for only one day.
```js
Inputs.table(singleDay,{
  columns: [
      "name",
      "type",
      "cost",
    ],
    header: {
      name: "Park",
      type: "Entrance Type",
      cost: "Cost (USD)",
    },
    width: {
      name: "40%",
      type: "40%",
      cost: "20%",
    },
  }
)
```

```js
const multiNames = getUniquePropListBy(multiDay, "name")
const singleNames = getUniquePropListBy(singleDay, "name")
```
```js
multiNames
```
```js
singleNames
```
```js
const colOfInterest = "cost"
const multiRollup = d3.rollup(
  multiDay,

  leaf => {
    return {
      mean: d3.mean(leaf, l => l[colOfInterest]),
      median: d3.median(leaf, l => l[colOfInterest]),
      mode: d3.mode(leaf, l => l[colOfInterest]),
      min: d3.min(leaf, l => l[colOfInterest]),
      max: d3.max(leaf, l => l[colOfInterest]),
    }
  },
  d => d.type,
)
```
```js
multiRollup
```
```js
const multiTendencies = Array.from(
  multiRollup,
  ([type, ctResults]) => {
    return {
      type: type,
      mean: ctResults.mean,
      median: ctResults.median,
      mode: ctResults.mode,
      min: ctResults.min,
      max: ctResults.max,
  }
  }
)
```
```js
Inputs.table(multiTendencies,
  {
    columns: [
      "type",
      "mean",
    ],
      width: {
      type: "50%",
      mean: "50%",
    },
    align: {
      type: "left",
      mean: "left",
    },
    header: {
      type: "Entrance Type",
      mean: "Average Cost to Enter (USD)",
    },
  }
)
```

```js
const colOfInterest = "cost"
const singleRollup = d3.rollup(
  singleDay,
  leaf => {
    return {
      mean: d3.mean(leaf, l => l[colOfInterest]),
      median: d3.median(leaf, l => l[colOfInterest]),
      mode: d3.mode(leaf, l => l[colOfInterest]),
      min: d3.min(leaf, l => l[colOfInterest]),
      max: d3.max(leaf, l => l[colOfInterest]),
    }
  },
  d => d.type,
)
```
```js
const singleTendencies = Array.from(
  singleRollup,
  ([type, ctResults]) => {
    return {
      type: type,
      mean: ctResults.mean,
      median: ctResults.median,
      mode: ctResults.mode,
      min: ctResults.min,
      max: ctResults.max,
  }
  }
)
```
```js
Inputs.table(singleTendencies,
  {
    columns: [
      "type",
      "mean",
    ],
      width: {
      type: "50%",
      mean: "50%",
    },
    align: {
      type: "left",
      mean: "left",
    },
    header: {
      type: "Entrance Type",
      mean: "Average Cost to Enter (USD)",
    },
  }
)
```
```js
const parkFeesMinusOutlier = []
for (const fee of parkFees) {
  if (fee.cost != 300) {
    console.log(fee)
    parkFeesMinusOutlier.push(fee)
  }
}
```
```js
parkFeesMinusOutlier
```
```js
Plot.plot({
  width: 1000,
  height: 500,
  x: {
    grid: true,
    inset: 100,
    label: "Cost of Entry", 
  },
  
  marks: [
    Plot.boxX(parkFeesMinusOutlier, {y: "feeType", x: "cost", interval: 10, tip: true})
  ]
})
```