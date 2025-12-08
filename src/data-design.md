```js
import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"
```

```js
const gdpData = FileAttachment("./data/FRED/annual_gdp_by_state.csv").csv({typed: true})
const unEmpData = FileAttachment("./data/FRED/average_annual_unemployment_rate.csv").csv({typed: true})
const annualVisits = FileAttachment("./data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
const fullParks = FileAttachment("./data/NPS/full_parks_dataset.csv").csv({typed: true})
const parkFees = FileAttachment("./data/NPS/park_fees.csv").csv({typed: true})
```
# Data Design Overview
<!-- Assess the available data used for this project and working problem.
Apply concepts from the readings to note issues with available or missing features, which could advance the knowledge of this issue.
Example: the structuralist perspective and SJ ethic can guide some of your reflections.
Defense of the User: How can TPC advocate and defend users from the oppressive conditions related to their chosen domain with such data? What limitations does the data currently have (consider issues of data labor and power via D`Ignazio and Klein)? 
Collectivization: Based on the known issues, how can TPC connect users with appropriate support networks?
Materialization: What material conditions seem to be creating oppressive conditions? And, for whom or what groups in particular?
Increasing User Power in the Relationship: How can TPC build equitable relationships with user groups to ensure users can lead and drive important changes to their data-related conditions?
Power through Personal Change: How can TPC build capacity for individual user's as a result of the research/work?
Discuss the benefits and limitations of the data in your problem scenario, as well as what data would be needed to redress or understand any other issues. 
Discuss potential next steps you envision for TPC to continue this work in this domain. -->

Our project deals with issues of accessibility to culturally important nature spaces. The data used to analyze the issue of economic difficulty and national park visitation was found quite easily. We used Federal Reserve Economic Database (FRED) for economic data, and the national parks data from the National Park System DataStore. The data was easy to find, use and adapt to our project.

The main issue we found with our dataset was that the data from the NPS was impersonal. The entrance counter data only collected the number of people entering, no other demographic data. This serves to mask the groups that actually go to national parks, and hide who is unable to go to national parks. This calls into question *why* the NPS doesn't count this sort of data. Is it because it saves time and money? Do they not think it's worth having that data? Do they actively want to hide these numbers? Much like is discussed in the "Seven Intersectional Feminist Principles Of Equitable and Actionable COVID-19 Data", collecting counterdata to call into question the principles and motives of an institution can help "quantify the problem at hand". Creating new lenses through which to view data can help reveal issues and inequalities that were previously swept under the rug.

This is where TPC can come in a help reveal these patterns of visitation, and perhaps develop new was to advertise to and connect with other socio-economic groups that may not be visiting national parks. This can not only help potential visitors, but also national parks by increasing park visitation numbers, attention, and perhaps support for adequate funding from the federal government.

Our project specifically would have benefited from having socioeconomic and demographic data available to us to analyze. We could have perhaps deciphered a pattern more similar to our original hypothesis, which was proven inconclusive, or other patterns showing a totally different situation entirely.

