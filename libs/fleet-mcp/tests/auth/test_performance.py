"""Performance tests for authentication module.

These tests verify that authentication operations meet performance requirements.
"""

import time
from concurrent.futures import ThreadPoolExecutor

import pytest
from fleet_mcp.auth.middleware import AuthMiddleware
from fleet_mcp.auth.token_manager import TokenManager
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Route
from starlette.testclient import TestClient


@pytest.fixture
def temp_token_file(tmp_path):
    """Create a temporary token file for testing."""
    return tmp_path / "test_auth_token"


@pytest.fixture
def token_manager(temp_token_file):
    """Create a TokenManager with a test token."""
    manager = TokenManager(token_file_path=str(temp_token_file))
    return manager


@pytest.fixture
def valid_token(token_manager):
    """Get or create a valid token."""
    token = token_manager.get_or_create_token()
    return token.value


@pytest.fixture
def test_app(token_manager):
    """Create a test application with authentication."""

    async def endpoint(request: Request):
        """Simulated endpoint."""
        return JSONResponse({"status": "ok"})

    app = Starlette(routes=[Route("/test", endpoint)])
    app.add_middleware(AuthMiddleware, token_manager=token_manager, enabled=True)
    return app


class TestPerformance:
    """Performance tests for authentication."""

    def test_token_validation_performance(self, test_app, valid_token):
        """Test that token validation completes in <10ms per request.

        Requirement: SC-003 from plan.md
        """
        client = TestClient(test_app)

        # Warm up (first request may be slower due to initialization)
        client.get("/test", headers={"Authorization": f"Bearer {valid_token}"})

        # Measure 100 requests
        num_requests = 100
        start_time = time.perf_counter()

        for _ in range(num_requests):
            response = client.get(
                "/test", headers={"Authorization": f"Bearer {valid_token}"}
            )
            assert response.status_code == 200

        end_time = time.perf_counter()
        elapsed_ms = (end_time - start_time) * 1000
        avg_ms = elapsed_ms / num_requests

        # Verify average is <10ms per request
        assert avg_ms < 10, f"Token validation took {avg_ms:.2f}ms (expected <10ms)"

        print(
            f"\nToken validation: {avg_ms:.2f}ms average over {num_requests} requests"
        )

    def test_concurrent_requests_performance(self, test_app, valid_token):
        """Test that server can handle 1000 concurrent requests.

        Requirement: SC-003 from plan.md - No performance degradation
        """
        client = TestClient(test_app)

        def make_request():
            """Make a single authenticated request."""
            response = client.get(
                "/test", headers={"Authorization": f"Bearer {valid_token}"}
            )
            return response.status_code

        # Warm up
        make_request()

        # Measure 1000 concurrent requests
        num_requests = 1000
        start_time = time.perf_counter()

        with ThreadPoolExecutor(max_workers=50) as executor:
            results = list(executor.map(lambda _: make_request(), range(num_requests)))

        end_time = time.perf_counter()
        elapsed_s = end_time - start_time

        # Verify all requests succeeded
        assert all(
            status == 200 for status in results
        ), "Some requests failed authentication"

        # Calculate requests per second
        rps = num_requests / elapsed_s

        # Log performance metrics
        print(f"\nConcurrent requests: {num_requests} in {elapsed_s:.2f}s")
        print(f"Throughput: {rps:.2f} requests/second")
        print(f"Average latency: {(elapsed_s / num_requests) * 1000:.2f}ms")

        # Verify reasonable performance (should handle 1000 requests)
        assert rps > 100, f"Throughput too low: {rps:.2f} req/s (expected >100 req/s)"
