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
const visitsRefac = FileAttachment("./data/NPS/refactored_annual_visits.csv").csv({typed: true})
const parkFeesRefac = FileAttachment("./data/NPS/park_fees_refactored.csv").csv({typed: true})
```

```js
fullParks
```
```js
let feeCount = 0
let parksWithFeeArray=[]
let noFeeCount = 0
let parksNoFeeArray = []
for (const park of fullParks) {
  if  (park.entranceFees == "no") {
    noFeeCount += 1
    parksNoFeeArray.push(park.name)
  }
  else {
    feeCount +=1
    parksWithFeeArray.push(park.name)
  }
}
```
```js
noFeeCount
```
```js
parksNoFeeArray
```
```js
feeCount
```
```js
parksWithFeeArray
```

```js
parkFeesRefac
```
## redoing fee numbers

```js
let count = 0
let total = 0
let typeArray=[]
for (const fee of parkFeesRefac) {
  if (fee.feeType.startsWith("Timed") == false && fee.feeType.includes("Group")== false) {
    // console.log(fee)
  count += 1
  total += fee.cost
  typeArray.push(fee.feeType)
  }
}
let average = total/count
```
```js
typeArray
```
```js
count
```
```js
average
```


```js
Plot.plot({
  padding: 0,
  grid: true,
  color: {type: "linear", scheme: "PiYG"},
  marks: [
    Plot.dot(parkFeesRefac, {x: "cost",y: "cost", fill: "cost", inset: 0.5}),
  ]
})
```



## Refactoring

```js
const multiDay = []
const singleDay = []
const noFees = []
const noGroupFees = []
for (const fee of parkFeesRefac) {
  if (fee.feeType.includes("Reservation") == false) {
    if (fee.feeType.includes("Group") == false){
      if (fee.description.includes("seven") || fee.description.includes("7") && fee.description.includes("7 am") == false || fee.description.includes("days")) {
        multiDay.push({name:fee.name, type: fee.feeType, cost: fee.cost})
        noGroupFees.push({name:fee.name, type: fee.feeType, cost: fee.cost, dayType: "Multi-Day"})
      }
      else if (fee.feeType.includes("None")) {
        noFees.push({name:fee.name, type: fee.feeType, cost: fee.cost})
        noGroupFees.push({name:fee.name, type: fee.feeType, cost: fee.cost, dayType: "No Fee"})
      }
      else {
        singleDay.push({name:fee.name, type: fee.feeType, cost: fee.cost})
        noGroupFees.push({name:fee.name, type: fee.feeType, cost: fee.cost, dayType: "Single-Day"})
      }
    }
  }
} 
```
noGroupFees
```js
parkFeesRefac
```
```js
let countRefac = 0
let totalRefac = 0
let typeArrayRefac=[]
for (const fee of noGroupFees) {
  {
  countRefac += 1
  totalRefac += fee.cost
  typeArrayRefac.push(fee.feeType)
  }
}
let averageRefac = total/count
```
```js
countRefac
```
```js
averageRefac
```
```js
noGroupFees
```
multi day

single day
```js
singleDay
```

## trying the selection thingy
```js
const feesArray = ["No Fee","Multi-Day", "Single-Day", ]
```
```js
let feeSelection = view(
  Inputs.select(
    feesArray,
    {
      label: html`<em>Select Fee Type</em>`,
      value: "",
    }
  )
)
```
```js
const feeTable = Inputs.table(noGroupFees.filter((d)=> d.dayType == feeSelection), {columns: [
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
      name: "50%",
      type: "35%",
      cost: "15%",
    },
  }
)
```
<div class = "grid grid-cols-1">
   <div class="card">
    <h2>Individual Park Entry Fees -- <b>${feeSelection}</b></h2>
    ${feeTable}
  </div>
</div>



```js
const colOfInterest = "cost"
const feeRollup = d3.rollup(
  noGroupFees,
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
feeRollup
```
```js
const feeTendencies = Array.from(
 feeRollup,
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
feeTendencies
```

```js
let carAverage;
let cycleAverage;
let personAverage;
const roundForMoney = d3.format("$.2f")
for (const each of feeTendencies) {
  if (each.type == "Entrance - Private Vehicle") {
    carAverage = roundForMoney(each.mean)
  }
  else if (each.type == "Entrance - Motorcycle") {
    cycleAverage = roundForMoney(each.mean)
  }
  else if (each.type == "Entrance - Per Person") {
    personAverage = roundForMoney(each.mean)
  }
}
```

<div class="grid grid-cols-3">
  <div class="card">
    <h2>Individual Entry -- Per Person</h2>
    <span class="big">${personAverage}</span>
  </div>
 <div class="card">
    <h2>Individual Entry -- Per Car</h2>
    <span class="big">${carAverage}</span>
  </div>
  <div class="card">
    <h2>Individual Entry -- Motorcycle</h2>
    <span class="big">${cycleAverage}</span>
  </div>
</div>

## by days
```js
const colOfInterest = "cost"
const feeSelectRollup = d3.rollup(
  noGroupFees.filter((d)=> d.dayType == feeSelection),

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
feeSelectRollup
```
```js
const feeSelectTendencies = Array.from(
 feeSelectRollup,
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
feeSelectTendencies
```


```js
let carSelectAverage;
let cycleSelectAverage;
let personSelectAverage;
const roundForMoney = d3.format("$.2f")
for (const each of feeSelectTendencies) {
  if (each.type == "Entrance - Private Vehicle") {
    carSelectAverage = roundForMoney(each.mean)
  }
  else if (each.type == "Entrance - Motorcycle") {
    cycleSelectAverage = roundForMoney(each.mean)
  }
  else if (each.type == "Entrance - Per Person") {
    personSelectAverage = roundForMoney(each.mean)
  }
}
```
<div class="grid grid-cols-3">
  <div class="card">
    <h2>Individual Entry -- Per Person</h2>
    <span class="big">${personSelectAverage}</span>
  </div>
 <div class="card">
    <h2>Individual Entry -- Per Car</h2>
    <span class="big">${carSelectAverage}</span>
  </div>
  <div class="card">
    <h2>Individual Entry -- Motorcycle</h2>
    <span class="big">${cycleSelectAverage}</span>
  </div>
</div>





## OLD

```js
const colOfInterest = "cost"
const averagecostRollup = d3.rollup(
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
const noFeeNames = getUniquePropListBy(noFees, "name")
```
nofees list
```js
noFeeNames
```
multinames list
```js
multiNames
```
singleNames list
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
    // console.log(fee)
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
visitsRollup
```
```js
const visitTendencies = Array.from(
  visitsRollup,
  ([park, ctResults]) => {
    return {
      park: park,
      mean: ctResults.mean,
      median: ctResults.median,
      mode: ctResults.mode,
      min: ctResults.min,
      max: ctResults.max,
      sum: ctResults.sum,
  }
  }
)
```
```js
visitTendencies
```














```js
let parkSelection = view(
  Inputs.select(
    getUniquePropListBy(fullParks, "name"),
    {
      label: html`<em>Select which park</em>`,
      value: "",
    }
  )
)
```
```js
let stateSelect= ""

for (const park of fullParks) {
  if (parkSelection == park.name) {
    stateSelect = park.state
  }
}
```
```js
stateSelect
```
```js
let visitPlot = Plot.plot({
  color:{
    type: "linear",
    scheme: "brbg",
  },
  marks: [
    Plot.barY(annualVisits,
      {
        x: "Year",
        y: parkSelection,
        fill: "Year",
      }),
      
      Plot.ruleY(visitTendencies.filter((d) => d.park == parkSelection), {
        y: "mean", 
        stroke: "white",
        strokeWidth: 3, 
        tip: true,
      }),   
  ]
})
```

```js
let unEmpPlot = Plot.plot({
  marks:[
      Plot.lineX(unEmpData, {
        x: "Year",
        y: stateSelect,
      }),
  ]
})
```
```js
let gdpPlot = Plot.plot({
  marks:[
    Plot.lineX(gdpData, {
      x: "Year",
      y: stateSelect,
    })
  ]
})
```

```js
annualVisits
```

<!-- ```js
Plot.plot({
  marks:[
      Plot.ruleY(visitTendencies.filter((d) => d.park == parkSelection), {
        y: "mean",
      }),
  ]
})
``` -->

<div class = "grid grid-cols-2">
   <div class="card">
    <h2>State Unemployment Rate (2008-2024)</h2>
    ${unEmpPlot}
  </div>
   <div class="card">
    <h2>State GDP (2008-2024)</h2>
    ${gdpPlot}
  </div>
</div>

```js
unEmpData
```
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
```js
unEmpUpdated
```
```js
const us = await fetch(import.meta.resolve("npm:us-atlas/counties-10m.json")).then((r) => r.json())
const states = topojson.feature(us, us.objects.states)
```

```js
Plot.plot({
  color: {
    scheme: "ylgnbu",
  },
  projection: "albers-usa",
  marks: [
    Plot.geo(states, {fill: "white",stroke: "var(--theme-foreground)", opacity: 0.25, }
    ),
    Plot.dot(fullParks, 
    {
      x: "longitude",
      y: "latitude",
      title: (d) => d.name,
      tip: true,
      // fill: "name",
      stroke: "name",
      r: 4,
      strokeWidth: 2,
    })
  ]
})
```


```js
const noFeeParks = []
for (const park of fullParks) {
  // console.log(park.entranceFees) 
  if (park.entranceFees == "no") {
    noFeeParks.push(park)
  }
  }
```
```js
noFeeParks
```


```js
const parksWithFees = getUniquePropListBy(parkFees, "name")
```
```js
parksWithFees
```
```js
let newFeeArray = []
for (const park of parksWithFees) {
  let fees = []
  for (const fee of parkFees) {
    if (park == fee.name) {
      fees.push(fee.cost)
      
    }
  }
}
```
