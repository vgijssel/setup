"""HTTP client exceptions."""


class HTTPError(Exception):
    """Base exception for HTTP errors."""

    def __init__(self, message: str, status_code: int | None = None):
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(HTTPError):
    """HTTP 404 Not Found error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=404)


class ConflictError(HTTPError):
    """HTTP 409 Conflict error."""

    def __init__(self, message: str):
        super().__init__(message, status_code=409)
