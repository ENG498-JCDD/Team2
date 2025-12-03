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
const parkFeesRefac = FileAttachment("./data/NPS/park_fees_refactored.csv").csv({typed: true})

```
# National Park Visitation and Economic Turmoil

Is there a link between national park visitation and economic difficulty? We believe there could be, because national parks could provide a low cost, engaging and memorable activity. Here, we explore the relative affordability of the National Parks. 


---
## Free Parks
**${noFeesCount}** of the 63 national parks **are completely free to visit** 

Use the map bellow to see if there is a free park near you!

```js
const us = await fetch(import.meta.resolve("npm:us-atlas/counties-10m.json")).then((r) => r.json())
const states = topojson.feature(us, us.objects.states)
```
```js
const mapOfFees = Plot.plot({
  height: 500,
  width: 700,
  color: {
    scheme: "ylgnbu",
    legend: true,
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
      fill: "entranceFees",
      r: 4,
      strokeWidth: 2,
    })
  ]
})
```
### Does this park charge an entry fee?
${mapOfFees}

---

## Average Cost of Entry
<!-- Data Processing -->



```js
const multiDay = []
const singleDay = []
const noFees = []
const noGroupFees = []
let noFeesCount = 0
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
        noFeesCount +=1
      }
      else {
        singleDay.push({name:fee.name, type: fee.feeType, cost: fee.cost})
        noGroupFees.push({name:fee.name, type: fee.feeType, cost: fee.cost, dayType: "Single-Day"})
      }
    }
  }
} 
```
Entry type and cost varies from park to park, but visiting a national park is still relatively affordable. 

Additionally, there are different kinds of entry:
* Per Person - Covers the cost of entry for one individual. Often, this individual is entering the park on foot.
* Private Vehicle - Covers the cost of entry to a park for all passengers in a standard size car
* Motorcycle - Covers the cost of entry for the driver of a motorcycle and up to one passenger

<br>

### Average Price of Entry by Pass Type
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

---

## Length of Stay
<br>
In addition to different kinds of entry, some parks offer multi-day entry with their admission fees. Others offer only single day entry.

Use the dropdown below to view the average price of entry for multi-day and single-day entry, and to see the full details of entry passes.



```js
const feesArray = ["Multi-Day", "Single-Day", ]
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
<br>

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
### Average Price of ${feeSelection} Entry by Type
<div class="grid grid-cols-3">
  <div class="card">
    <h2><b>${feeSelection}</b> Individual Entry -- Per Person</h2>
    <span class="big">${personSelectAverage}</span>
  </div>
 <div class="card">
    <h2><b>${feeSelection}</b> Individual Entry -- Per Car</h2>
    <span class="big">${carSelectAverage}</span>
  </div>
  <div class="card">
    <h2><b>${feeSelection}</b> Individual Entry -- Motorcycle</h2>
    <span class="big">${cycleSelectAverage}</span>
  </div>
</div>

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

<br>
<div class = "grid grid-cols-1">
   <div class="card">
    <h2>Individual Park Entry Fees -- <b>${feeSelection}</b></h2>
    <p><i>Click the heading to sort.</i></p>
    ${feeTable}
  </div>
</div>



