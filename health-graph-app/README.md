This is a frontend-only web application that tests multiple external API endpoints and automatically falls back to predefined mock models when requests fail due to network issues, permission errors, or CORS restrictions.
 
## Overview
 
- **`index.html`**: Hosts the advanced user interface for interacting with live or fallback data.

- **`app.js`**: Implements all application logic, including API calls, error handling, and dynamic data rendering.

- **`config.js`**: Central configuration file defining all API endpoints, request parameters, and associated mock data models.
 
## Functionality
 
- Dynamically loads API configuration from `config.js`.

- Performs client-side `fetch()` requests to one or more external APIs.

- Detects and handles:

  - Network errors

  - CORS or access-denied responses

  - Non-success HTTP status codes

- Seamlessly falls back to predefined mock data when needed.

- Maintains full UI functionality regardless of API availability.
 
## Usage
 
1. Open `index.html` in any modern web browser.

2. The app reads API definitions from `config.js` and attempts to retrieve live data.

3. If an API request fails, `app.js` substitutes mock data defined in the configuration.

4. The UI reflects the data source state transparently.
 
## Notes
 
- Entirely client-side: no backend or server required.

- Designed for testing APIs in constrained environments and ensuring frontend resilience under failure conditions.
 