# Refactor the structure

```js
const annualVisits = FileAttachment("./../data/NPS/annual_visits_2008_2024.csv").csv({typed: true})
```

<!-- Get list of parks in dataset -->
```js
let uniqParksList = annualVisits.map(
  (year) => {
    return Object.keys(year)
  }
)
uniqParksList = uniqParksList[0]
```

<!-- Go thru each row's cols to yield a per Park grouping with the year and annual visit counts -->
```js
let refactoredAnnualVisitData = []
// Loop thru all OG rows
for (let yearRow of annualVisits) {
  // For each OG row, parse all park names to access the OG column-value
  for (const park of uniqParksList) {
    // Create the refactored row
    let refactoredRow = {}
    refactoredRow.year = yearRow.Year
    refactoredRow.park = park
    refactoredRow.visits = yearRow[park]
    // Push the row to the main array
    refactoredAnnualVisitData.push(refactoredRow)
  }
}
```

<!-- Filter out the "Year" values -->
```js
const refactoredAnnualVisitDataFiltered = refactoredAnnualVisitData.filter((parkRow) => (parkRow.park !== "Year") && (parkRow.year !== "Average"))
```

Verify that the data are refactored at `refactoredAnnualVisitData` variable.

```js
refactoredAnnualVisitDataFiltered
```

## Test d3.mean()

### Overall Average

```js
d3.mean(refactoredAnnualVisitDataFiltered, (d) => d.visits)
```

### By Park Calculations

```js
d3.rollup(
  refactoredAnnualVisitDataFiltered,
  (leaf) => {
    // Return an object with CT data
    return {
      mean: d3.mean(leaf, l => l.visits),
      median: d3.median(leaf, l => l.visits),
      mode: d3.mode(leaf, l => l.visits),
      sum: d3.sum(leaf, l => l.visits),
      // and so on ...
    }
  },
  (d) => d.park,
)
```

<!-- Define Download as CSV Function -->
```js
const downloadAsCSV = (value, name = "data", label = "Save") => {
  // 1. Create the download button
  const a = document.createElement("a")
  const b = a.appendChild(document.createElement("button"))
  b.textContent = label
  a.download = name

  // 3. Reset the button, after each use.
  async function reset() {
    await new Promise(requestAnimationFrame);
    URL.revokeObjectURL(a.href)
    a.removeAttribute("href")
    b.textContent = label
    b.disabled = false
  }

  // 2. Click event trigger on button to save the input dataset (array of objects)
  a.onclick = async (event) => {
    b.disabled = true
    if (a.href) return reset() // Already saved.
    b.textContent = "Saving…"
    // Try to save the data as a .csv
    try {
      const object = await (typeof value === "function" ? value() : value)
      const blob = new Blob([object], { type: "application/octet-stream" })
      b.textContent = "Download"
      a.href = URL.createObjectURL(blob) // eslint-disable-line require-atomic-updates
      if (event.eventPhase) return reset() // Already downloaded.
      a.click() // Trigger the download
    }
    // If error, throw the following and log error type
    catch (error) {
      console.error("Download error:", error)
      b.textContent = label
    }
    b.disabled = false
  }

  return a
}
```

<!-- Create output button for CSV file -->
```js
view(
  downloadAsCSV(
    // Fancy method to convert array of objects to CSV string
    async () => {
      const csvFullString = d3.csvFormat(refactoredAnnualVisitDataFiltered);
      return new Blob([csvFullString], { type: "text/csv" });
    },
    // Filename
    "Refactored-Annual-NPS-Visits.csv",
    // Button Label
    "Save Dataset As CSV"
  )
);
```