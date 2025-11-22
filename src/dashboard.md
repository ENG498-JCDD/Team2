---
theme: dashboard
title: National Park Visitation and Economic Turmoil
toc: false
---

```js
//imports
import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"
```

```js
//formatters
const numberNoCommasFormatter = d3.format("")
```

```js
//data
const gdpData = FileAttachment("./data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
const fullParks = FileAttachment("./data/NPS/full_parks_dataset.csv").csv({typed: true})
const parkFees = FileAttachment("./data/NPS/park_fees.csv").csv({typed: true})
const avgVisits = FileAttachment("./data/NPS/annual_visits_2008_2024_original.csv").csv({typed: true})

```
# National Park Visitation and Economic Turmoil

Is there a link between national park visitation and economic difficulty? We believe there could be, because national parks could provide a low cost, engaging and memorable activity. Here, we present a case for the relationship between national park visitation, state GDP and state unemployment rates. 

<!-- Load and transform the data -->

```js
const launches = FileAttachment("data/launches.csv").csv({typed: true});
// change this to our data files/files
```

```js
const feeTypes = getUniquePropListBy(parkFees, "feeType")
```
```js
const colOfInterest = "cost"

// 1. Use `.rollup()`
const feeRollup = d3.rollup(
  parkFees,
  // Based on the leaf node, create object of CT info
  //this function is looking at the leaf and perfoming other functions rather than counting like we have before
  
  //so in this case it will find everything with a particular hostname, and perform these evaluations based on that leaf
  leaf => {
    return {
      mean: d3.mean(leaf, l => l[colOfInterest]),
      median: d3.median(leaf, l => l[colOfInterest]),
      mode: d3.mode(leaf, l => l[colOfInterest]),
      min: d3.min(leaf, l => l[colOfInterest]),
      max: d3.max(leaf, l => l[colOfInterest]),
    }
  },
  // Will group at per type level
  d => d.feeType,
)
```

```js
const feeCentralTendencies = Array.from(
  feeRollup,
  ([type, ctResults]) => {
    return {
      feeType: type,
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
const color = Plot.scale({
  color: {
    type: "categorical",
    domain: d3.groupSort(launches, (D) => -D.length, (d) => d.state).filter((d) => d !== "Other"),
    unknown: "var(--theme-foreground-muted)"
  }
});
```

<!-- Cards with big numbers -->
<!-- change these to reflect total numbers of park visitation, average cost for a trip for an individual, then maybe average cost for an average sized family? could be an opportunity for beginning story with the costs (prove its a fund cheap activity, also assert popularity)-->

## Average Cost of Entry
<div class="grid grid-cols-3">
  <div class="card">
    <h2>Individual Entry -- Per Person</h2>
    <span class="big">${"$15.76"}</span>
  </div>
 <div class="card">
    <h2>Individual Entry -- Per Car</h2>
    <span class="big">${"$29.47"}</span>
  </div>
  <div class="card">
    <h2>Individual Entry -- Motorcycle</h2>
    <span class="big">${"$24.61"}</span>
  </div>
</div>

<!-- adding in another plot to show spread -->

<!-- processing which have multi day and which have single day entry -->
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
#### Average Cost for Multi-Day Entry
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


### Single Day Entry
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
#### Average Cost for Single Day Entry Passes
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

<!-- maybe plot of visitation of parks per state over the years? or maybe average visitation of all parks over the years. Could also do: average park visitation compared to average gdp compared to average unemployment since 2008 (year is x, other things over y) -->

<!-- I think here we should have the drop down to pick which park we are looking at -->



## Visitation Over the Years

<!-- PLOT INFO STARTS HERE -->
```js
let parkSelection = view(
  Inputs.select(
    // Get unique list of years as Integer/Number
    getUniquePropListBy(fullParks, "name"),
    {
      label: html`<em>Select which park</em>`,
      value: "",
    }
  )
)
```
```js
Plot.plot({
    width: 1000,
    marginLeft: 55,
  x:{
    tickFormat: (d) => {
      if( d != "Average") {
      return numberNoCommasFormatter(d)
      }
      else {
        return d
      }
    },
    y: {
      grid: true,
      label: "Visits per Year",
      // domain: yDomain,
    },
  },
  color: {
    type: "linear",
    scheme: "brbg",
  },
  marks: [
    Plot.barY(annualVisits,
      {
        x: "Year",
        y: parkSelection,
        fill: "Year",
        tip :{
          format: {
            x: (d) => numberNoCommasFormatter(d),
          }
        }
      }
    ),
  ]
})
```
<!-- PLOT INFO ENDS HERE -->