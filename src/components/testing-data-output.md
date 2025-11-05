# Testing Data Outputs

```js
const gdpData = FileAttachment("./../data/FRED/annual_gdp_by_state.csv").csv("typed: true")
const unEmpData = FileAttachment("./../data/FRED/average_annual_unemployment_rate.csv").csv("typed: true")
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv("typed: true")
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