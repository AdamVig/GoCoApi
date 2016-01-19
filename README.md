GoCo Student API
------
The GoCo Student API provides data from a variety of Gordon College websites and other Gordon-relevant data sources. It also logs user activity, caches data to reduce load on Gordon servers, and generates user-friendly errors for direct display in the application.

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
    - from web page
    - from external API
    - from database
4. Cache data
    - in user document
    - in global document
    - skip caching private user data and data from database
5. Return data or error

## Endpoint List
- Athletics Schedule (not implemented)
- Chapel Credits
- Chapel Events (not implemented)
- Check Login (not implemented)
- Days Left In Semester (not implemented)
- Highland Express (not implemented)
- Meal Points (not implemented)
- Meal Points Per Day (not implemented)
- Mock Error (not implemented)
- Next Meal (not implemented)
- Student ID (not implemented)
- Student Info (not implemented)
- Temperature (not implemented)
