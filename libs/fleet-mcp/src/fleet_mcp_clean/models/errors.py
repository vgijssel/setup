"""Custom exception classes for fleet-mcp-clean."""


class FleetMCPError(Exception):
    """Base exception for all fleet-mcp-clean errors."""

    pass


class AgentNotFoundError(FleetMCPError):
    """Agent with specified name does not exist."""

    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        super().__init__(f"Agent '{agent_name}' not found")


class AgentConflictError(FleetMCPError):
    """Agent with specified name already exists."""

    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        super().__init__(f"Agent '{agent_name}' already exists")


class AgentInvalidStateError(FleetMCPError):
    """Agent is in invalid state for requested operation."""

    def __init__(self, agent_name: str, expected_state: str, actual_state: str):
        self.agent_name = agent_name
        self.expected_state = expected_state
        self.actual_state = actual_state
        super().__init__(
            f"Agent '{agent_name}' is {actual_state}, expected {expected_state}"
        )


class CoderAPIError(FleetMCPError):
    """Error communicating with Coder API."""

    def __init__(self, message: str, status_code: int | None = None):
        self.status_code = status_code
        super().__init__(message)


class ValidationError(FleetMCPError):
    """Validation error for input data."""

    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"Validation error for '{field}': {message}")
