# WedPilot AI — API Guidelines

## General Rules

1. All endpoints return JSON
2. Use standard HTTP methods: GET, POST, PUT, PATCH, DELETE
3. Use appropriate HTTP status codes
4. All list endpoints support pagination
5. Use `common.utils.success_response` and `error_response`

## Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful retrieval or update |
| 201 | Successful creation |
| 204 | Successful deletion |
| 400 | Bad request / validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Server error |

## Pagination

Default: 20 items per page.

Query params:
- `page` — Page number
- `page_size` — Items per page (max 100)

## Filtering and Search

Use Django Filter Backend:
- Filter: `?status=active&venue=palace`
- Search: `?search=Sharma`
- Ordering: `?ordering=-created_at`

## API Documentation

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`
