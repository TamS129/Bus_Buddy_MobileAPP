# Overview

This API provides generic Create, Read, Update, Delete (CRUD) operations on whitelisted tables in a  MySQL/MariaDB database. Table names are specified in the URL path, and only tables listed in the configuration ALLOWED_TABLES constant may be accessed.

Base URL: http://<HOST>:<PORT>/api/:table

## Endpoints

All endpoints are located in the db.scholomance.io domain at port 2501.

All endpoints require Content-Type: application/json for requests with a body.

## Create (POST)

POST /api/:table

### Request Body

A JSON object mapping column names to values.

### Response

- 201 Created: { "id": <new_record_id> }
- 400 Bad Request: Invalid table or malformed payload
- 500 Internal Server Error: Database error

### Example

POST /api/users

Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com" }

---

## Read All (GET)

GET /api/:table

### Response

- 200 OK: Array of records
- 400 Bad Request: Invalid table

### Example

GET /api/products

---

## Read One (GET)

GET /api/:table/:id

### Path Parameter

- id — Primary key value

### Response

- 200 OK: Single record JSON
- 404 Not Found: No record matches id
- 400 Bad Request: Invalid table

---

## Update (PUT)

PUT /api/:table/:id

### Request Body

JSON object with column-value pairs to update.

### Response

- 204 No Content: Successfully updated
- 404 Not Found: No record matches id
- 400 Bad Request: Invalid table or payload

### Example

PUT /api/orders/123

Content-Type: application/json

{ "status": "shipped", "tracking_number": "XYZ789" }

---

## Delete (DELETE)

DELETE /api/:table/:id

### Response

- 204 No Content: Successfully deleted
- 404 Not Found: No record matches id 
- 400 Bad Request: Invalid table

### Example

DELETE /api/users/42

---

## Custom Query (POST)

POST /api/:table/query

### Response

- 400 Bad Request: Query is malformed or is not a SELECT query.

**Example**

Content-Type: application/json  

{  "query": "SELECT \* FROM users WHERE email LIKE '%@example.com'" }