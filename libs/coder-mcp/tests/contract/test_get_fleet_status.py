"""Contract tests for get_fleet_status MCP tool."""

import pytest
from coder_mcp.tools.get_fleet_status import get_fleet_status
from coder_mcp.models import FleetStatus


@pytest.mark.asyncio
async def test_get_fleet_status_returns_fleet_status():
    """Test that get_fleet_status returns FleetStatus object."""
    result = await get_fleet_status()

    assert isinstance(result, FleetStatus)


@pytest.mark.asyncio
async def test_fleet_status_has_required_fields():
    """Test that FleetStatus has all required fields."""
    result = await get_fleet_status()

    assert hasattr(result, 'total_agents')
    assert isinstance(result.total_agents, int)
    assert result.total_agents >= 0

    assert hasattr(result, 'computed_at')
    assert result.computed_at is not None


@pytest.mark.asyncio
async def test_fleet_status_metrics_are_consistent():
    """Test that fleet status metrics are internally consistent."""
    result = await get_fleet_status()

    # Sum of status counts should equal total_agents
    status_sum = (
        result.agents_running +
        result.agents_idle +
        result.agents_busy +
        result.agents_offline +
        result.agents_error +
        result.agents_stopped
    )
    assert status_sum == result.total_agents

    # Utilization should be in valid range
    assert 0.0 <= result.fleet_utilization <= 1.0

    # Healthy percentage should be in valid range
    assert 0.0 <= result.healthy_percentage <= 1.0


@pytest.mark.asyncio
async def test_fleet_status_utilization_calculation():
    """Test that fleet utilization is calculated correctly."""
    result = await get_fleet_status()

    if result.total_agents > 0:
        expected_utilization = result.agents_busy / result.total_agents
        assert abs(result.fleet_utilization - expected_utilization) < 0.001
    else:
        assert result.fleet_utilization == 0.0


@pytest.mark.asyncio
async def test_fleet_status_health_calculation():
    """Test that fleet health metrics are calculated correctly."""
    result = await get_fleet_status()

    expected_unhealthy = result.agents_error + result.agents_offline
    assert result.unhealthy_agents == expected_unhealthy

    if result.total_agents > 0:
        expected_healthy_pct = (result.total_agents - expected_unhealthy) / result.total_agents
        assert abs(result.healthy_percentage - expected_healthy_pct) < 0.001
    else:
        assert result.healthy_percentage == 1.0
