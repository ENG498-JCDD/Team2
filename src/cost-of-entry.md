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
const roundForMoney = d3.format("$.2f")
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

<!-- LINDGREN:
  Fun little finding card pattern, so you can give presence to certain points.
-->
<div class="grid grid-cols-2 cards__findings">

  <div class="card">
    <p>
      <span class="big">${noFeesCount}</span> of the 63 national parks are completely free to visit.
    </p>
  </div>

</div>

<!-- **${noFeesCount}** of the 63 national parks **are completely free to visit**  -->

Use the map bellow to see if there is a free park near you!


```js
const us = await fetch(import.meta.resolve("npm:us-atlas/counties-10m.json")).then((r) => r.json())
const states = topojson.feature(us, us.objects.states)
```
<!-- processing data and location -->
```js
const colOfInterest = "cost"
const avgfeeRollup = d3.rollup(
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
  d => d.name,
)
```

```js
const avgFeeTendencies = Array.from(
 avgfeeRollup,
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
const averageAndLocation = []
for (const park of fullParks) {
  for (const fee of avgFeeTendencies) {
    if (fee.type == park.name) {
      averageAndLocation.push({name: park.name, longitude:park.longitude, latitude:park.latitude, averageCost:fee.mean})
    }
  }
}
```
<!-- creating map -->
```js
const mapOfFees = Plot.plot({
  height: 500,
  width: 700,
  color: {
    // scheme: "ylgnbu",
    /** LINDGREN:
     * The blues felt like they got lost
     * among the overall dark theme energy.
     * This yellow to red scheme pops a bit
     * more from the dark theme.
    **/
    scheme: "ylorrd",
    legend: true,
  },
  projection: "albers-usa",
  marks: [
    Plot.geo(states, {fill: "white",stroke: "var(--theme-foreground)", opacity: 0.25, }
    ),
    Plot.dot(averageAndLocation, 
    {
      x: "longitude",
      y: "latitude",
      title: (d) => `${d.name} \n Average Cost of Entry: ${roundForMoney(d.averageCost)}`,
      tip: true,
      fill: "averageCost",
      // LINDGREN: Create a new metric to account for free parks
      r: (d) => d.averageCost + 1,
      /** LINDGREN:
       * Remove strokeWidth, which wasn't adding
       * anything to the plot. Revised it to add
       * a forest green stroke around the circles/dots
      **/
      stroke: "forestgreen",
    })
  ]
})
```

### Whats the average cost to enter this park?

<!-- LINDGREN: Wrapped the plot in a div container to help with colored syntactic sugar -->
<div class="grid">
  ${mapOfFees}
</div>

## Average Cost of Entry

<!-- Define: multiDay, singleDay, noFees, noGroupFees -->
<!-- LINDGREN
  NOTE: You could create an Map of objects, wherein your fee type is the key.
-->
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

<!-- LINDGREN: Tried to show how to simplify your content, since your cards are doing the heavy lifting. -->

Additionally, there are different kinds of entry. The cards below provide the overall average price of entry by pass type:

<!-- feeRollup & feeTendencies -->
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

<!-- carAverage, cycleAverage, personAverage -->
```js
let carAverage, cycleAverage, personAverage;
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
    <p>
      Often, this individual is entering the park on foot.
    </p>
  </div>
 <div class="card">
    <h2>Individual Entry -- Per Car</h2>
    <span class="big">${carAverage}</span>
    <p>
      Covers the cost of entry to a park for all passengers in a standard size car.
    </p>
  </div>
  <div class="card">
    <h2>Individual Entry -- Motorcycle</h2>
    <span class="big">${cycleAverage}</span>
    <p>
      Covers the cost of entry for the driver of a motorcycle and up to one passenger
    </p>
  </div>
</div>

## Length of Stay

In addition to different kinds of entry, some parks offer multi-day entry with their admission fees. Others offer only single day entry.

Use the dropdown below to view the average price of entry for multi-day and single-day entry, and to see the full details of entry passes.



```js
const feesArray = ["Multi-Day", "Single-Day",]
```

<!-- feeSelection -->
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
let parksListFiltered = noGroupFees.filter((d)=> d.dayType == feeSelection)
let filteredParkNames = getUniquePropListBy(parksListFiltered, "name")
let numOfParks = filteredParkNames.length
```

<!-- LINDGREN: Presencing this result -->
<div class="grid grid-cols-1">
  <div class="card">
    <p>
      <span class="big">${numOfParks}</span> parks offer <strong>${feeSelection}</strong> entry.
    </p>
  </div>
</div>

<!-- <b>${numOfParks} Parks</b> offer <b>${feeSelection}</b> entry. -->

<!-- feeSelectRollup -->
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

<!-- feeSelectTendencies array -->
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

<!-- carSelectAverage, cycleSelectAverage, personSelectAverage-->
```js
let carSelectAverage, cycleSelectAverage, personSelectAverage;
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

<!-- LINDGREN: Create a filtered version to reuse, based on selections -->
```js
const filteredNoGroupFees = noGroupFees.filter((d)=> d.dayType == feeSelection)
```

<!-- LINDGREN:
  Consider how a plot + table could help you describe the variations in addition to the overall averages.
-->
```js
Plot.plot({
  y: {
    domain: [0, (d3.max(filteredNoGroupFees, d => d.cost) + 5)]
  },
  grid: true,
  legend: true,
  marks: [
    Plot.ruleY(
      [d3.mean(filteredNoGroupFees, d => d.cost)],
      {
        strokeDasharray: [1, 3],
        stroke: "yellow",
        strokeWidth: 2,
      }
    ),
    Plot.dot(
      filteredNoGroupFees,
      {
        x: "type",
        y: "cost",
        fill: "name",
        r: d => ((d.cost)*10),
        tip: {
          format: {
            name: true,
            cost: false,
            type: false,
            r: false,
          }
        }
      }
    )
  ]
})
```

<!-- feeTable -->
```js
const feeTable = Inputs.table(
  // LINDGREN: Added filtered version for reusability
  filteredNoGroupFees,
  // noGroupFees.filter((d)=> d.dayType == feeSelection),
  {
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


## Conclusions -- Understanding Affordability
While a majority of the national parks charge an entry fee (41 of the 63), 32 of these parks allow for multi-day entry into the parks. This means that on average it costs any visitor somewhere 1-3 dollars per day to visit a national park. 

Additionally, most of the parks that charge entrance fees are closely clustered with other parks. Meaning, that when there are fewer options available in a particular region, the cost-based barriers to entry are lowered. This makes it somewhat easier for visitors in these regions to access these national services, even if they have to overcome barriers of proximity.

In the same vein, in more remote areas of the country, such as a majority of the parks in Alaska, these barriers to cost are lowered  in terms of entry, making it easier for visitors to balance this against the cost of travel.

Overall, the national parks provide a relatively affordable opportunity for visitors to engage with nature and history during their downtime.