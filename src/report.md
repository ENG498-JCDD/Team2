---
title: National Park Visitation and Economic Turmoil
---

# National Park Visitation and Economic Turmoil - an Overview

The following report outlines the history, function, and recent attacks from captiol hill on national parks, as well as an exploration on how they provide entertainment and value to Americans, perhaps especially during times of economic difficulty. We hypothesize that visits to national parks increase when there is economic instability in the country, as they provide inexpensive forms of entertainment and enrichment to visitors. During a period of increasing economic and political uncertainty, it is important to highlight the values that publicly funded provide to society.

## Background and History of the National Parks Service and System

In 1872, Congress established the first national park, Yellowstone National Park, for the "benefit and enjoyment of the people". This sparked a movement worldwide to create national parks and preserves. Under the Department of the Interior in the years following Yellowstone's creation, more parks and monuments were created, providing employment opportunities to Americans. In 1916, President Woodrow Wilson signed the "The National Park Service Organic Act", creating the National Park Service within the Department of the Interior to protect and manage current and future national parks and monuments. Now, the National Park System runs over 400 areas over 84 million acres across the United States and its territories.

### Map of U.S. National Parks
<!-- START OF MAP CODE -->
```js
const fullParks = FileAttachment("./data/NPS/full_parks_dataset.csv").csv({typed: true})
const us = await fetch(import.meta.resolve("npm:us-atlas/counties-10m.json")).then((r) => r.json())
const states = topojson.feature(us, us.objects.states)
```

```js
Plot.plot({
  height: 500,
  width: 700,
  color: {
    scheme: "ylgnbu",
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
      // fill: "name",
      stroke: "name",
      r: 4,
      strokeWidth: 2,
    })
  ]
})
```
<!-- END OF MAP CODE -->

## Recent Challenges Facing the National Park Service



```js
import {timeline} from "./components/timeline.js";
```

```js
const events = FileAttachment("./data/events.json").json();
```

```js
timeline(events, {height: 300})
```

