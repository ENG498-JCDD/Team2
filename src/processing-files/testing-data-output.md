# Testing Data Outputs
```js

import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"

```

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
const parkHours = FileAttachment("./../data/NPS/parks_by_exception_hours.csv").csv({typed: true})
const parkActivities = FileAttachment("./../data/NPS/parks_by_activities.csv").csv({typed: true})
const parkTopics = FileAttachment("./../data/NPS/parks_by_topics.csv").csv({typed: true})
const fullParks = FileAttachment("./../data/NPS/parks_response.json").json()
const fullParksUpdated = FileAttachment("./../data/NPS/full_parks_dataset.csv").csv({typed: true})
```

```js
gdpData
```
```js
unEmpData
```
```js
annualVisits
```
```js
parkHours
```
```js
parkActivities
```
```js
parkTopics
```

```js
const topicsByPark = d3.group(
  parkTopics,
  (d) => d.designation,
    (d) => d.topics,
)
```
```js
const hoursByPark = d3.group(parkHours,
  (d) => d.designation,
    (d) => d.name
)
```

```js
hoursByPark
```

```js
topicsByPark
```
```js
fullParks
```

PARK ARRAY

```js
const parkArray = []
for (const each of fullParks.data) {
  if (each.designation.includes("National Park")|| each.designation == "National and State Parks" || each.fullName == "Rock Creek Park") {
    parkArray.push(each)
  }
}
```
```js
parkArray
```
```js
const parksWithFees = []
for (const park of parkArray) {
  if (park.entranceFees.length != 0){
    parksWithFees.push(
      {
        name: park.name,
        entranceFees: park.entranceFees,
      }
    )
  }
}
```
```js
parksWithFees
```

```js
const updatedNameVisits = []
for (const park of annualVisits) {
  updatedNameVisits.push(park["Park Name"].replace("NP", "National Park"))
}
```
```js
updatedNameVisits
```
ADDING
```js
const newParkArray = []
for (const each of parkArray) {
  for (const name of updatedNameVisits) {
    if (each["fullName"].startsWith(name)) {
      newParkArray.push(name)
      }
    }
  }
```
NEW PARK ARRAY
```js
newParkArray
```

```js
const desgNames = getUniquePropListBy(parkArray, "fullName")
```
```js
desgNames
```

```js
const accountedNames = []
const missingNames = []
  for (const desgName of desgNames) {
    for (const newName of updatedNameVisits) {
      if (newName.startsWith(desgName) == true) {
        accountedNames.push(newName)
      }
    }
  }

for (const name of updatedNameVisits) {
  if (accountedNames.includes(name) == false) {
    missingNames.push(name)
  }
}
```
```js
accountedNames
```
```js
missingNames
```

```js
const missingWithEntry = []
for (const each of fullParks.data) {
  if (each.fullName.includes("Kings")) {
    missingWithEntry.push(each)
  }
}
```
```js
missingWithEntry
```
```js
const scores = getUniquePropListBy(fullParks.data, "relevanceScore")
```
```js
scores
```





```js
const 
```

Building the full park data set

```js
const fullParksDataset = parkArray.map(
(d) => ({
  name: d["fullName"],
  states: d["states"],
  latitude: d["latitude"],
  longitude: d["longitude"]
}))
```
```js
fullParksDataset
```
```js
for (const park of fullParksDataset){
  for (const park2 of parkArray) {
    if(park2["entranceFees"].length != 0) {
        if (park.name == park2.fullName) {
          park.entranceFees = "yes"
        }
      }
    else {
      if (park.name == park2.fullName) {
          park.entranceFees = "no"
        }
    }
    }
  }

```
## full parks updated
```js
fullParksDataset
```
```js
const fullParksTable = Inputs.table(fullParksDataset)
```
```js
fullParksTable
```
```js
    view(downloadAsCSV(async () => {
      const csvFullString = d3.csvFormat(fullParksDataset);
      return new Blob([csvFullString], { type: "text/csv" });
    }, "untitled", "Save Full Data Set As CSV"));
```











## fees

```js
const feesIsolated = []

for (const park of parkArray) {
  for (const fee of park.entranceFees) {
    feesIsolated.push(fee)
  }
  }
```

```js

feesIsolated
```

```js
const feeTitles = getUniquePropListBy(feesIsolated, "title")
```

```js
feeTitles
```


```js
const parkFees = []


for (const park of parkArray) {
   for (const fee of park.entranceFees) {
    if (fee["title"].startsWith("Entrance") == true && fee.cost != "0.00"||fee["title"].startsWith("Timed Entry") == true && fee.cost != "0.00") {
       let parkObj = {}
       parkObj.name = park.fullName
        parkObj.feeType = fee.title
        parkObj.cost = fee.cost
        parkObj.description = fee.description
        parkFees.push(parkObj)
    }
  }
}
```
```js
Inputs.table(parkFees)
```
```js
    view(downloadAsCSV(async () => {
      const csvFullString = d3.csvFormat(parkFees);
      return new Blob([csvFullString], { type: "text/csv" });
    }, "park fees", "Save Full Data Set As CSV"));
```
```js
fullParksUpdated
```


```js


```