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

<!-- maybe plot of visitation of parks per state over the years? or maybe average visitation of all parks over the years. Could also do: average park visitation compared to average gdp compared to average unemployment since 2008 (year is x, other things over y) -->

<!-- I think here we should have the drop down to pick which park we are looking at -->

This dashboard allows you to select a particular park and then view the associated economic data from the state that National Park is in.

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
    <p>This plot shows the visitation data for the park over the years. The solid white line represents the average number of visits across the years. <b>Note:</b> The on-set of the COVID-19 Pandemic has impacted visitation numbers for those years.</p>
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
    <p>The plot below shows the average annual unemployment rate for ${stateSelect}. When higher the rate of unemployment is higher, it means more of the population is unemployed indicating economic difficulty.</p>
    ${unEmpPlot}
  </div>
   <div class="card">
    <h2>${stateSelect} GDP (2008-2024)</h2>
    <p>The plot below shows the annual gross domestic product for ${stateSelect}. GDP compounds year after year, so the indicator of economic success is a steep increase in GDP, not necessarily the overall number. **Note:** Following the on-set of the COVID-19 pandemic, the federal government issued economic stimulus, which is a potential cause for the sharp spike in GDP growth for many of the featured states.</p>
    ${gdpPlot}
  </div>
</div>

<!-- PLOT INFO ENDS HERE -->