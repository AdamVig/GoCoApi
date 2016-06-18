GoCo Student API
------
The GoCo Student API provides data from a variety of Gordon College websites and other Gordon-relevant data sources. It also logs user activity, caches data to reduce load on Gordon servers, and generates user-friendly errors intended for direct display in an application.

# How to Run
1. `git clone https://github.com/AdamVig/GoCoApi.git gocoapi`
2. Copy `vars-template.js` to a file called `vars.js` and fill it in with your data.
3. Install dependencies and run the server: `npm start`
4. To make a request using [HTTPie](https://github.com/jkbrzt/httpie):
```bash
http POST http://local.dev:4626/api/[version]/[endpoint] username=[username] password=[password]
```
- replace `[version]` with version number, ex: `2.5.0`
- replace `[endpoint]` with name of endpoint, ex: `chapelcredits`
- replace `[username]` with username, ex: `firstname.lastname`
- replace `[password]` with Base64-encoded password

### Why a Base64-encoded password?
Good question! Base64 encoding is an easily-reversible process and therefore not secure for transmission of a password. Despite this, it provides a layer of security through obscurity by hiding the plaintext of a password when it shows up in the command line and browser local storage. The obvious alternative is to use a one-way hash to encrypt the password, but the web scraper component of the server requires the plaintext of the password in order to log in to websites on behalf of the user.

Of course, obscuring the password is not all that needs to be done. To attain some semblance of security while running this server, also do the following:  
1. Use HTTPS for all communication to and from the server.  
2. Send parameters in the `POST` body, not a `GET` query string. This method of security through obscurity prevents sensitive user data from showing up in logs, where URLs containing query parameters often show up.

# Endpoints
Endpoints are defined in individual files in the `routes` directory. All of the files in the directory are automatically bootstrapped as endpoints when the app starts, except for filenames that start with an underscore, which are disabled. This is a convenient way to take an endpoint offline temporarily while working on it.  

To add a new endpoint, duplicate `routes/_route-template.js` to `routes/your-route-name.js` (notice the removal of the underscore, otherwise the endpoint will remain disabled).

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

# How to Test
## Regression Testing
All enabled endpoints in the `routes` directory are included in a simple regression test located in `tests/test.js`. This test simply checks for `200 OK` responses from all endpoints with the test username and password provided in `vars.test`, defined in `vars.js` (as specified above, you must create your own `vars.js` file based on `vars-template.js`).

You can run the tests with `npm test`.

The test will print each endpoint's name with its response status code, response time, and the data it returned (except when the data is an object, because it would be extremely long).

## Load Testing
For testing of a server running the API, there is `test/load-test.js`, which you can run with `npm run loadtest`. The script uses the server URL defined in `vars.js`.  

For help, run `npm run loadtest -- --help` (note that the double `--` is necessary to pass arguments through npm to the script). The load test sends a configurable number of requests to each endpoint and reports back how long it took. Since the API depends on slow external websites, this can help you get an idea of the average response time of each endpoint.

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
