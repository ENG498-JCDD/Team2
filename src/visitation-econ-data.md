---
title: National Park Visitation and Economic Turmoil
toc: false
---

# National Park Visitation and Economic Turmoil

Is there a link between national park visitation and economic difficulty? We believe there could be, because national parks could provide a low cost, engaging and memorable activity. Here, we present a case for the relationship between national park visitation, state GDP and state unemployment rates.

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
let stateSelect = ""

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

<!-- visitTendencies -->
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
const plotVisits = Plot.plot(
  {
    // Added this copy as title and subtitle; note as a tip later
    title: `${parkSelection} Total Annual Visitors (2008-2024)`,
    subtitle: `This plot shows the visitation data for the park over the years. The solid white line represents the average number of visits across the years.`,
    // width: 1000,
    marginLeft: 100,
    // x: {
    //   tickFormat: (d) => {
    //     if (d != "Average") {
    //       return numberNoCommasFormatter(d)
    //     }
    //     else {
    //       return d
    //     }
    //   },
    // },
    y: {
      grid: true,
      // label: "Visitors per Year",
      // domain: yDomain,
    },
    // color: {
    //   type: "linear",
    //   scheme: "brbg",
    // },

    marks: [
      Plot.dot(
        visitsRefac.filter(d => d.park === parkSelection),
        {
          x: "year",
          y: "visits",
          r: "visits",
          tip :{
            format: {
              x: (d) => numberNoCommasFormatter(d),
            }
          }
        }
      ),
      Plot.lineY(
        visitsRefac.filter(d => d.park === parkSelection),
        {
          x: "year",
          y: "visits",
          tip :{
            format: {
              x: (d) => numberNoCommasFormatter(d),
            }
          }
        }
      ),
      // Added note as a tooltip
      Plot.tip(
        [`The on-set of the COVID-19 Pandemic has impacted visitation numbers for those years.`],
        {
          x: 2020,
          y: (visitsRefac.find((d) => ((d.park === parkSelection) && (d.year === 2020)))).visits,
          anchor: "top",
        }
      ),
      Plot.ruleY(
        visitTendencies.filter((d) => d.park == parkSelection),
        {
          y: "Average",
          stroke: "white",
          strokeWidth: 3,
          // tip: true,
        }
      ),
    ]
  }
)
```

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
<!-- LINDGREN:
  Ideally, a next iteration would add any plots to the components.js file as
  exportable functions to import, so you needn't clutter your reports with code.
-->
<!-- unEmpPlot -->
```js
const unEmpPlot = Plot.plot({
  title: `${stateSelect} Unemployment Rate (2008-2024)`,
  subtitle: `When higher the rate of unemployment is higher, it means more of the population is unemployed indicating economic difficulty.`,
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
      r: 5,
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

<!-- gdpPlot -->
```js
const gdpPlot = Plot.plot({
  title: `${stateSelect} U.S. GDP (2008-2024)`,
  subtitle: `Annual gross domestic product for ${stateSelect}. GDP compounds year after year, so the indicator of economic success is a steep increase in GDP, not necessarily the overall number.`,
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

<!-- LINDGREN:
  Some slick layout work for you, so your audience can better compare results,
  when on larger screens
-->
<div class="note">
  <p>
    Following the on-set of the COVID-19 pandemic, the federal government issued economic stimulus, which is a potential cause for the sharp spike in GDP growth for many of the featured states.
  </p>
</div>

<div class="grid grid-cols-2-3 econ-visits">

  <div class="card">${unEmpPlot}</div>

  <div class="card">${gdpPlot}</div>

  <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <span style="flex-grow: 1;">${plotVisits}</span>
  </div>

</div>
<!-- PLOT INFO ENDS HERE -->

## Conclusions - Economic Recovery and Park Visitation

While our initial hypothesis suggested that there would be a link between periods of economic downturn and an increase in visitation rates, the data has proven that this is not the case. Rather it seems that there is an increase in visitation, not necessarily in the years of economic turmoil, but in the period directly following.

The clearest example of this can be seen in the years following the COVID-19 pandemic. Across the board, the rate of visitation at most parks did increase and has been higher than average. 

While this data only tells part of the story, we believe that the National Parks provide an outlet for Americans in times of economic recovery, if not in times of turmoil like we initially believed.