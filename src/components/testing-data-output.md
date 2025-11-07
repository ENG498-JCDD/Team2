# Testing Data Outputs

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv("typed: true")
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv("typed: true")
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv("typed: true")
const parkHours = FileAttachment("./../data/NPS/parks_by_exception_hours.csv").csv("typed: true")
const parkActivities = FileAttachment("./../data/NPS/parks_by_activities.csv").csv("typed: true")
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
const hoursByPark = d3.group(parkHours,
  (d) => d.designation,
    (d) => d.name
)
```

```js
hoursByPark
```
```js
const designationActivity = 
  for (const entry of parkActivities) {
    if (entry.designation == "National Park") {
      
    }
}
)
```

```js
designationActivity
```