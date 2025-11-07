# Filtering the Data from Dr. Lindgren

Since the scope  of our project if focusing only on national parks (the specific designation), not all NPS managed land this file is where I will be processing and filtering the data based on designation.

```js

import {getUniquePropListBy, downloadAsCSV, filterData} from "./utils/utils.js"

```

```js

```

```js
const parkHours = FileAttachment("./../data/NPS/parks_by_exception_hours.csv").csv("typed: true")
const parkActivities = FileAttachment("./../data/NPS/parks_by_activities.csv").csv("typed: true")
const parkTopics = FileAttachment("./../data/NPS/parks_by_topics.csv").csv("typed: true")
```
```js
parkHours
```

```js
const filteredHours = filterData(parkHours, "designation", "National Park")
const filteredActivities = filterData(parkActivities,"designation", "National Park")
const filteredTopics = filterData(parkTopics,"designation", "National Park")
```

```js
filteredHours
```
```js
filteredActivities
```
```js
filteredTopics
```
```js
const activityParks = getUniquePropListBy(filteredActivities, "name")
const topicParks = getUniquePropListBy(filteredTopics, "name")
const hoursParks = getUniquePropListBy(filteredHours, "name")

```
```js
activityParks
```


```js
const groupedItemObject = (arr, propsList, propKey, itemKey) => {
  const newObjArr = []
  for (const prop of propsList) {
    console.log(prop)
    const keyArr = []
    for (const item of arr){
      if (item[propKey] == prop) {
        keyArr.push(item[itemKey])
      }
    }
    newObjArr.push(
      {
        name: prop,
        TOI: itemKey,
        array: keyArr,
      }
    )
  }
  return newObjArr
}
```

```js
const activityParksAgg = groupedItemObject(filteredActivities, activityParks, "name", "activities")
```
This array of objects has all of the offer activities per park grouped here and listed as an array.

```js
activityParksAgg
```

```js
const topicsParkAgg = groupedItemObject(filteredTopics, topicParks, "name", "topics")
```
```js
topicsParkAgg
```

```js
const hoursParkAgg = groupedItemObject(filteredHours, hoursParks, "name", "exceptionType")
```

```js
hoursParkAgg
```