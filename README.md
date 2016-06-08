GoCo Student API
------
The GoCo Student API provides data from a variety of Gordon College websites and other Gordon-relevant data sources. It also logs user activity, caches data to reduce load on Gordon servers, and generates user-friendly errors for direct display in the application.

# How to Run
1. `cd [desired project directory]`
2. To get source: `git clone https://github.com/AdamVig/GoCoApi.git .`
3. To install dependencies: `npm install`
4. Add your data to `vars-template.js` and rename the file to `vars.js`.
5. To run server: `node index.js`
6. To access data:
    ```
    curl -i -X GET localhost:8080/gocostudent/[version]/[endpoint] \
    -H Content-Type:application/json \
    -d '{"username":"[username]", "password": "'[password]'"}'
    ```
    - replace `[version]` with version number, ex: `2.5`
    - replace `[endpoint]` with name of endpoint, ex: `chapelcredits`
    - replace `[username]` with username, ex: `firstname.lastname`
    - replace `[password]` with Base64-encoded password

# How to Test
All endpoints listed in `config.routes`, as defined in `config.js`, are included in a simple regression test located in `tests/test.js`. This test simply checks for `200 OK` responses from all endpoints with the test username and password provided in `vars.test`, defined in `vars.js` (as specified above, you must create your own `vars.js` file based on `vars-template.js`).

You can run the tests with the following commands:
```bash
npm install -g mocha
npm test
```

The test will print each endpoint's name with its response status code, response time, and the data it returned (except when the data is an object, because it would be extremely long).

# Endpoints
## Types of Endpoint
- scrape user-specific data from webpage, cache in user database, return data (ex: chapel credits, meal points)
- scrape non-user-specific data from webpage, cache in global cache, return data (ex: chapel events, athletics)
- get data from an external API, cache in database, return data (ex: temperature)
- get data from database, return data (ex: days left in semester, Highland Express)

## Endpoint Parts
1. Definition (app.get())
2. Get authentication
3. Get raw data
    - from web page (requires parsing and processing)
    - from external API (requires processing)
    - from database (may require processing)
4. Return data or error
5. Cache data
    - in user document
    - in global document
    - skip caching private user data and data from database

## Endpoint List
- Athletics Schedule
- Chapel Credits
- Chapel Events
- Check Login
- Days Left In Semester
- Highland Express (partially implemented, needs PUT functionality)
- Meal Points
- Meal Points Per Day
- Mock Error
- Next Meal
- Student ID
- Temperature
# License
The GoCo Student API, a programmatic interface for Gordon College student data.  
Copyright © 2016 Adam Vigneaux  

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
