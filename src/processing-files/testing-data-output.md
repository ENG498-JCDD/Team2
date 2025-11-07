# Testing Data Outputs

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv("typed: true")
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv("typed: true")
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv("typed: true")
const parkHours = FileAttachment("./../data/NPS/parks_by_exception_hours.csv").csv("typed: true")
const parkActivities = FileAttachment("./../data/NPS/parks_by_activities.csv").csv("typed: true")
const parkTopics = FileAttachment("./../data/NPS/parks_by_topics.csv").csv("typed: true")
const fullParks = FileAttachment("./../data/NPS/parks_response.json").json()
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

```js
const parkArray = []
for (const each of fullParks.data) {
  if (each.designation == "National Park") {
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