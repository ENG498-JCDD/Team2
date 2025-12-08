---

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
const visitsRefac = FileAttachment("./data/NPS/refactored_annual_visits.csv").csv({typed: true})

```
# National Park Visitation and Economic Turmoil

Is there a link between national park visitation and economic difficulty? We believe there could be, because national parks could provide a low cost, engaging and memorable activity. Here, we present a case for the relationship between national park visitation, state GDP and state unemployment rates. 

<!-- Load and transform the data -->
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
<!-- creating park selector -->
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
<!-- selecting state based on park selection -->
```js
let stateSelect= ""

for (const park of fullParks) {
  if (parkSelection == park.name) {
    stateSelect = park.state
  }
}
```
<!-- Finding Average Visits for Each Park -->

```js
const visitsRollup = d3.rollup(
  visitsRefac,
  (leaf) => {
    // Return an object with CT data
    return {
      mean: d3.mean(leaf, l => l.visits),
      median: d3.median(leaf, l => l.visits),
      mode: d3.mode(leaf, l => l.visits),
      sum: d3.sum(leaf, l => l.visits),
      min: d3.min(leaf, l => l.visits),
      max: d3.max(leaf, l => l.visits),
      // and so on ...
    }
  },
  (d) => d.park,
)
```


```js
const visitTendencies = Array.from(
  visitsRollup,
  ([park, ctResults]) => {
    return {
      park: park,
      Average: ctResults.mean,
      median: ctResults.median,
      mode: ctResults.mode,
      min: ctResults.min,
      max: ctResults.max,
      sum: ctResults.sum,
  }
  }
)
```
<!-- Plotting Visitation -->


```js
const visitPlot = Plot.plot({
    width: 1000,
    marginLeft: 100,
  x:{
    tickFormat: (d) => {
      if( d != "Average") {
      return numberNoCommasFormatter(d)
      }
      else {
        return d
      }
    },
    },
    y: {
      grid: true,
      // label: "Visitors per Year",
      // domain: yDomain,
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
    Plot.ruleY(visitTendencies.filter((d) => d.park == parkSelection), {
      y: "Average", 
      stroke: "white",
      strokeWidth: 3, 
      tip: true,
    }),
  ]
})
```

<div class = "grid grid-cols-1">
   <div class="card">
    <h2>${parkSelection} Total Annual Visitors (2008-2024)</h2>
    ${visitPlot}
  </div>
</div>
<!-- PLOT INFO ENDS HERE -->

## Tracing the Economy
<!-- PLOT INFO STARTS HERE -->
<!-- reformatting unemp data -->
```js
const stateList = getUniquePropListBy(fullParks, "state")
let unEmpUpdated = unEmpData
for (const year of unEmpUpdated) {
  for (const state of stateList) {
    if (year[state] != null) {
      year[state] = year[state]/100
    }
  }
}
```
<!-- Ploting Ecomonic Data -->

```js
let unEmpPlot = Plot.plot({
  color: {
      type: "linear",
      scheme: "brbg",
      },
  x:{
    tickFormat: (d) => numberNoCommasFormatter(d),
    label: "Year"
  },
  y: {
    tickFormat: ".1%",
    label: "Average Unemployment Rate"
  },
  marks:[
      Plot.lineX(unEmpUpdated, {
        x: "Year",
        y: stateSelect,
        stroke: "grey",
        strokeWidth: 3,         
      }),
      Plot.dot(unEmpUpdated, {
      x: "Year",
      y: stateSelect,
      fill: "Year",
      r:5,
      strokeWidth: 3, 
      tip :{
          format: {
            x: (d) => numberNoCommasFormatter(d),
            y:".1%"
          }
        }
      }), 
  ]
})
```
```js
let gdpPlot = Plot.plot({
  color: {
      type: "linear",
      scheme: "brbg",
      },
  x:{
    tickFormat: (d) => numberNoCommasFormatter(d),
    label: "Year",
    },
  y: {
    label: "GDP in Millions of USD",
  },
  marks:[
    Plot.lineX(gdpData, {
      x: "Year",
      y: stateSelect,
      stroke: "grey",
      strokeWidth: 3, 
    }),
    Plot.dot(gdpData, {
      x: "Year",
      y: stateSelect,
      fill: "Year",
      r: 5,
      tip :{
          format: {
            x: (d) => numberNoCommasFormatter(d),
          }
        }
      }),  ]
})
```
<div class = "grid grid-cols-2">
   <div class="card">
    <h2>${stateSelect} Unemployment Rate (2008-2024)</h2>
    ${unEmpPlot}
  </div>
   <div class="card">
    <h2>${stateSelect} GDP (2008-2024)</h2>
    ${gdpPlot}
  </div>
</div>

<!-- PLOT INFO ENDS HERE -->