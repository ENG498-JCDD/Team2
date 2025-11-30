# Enter Title of Project Here "National Parks and Economic Struggle"

**NOTE FOR NEW PROJECT**: Don't forget to update the `observablehq.config.js` file. Delete this paragraph, when completed.

- Josephine Kinsey
- Lily Soetebier
- [Project Tracker](https://docs.google.com/spreadsheets/d/1kkqV6Vr_Or1GaU5Lk8j9iXLMugGUy4Yz/edit?gid=1279484845#gid=1279484845) 

## Project Description

Recent executive orders and defunding of departments and agencies in the federal government have resulted in the depletion of resources available for the maintenance of parks and people employed by the National Park Service. Simultaneously, there is a recession (one could argue a depression) being felt throughout the United States. We believe that there could be a link between national parks visitation and economic difficulty. To measure this, we compare the unemployment rates and GDP of states with national parks within them. We want to observe how these rates compare to visitation rates in national park, and share these results with others who value the protection of the U.S. National Parks Service from politically motivated defunding and employment cuts.

## About the Data

<!-- **`src/data/path/to/dataset.csv`**
- **Topic**: Enter broader topic of dataset.
- **Overview**: Enter brief description for each dataset.
- **Source**: [Enter link to source]()
- **Sample Row**:
  ```csv
  enter,sample,row,here
  1,2,3,"Hello world!"
  ``` -->

**`src/data/FRED/annual_gdp_by_state.csv`**
- **Topic**: Annual GDP by State
- **Overview**: The annual GDP for each state from 2008-2025. For economic piece of hypothesis.
- **Source**: [Enter link to source]()
- **Sample Row**: *the row follows the following pattern: "Year,Alaska,Arizona,Arkansas,California,Colorado,Florida,Hawaii,Idaho,Indiana,Kentucky,Maine,Michigan,Minnesota,Missouri,Montana,Nevada,New Mexico,North Carolina,North Dakota,Ohio,Oregon,South Carolina,South Dakota,Tennessee,Texas,Utah,Virginia,"Washington, D.C",Washington,West Virginia,Wyoming,U.S. Territory,National"*
  ```csv
  2008,55246.7,261005.8,100206.7,1946242,257606.1,767357.8,65545.5,56203.6,277774.5,160700.2,51001.9,391633.6,268771.5,256431.1,37028,130570.9,84339.7,420707.2,32027.7,500916.4,164122.9,164471.2,36939.3,255546.7,1253142,116949.2,402157.8,395698.808,352460.7,62978.7,42694.6,null,14769.862
  ```

  `**`src/data/FRED/average_annual_unemployment_rate.csv`**
- **Topic**: Average Annual Unemployment Rate by State.
- **Overview**: The annual average unemployment rate for each state from 2008-2025. For economic piece of hypothesis.
- **Source**: [Enter link to source]()
- **Sample Row**: *the row follows the following pattern: Year,Alaska,Arizona,Arkansas,California,Colorado,Florida,Hawaii,Idaho,Indiana,Kentucky,Maine,Michigan,Minnesota,Missouri,Montana,Nevada,New Mexico,North Carolina,North Dakota,Ohio,Oregon,South Carolina,South Dakota,Tennessee,Texas,Utah,Virginia,"Washington, D.C.",Washington,West Virginia,Wyoming,U.S. Territory,National
  ```2008,6.5,5.8,5.4,7.3,4.8,6.3,4.1,5,5.9,6.5,5.4,8.2,5.5,6.2,4.7,6.9,4.4,5.9,3.1,6.6,6.3,6.9,3.1,6.5,4.9,3.3,4.1,6.5,5.2,4.5,3,null,5.8
  ```
  `**`src/data/NPS/annual_visits_2008_2024.csv**
- **Topic**: Annual NPS Visits 2008-2024.
- **Overview**: The annual number of visits to each park from 2008-2024. For the visitation portion of the hypothesis.
- **Source**: [Enter link to source]()
- **Sample Row**: These rows follow the same pattern seen above
  ```csv
 2008,2075857,928795,845734,362512,686062,160185,1043321,436715,604811,400381,332177,104913,415686,2828233,871938,432309,63947,822118,11397,1954810,418911,1808027,4425314,2485987,69235,273903,9044010,163709,1185068,1270538,1238147,1833596,14038,1392446,7970,272190,574870,1565,6802,377361,446174,551446,1163227,1212854,18725,3081451,543714,166988,396899,2076466,2757390,699137,930011,1075878,516804,469034,221585,438511,573433,65693,3066580,3431514,2690154
  ```
  `**`src/data/NPS/full_parks_dataset .csv**
- **Topic**: Full Parks Dataset.
- **Overview**: More supplemental information about the parks, mainly relating to location.
- **Source**: [Enter link to source]()
- **Sample Row**:*the rows follow the following pattern: name,state,latitude,longitude,entranceFees*
  ```csv
  Acadia National Park,Maine,44.409286,-68.247501,yes
  ```
    `**`src/data/NPS/park_fees.csv`**
- **Topic**: NPS Park Fees.
- **Overview**: A dataset of fees including what park, what tyoe of fee, the cost and a description.
- **Source**: [Enter link to source]()
- **Sample Row**: name,feeType,cost,description
  ```csv
 Acadia National Park,Entrance - Private Vehicle,35.00,"Valid for seven days. Admits private, non-commercial vehicle (15 passenger capacity or less) and all occupants. This includes rental cars, RVs, and vans with fewer than 16 passengers. If the vehicle pass is purchased, no other pass is necessary."
  ```
    `**`src/data/NPS/parks_by_activities.csv`**
- **Topic**: NPS Parks by Activities.
- **Overview**: A List of national parks, their specific designation, activities at the park, and geographic information.
- **Source**: [Enter link to source]()
- **Sample Row**: name,fullName,parkCode,parkID,designation,description,latitude,longitude,city,stateCode,postalCode,activities
  ```csv
 Abraham Lincoln Birthplace,Abraham Lincoln Birthplace National Historical Park,abli,77E0D7F0-1942-494A-ACE2-9004D2BDC59E,National Historical Park,"For over a century people from around the world have come to rural Central Kentucky to honor the humble beginnings of our 16th president, Abraham Lincoln. His early life on Kentucky's frontier shaped his character and prepared him to lead the nation through Civil War. Visit our country's first memorial to Lincoln, built with donations from young and old, and the site of his childhood home.",37.5858662,-85.67330523,Hodgenville,KY,42748,Astronomy
  ```
    `**`src/data/NPS/parks_by_exception_hours.csv`**
- **Topic**: NPS Park Exception Hours.
- **Overview**: A list of national parks inlcuding dates and times the park is closed due to holidays, maintenance, emergencies, ect.
- **Source**: [Enter link to source]()
- **Sample Row**: name,fullName,parkCode,parkID,designation,description,latitude,longitude,city,stateCode,postalCode,exceptionType,startDate,endDate
  ```csv
  Abraham Lincoln Birthplace,Abraham Lincoln Birthplace National Historical Park,abli,77E0D7F0-1942-494A-ACE2-9004D2BDC59E,National Historical Park,"For over a century people from around the world have come to rural Central Kentucky to honor the humble beginnings of our 16th president, Abraham Lincoln. His early life on Kentucky's frontier shaped his character and prepared him to lead the nation through Civil War. Visit our country's first memorial to Lincoln, built with donations from young and old, and the site of his childhood home.",37.5858662,-85.67330523,Hodgenville,KY,42748,Park is Closed,2025-11-27,2025-11-27
  ```
    `**`src/data/NPS/parks_by_topics.csv`**
- **Topic**: NPS Park Topics.
- **Overview**: A list of national parks inlcuding tags for different topics that apply to each park.
- **Source**: [Enter link to source]()
- **Sample Row**: name,fullName,parkCode,parkID,designation,description,latitude,longitude,city,stateCode,postalCode,topics
  ```csv
  Abraham Lincoln Birthplace,Abraham Lincoln Birthplace National Historical Park,abli,77E0D7F0-1942-494A-ACE2-9004D2BDC59E,National Historical Park,"For over a century people from around the world have come to rural Central Kentucky to honor the humble beginnings of our 16th president, Abraham Lincoln. His early life on Kentucky's frontier shaped his character and prepared him to lead the nation through Civil War. Visit our country's first memorial to Lincoln, built with donations from 
  ```
**`src/data/NPS/refactored_annual_visits.csv`**
- **Topic**: The visitation of each par by year.
- **Overview**: A simple to read list of each park by year with its total visitation number.
- **Source**: [Enter link to source]()
- **Sample Row**: year,park,visits
  ```csv
  2008,Acadia National Park,2075857
  ```

See the README for the dataset for more information.

## About the Data App

This is an [Observable Framework](https://observablehq.com/framework/) app. To install the required dependencies, run:

```
yarn install
```

Then, to start the local preview server, run:

```
yarn dev
```

Then visit <http://localhost:3000> to preview your app.

For more, see <https://observablehq.com/framework/getting-started>.

## Project structure

A typical Framework project looks like this:

```ini
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the app config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/project-structure#routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your app. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/data-loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [app configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the app’s title.

## Command reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `yarn install`            | Install or reinstall dependencies                        |
| `yarn dev`        | Start local preview server                               |
| `yarn build`      | Build your static site, generating `./dist`              |
| `yarn deploy`     | Deploy your app to Observable                            |
| `yarn clean`      | Clear the local data loader cache                        |
| `yarn observable` | Run commands like `observable help`                      |
