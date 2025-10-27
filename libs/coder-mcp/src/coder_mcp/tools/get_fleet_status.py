"""MCP tool for computing fleet-wide status metrics.

Provides get_fleet_status function that aggregates agent data to compute
fleet utilization, health metrics, and status breakdowns.
"""

from datetime import datetime

from coder_mcp.models import FleetStatus
from coder_mcp.tools.list_agents import list_agents


async def compute_fleet_status_from_agents(agents: list) -> FleetStatus:
    """Compute fleet status metrics from list of agents.

    Args:
        agents: List of Agent objects.

    Returns:
        FleetStatus object with computed metrics.
    """
    total_agents = len(agents)

    # Count agents by status
    status_counts = {
        "running": 0,
        "idle": 0,
        "busy": 0,
        "offline": 0,
        "error": 0,
        "stopped": 0,
    }

    for agent in agents:
        status_key = agent.status.value
        if status_key in status_counts:
            status_counts[status_key] += 1

    # Calculate utilization (percentage of agents busy)
    fleet_utilization = 0.0
    if total_agents > 0:
        fleet_utilization = status_counts["busy"] / total_agents

    # Calculate health metrics
    unhealthy_agents = status_counts["error"] + status_counts["offline"]
    healthy_percentage = 1.0
    if total_agents > 0:
        healthy_percentage = (total_agents - unhealthy_agents) / total_agents

    # Count active tasks (busy agents)
    total_active_tasks = status_counts["busy"]

    return FleetStatus(
        total_agents=total_agents,
        agents_running=status_counts["running"],
        agents_idle=status_counts["idle"],
        agents_busy=status_counts["busy"],
        agents_offline=status_counts["offline"],
        agents_error=status_counts["error"],
        agents_stopped=status_counts["stopped"],
        total_active_tasks=total_active_tasks,
        fleet_utilization=fleet_utilization,
        computed_at=datetime.now(),
        unhealthy_agents=unhealthy_agents,
        healthy_percentage=healthy_percentage,
    )


async def get_fleet_status() -> FleetStatus:
    """Get aggregate fleet status metrics.

    Queries all agents and computes fleet-wide metrics including utilization,
    health percentage, and status breakdowns.

    Returns:
        FleetStatus object with computed metrics.
    """
    # Fetch all agents
    agents = await list_agents()

    # Compute and return fleet status
    return await compute_fleet_status_from_agents(agents)
