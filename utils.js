import nlp from "compromise"
import {utcParse,utcFormat} from "d3-time-format"
import {html} from "htl"

const hcrDateParser = utcParse("%B-%d-%Y")
const hcrMonthNumberFormat = utcFormat("%m")
const hcrYearNumberFormat = utcFormat("%Y")
const hcrDayOfYearNumberFormat = utcFormat("%j")

export const sparkbar = (max) => {
  return (x) => html`<div style="
    background: var(--theme-green);
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")}`
}



export const printList = (doc) => {
  return JSON.stringify(doc.out('array'), null, 2)
}

export const objectifyList = (doc, factor) => {
  const entityList = doc.out('array')
  const mappedEntity = []
  entityList.forEach(
    (e) => {
      mappedEntity.push({ entity: e, factor: factor })
    }
  )
  return mappedEntity
}

export const combineLettersPerStance = (data) => {

  let newList = []
  let proString = ""
  let antiString = ""

  for (const row of data) {
    // if "Pro" stance
    if (row.stance !== null && row.stance.startsWith("Pro") == true) {
      proString = proString+" "+row.transcript
    }
    // If anti stance
    else if (row.stance !== null && row.stance.startsWith("Anti") == true) {
      antiString = antiString+" "+row.transcript
    }
  }

  newList.push(
    {
      stance: "Pro",
      transcript: proString,
      transcriptLength: proString.length,
      nlp: nlp(proString)
    }
  )
  newList.push(
    {
      stance: "Anti",
      transcript: antiString,
      transcriptLength: antiString.length,
      nlp: nlp(antiString)
    }
  )

  // Combine stance strings
  return newList
}

export const addDateFields = (data) => {
  const updatedData = data.map(
    (letter) => {
      letter.dateObject = hcrDateParser(letter.date)
      letter.month = hcrMonthNumberFormat(letter.dateObject)
      letter.year = hcrYearNumberFormat(letter.dateObject)
      letter.dayOfYear = hcrDayOfYearNumberFormat(letter.dateObject)
      return letter
    }
  )
  return updatedData
}

/** downloadAsCSV()
 * Goal "Save" the Array of Objects as a new dataset to your local computer.
 *  - Saves as a .csv file
 *
 * @params
 * 1. value: Array of Objects.
 * 2. name: String. Name of file to save it as. "data" as default.
 * 3. Label for the button.
 *
 * To use in a notebook, add the following js codeblock:
 *
 *
   ```js
    view(downloadAsCSV(async () => {
      const csvFullString = d3.csvFormat(ENTER_ARR_OF_OBJS_HERE);
      return new Blob([csvFullString], { type: "text/csv" });
    }, allFileTableName, "Save Full Data Set As CSV"));
    ```
 *
**/


/** getUniquePropListBy()
* Goal: Create a unique list of `x` property
* in an array of objects.
* @params
* - arr: Array. Any array of objects.
* - key: String. Desired property to isolate.
* @return
* - uniqList: Array. List of unique data values.
**/
export const getUniquePropListBy = (arr, key) => {
const uniqueObjs = [...new Map(arr.map(item => [item[key], item])).values()]
const uniqList = []
for (const o of uniqueObjs) {
uniqList.push(o[key])
}
return uniqList
}

/** oneLevelRollUpFlatMap()
 * Groups & counts data by one level
 * @params
 *    - data: Array of objects. Data to rollup and sum up.
 *    - level1Key: String. Desired field from `data` to count.
 *    - countKey: String. Provided key name for new property of calculated Number value
 * @return
 *    - Array of objects with level property and its absolute frequency as "af" property
**/
export const oneLevelRollUpFlatMap = (data, level1Key, countKey) => {

  // 1. Rollups on one level
  const colTotals = rollups(
    data,
    (v) => v.length, // Count length of leaf node
    (d) => d[level1Key] // d["race"]
  )

  // 2. Flatten back to array of objects
  const flatTotals = colTotals.flatMap((e) => {
    return {
      [level1Key]: e[0],
      [countKey]: e[1]
    }
  })

  // 3. Return the sorted totals
  return flatTotals
}

/** twoLevelRollUpSumUp()
 * Groups & counts data by one level
 * @params
 *    - data: Array of objects. Data to rollup and sum up.
 *    - level1Key: String. Name of key for 1st level.
 *    - level2Key: String. Name of key for 2nd level.
 *    - countKey: String. Provided key name for new property of calculated Number value
 * @return
 *    - Flattened array of objects with 2 levels and this group's absolute frequency as "Count" property
**/
export const twoLevelRollUpFlatMap = (data, level1Key, level2Key, countKey) => {

  // 1. Rollups on 2 nested levels
  const colTotals = rollups(
    data,
    (v) => v.length, //Count length of leaf node
    (d) => d[level1Key], //Accessor at 1st level
      (d) => d[level2Key], //Accessor at 2nd level
  )

  // 2. Flatten 1st grouped level back to array of objects
  const flatTotals = colTotals.flatMap((l1Elem) => {

    // 2.1 Assign level 1 key
    let l1KeyValue = l1Elem[0]

    // 2.2 Flatten 2nd grouped level
    const flatLevels = l1Elem[1].flatMap((l2Elem) => {

      // 2.2.1 Assign level 2 key
      let l2KeyValue = l2Elem[0]

      // l2Elem[1].flatMap()

      // 2.2.2 Return fully populated object
      return {
        [level1Key]: l1KeyValue,
        [level2Key]: l2KeyValue,
        [countKey]: l2Elem[1]
      }
    })

    // 3. Return flattened array of objects
    return flatLevels
  })

  // 3. Return the sorted totals
  return flatTotals
}

/** sumUpWithReducerTests()
 * Goal: Use D3's .sum() to tally the frequency of the data
 *       by first passing the data through a series of testor functions
 *       and then interested variables.
 * @params
 *  1. reducerFunctions: Array of Objects. Pass any number of functions to filter your data
 *    - type: String. Name of the filtered result
 *    - func: Function. Function that filters the data
 *  2. reducerProperties: Array of Strings. Each String is the desired property values that you are testing in the data
 *  3. data: Two-Level .rollups() output--an Array of nested arrays.
 *  4. level1Key: String. The key for the 1st-level grouping of the data.
 *  5. level2Key: String. The key for the 2nd-level grouping of the data.
 *  6. countKey: String. Desired new key for the new rolled up Number value.
 *
 * @return
 *  1. Array of Objects. Each object represents the reduced and summed up data.
 */
export const sumUpWithReducerTests = (reducerFunctions, reducerProperties, data, level1Key, level2Key, countKey) => {

  // 1. Create array for tallied frequency results
  const freqResults = []

  // 2. Loop through testor functions with conditions
  //    - Use `for...in` so we can loop as many tests as provided
  for (const testorObj in reducerFunctions) {

    // 3. Loop through interested properties
    //    - Use `for...in` so we can loop as many tests as provided
    for (const rProperty in reducerProperties) {

      // 4. Tally frequency based on condition in functions
      const summedUpLevel = sum(
        // The `data` to loop through
        data,
        // Accessors like this are just fancy `for` loops like .map()
        (d) => {
          // If this object's property matches our desired rProperty property
          if (d[level1Key] == reducerProperties[rProperty]) {
            // Test this object against our testor function
            const xTotalToSum = reducerFunctions[testorObj]["func"](d)
            // Whatever Number value is returned, add it to the running tally
            return xTotalToSum
          }
        }
      )

      // 5. Push result to array of results
      freqResults.push({
        // KEY->VALUE pairs with newly summed up absolute frequency
        [level1Key]: reducerProperties[rProperty],
        [level2Key]: reducerFunctions[testorObj]["type"],
        [countKey]: summedUpLevel
      })

    }

  }

  // 6. Return array of freq objects
  return freqResults
}

/**
 * Write your 3-level grouping code below.
 *
 * IMPORTANT!
 * You can jump start your rollups and flatMap
 * function at three levels by:
 *
 * (1) Copying and pasting twoLevelRollUpFlatMap();
 * (2) Renaming it to threeLevelRollUpFlatMap();
 * (3) Updating the parameters and code comment to
 *     include 1 more level; and
 * (4) Add 1 more nested .flatMap() to handle the
 *     third level.
**/

export const threeLevelRollUpFlatMap = (data, level1Key, level2Key, level3Key, countKey) => {
   const colTotals = rollups(
    data,
    (v) => v.length, //Count length of leaf node
    (d) => d[level1Key], //Accessor at 1st level
      (d) => d[level2Key], //Accessor at 2nd level
        (d) => d[level3Key],//accessor at 3rd level
  )

  // 2. Flatten 1st grouped level back to array of objects
  const flatTotals = colTotals.flatMap((l1Elem) => {

    // 2.1 Assign level 1 key
    let l1KeyValue = l1Elem[0]

    // 2.2 Flatten 2nd grouped level
    const flatLevels = l1Elem[1].flatMap((l2Elem) => {

      // 2.2.1 Assign level 2 key
      let l2KeyValue = l2Elem[0]

       const finalLevel = l2Elem[1].flatMap((l3Elem) => {
          let l3KeyValue = l3Elem[0]
          return {
          [level1Key]: l1KeyValue,
          [level2Key]: l2KeyValue,
          [level3Key]: l3KeyValue,
          [countKey]: l3Elem[1]
          }
        })
      return finalLevel
      // 2.2.2 Return fully populated object
    })
    // 3. Return flattened array of objects
    return flatLevels
  })
  // 3. Return the sorted totals
  return flatTotals
}

/** downloadAsCSV()
 * Goal "Save" the Array of Objects as a new dataset to your local computer.
 *  - Saves as a .csv file
 *
 * @params
 * 1. value: Array of Objects.
 * 2. name: String. Name of file to save it as. "data" as default.
 * 3. Label for the button.
 *
 * HOW TO USE IN NOTEBOOKS
 *
```js
view(
  downloadAsCSV(
    // Fancy method to convert array of objects to CSV string
    async () => {
      const csvFullString = d3.csvFormat(afGroupedPercResults);
      return new Blob([csvFullString], { type: "text/csv" });
    },
    // Filename
    "nc-absentee-ballot-requests-by-week-race-status.csv",
    // Button Label
    "Save Dataset As CSV"
  )
);
```
 *
**/
export const downloadAsCSV = (value, name = "data", label = "Save") => {
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