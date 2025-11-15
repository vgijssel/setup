"""FastMCP server entry point for fleet-mcp."""

import logging
import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastmcp import FastMCP
from pydantic import Field
from starlette.responses import JSONResponse
from typing_extensions import Annotated

from .auth.middleware import AuthMiddleware
from .auth.token_manager import TokenManager
from .clients import CoderClient
from .models import AgentStatus
from .repositories import (
    AgentRepository,
    MetadataRepository,
    ProjectRepository,
    TaskRepository,
)
from .services import AgentService, ProjectService, TaskService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.info("Loading environment variables")

# Initialize FastMCP server
mcp = FastMCP("Fleet MCP Clean", version="0.2.0")

# Coder API configuration
CODER_URL = os.getenv("CODER_URL")
CODER_SESSION_TOKEN = os.getenv("CODER_SESSION_TOKEN")

if not CODER_URL or not CODER_SESSION_TOKEN:
    logger.error(
        "Missing required environment variables: CODER_URL and/or CODER_SESSION_TOKEN"
    )
    raise ValueError(
        "CODER_URL and CODER_SESSION_TOKEN environment variables are required"
    )

logger.info(f"Configured Coder API connection to: {CODER_URL}")

# Create singletons for dependency injection
_coder_client: CoderClient | None = None
_agent_repo: AgentRepository | None = None
_project_repo: ProjectRepository | None = None
_task_repo: TaskRepository | None = None
_metadata_repo: MetadataRepository | None = None
_agent_service: AgentService | None = None
_project_service: ProjectService | None = None
_task_service: TaskService | None = None


def get_coder_client() -> CoderClient:
    """Get or create CoderClient singleton."""
    global _coder_client
    if _coder_client is None:
        _coder_client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    return _coder_client


def get_agent_repository() -> AgentRepository:
    """Get or create AgentRepository singleton."""
    global _agent_repo
    if _agent_repo is None:
        _agent_repo = AgentRepository(get_coder_client())
    return _agent_repo


def get_project_repository() -> ProjectRepository:
    """Get or create ProjectRepository singleton."""
    global _project_repo
    if _project_repo is None:
        _project_repo = ProjectRepository(get_coder_client())
    return _project_repo


def get_metadata_repository():
    """Get or create MetadataRepository singleton."""
    from .repositories.metadata_repository import MetadataRepository

    global _metadata_repo
    if _metadata_repo is None:
        _metadata_repo = MetadataRepository(get_coder_client())
    return _metadata_repo


def get_agent_service() -> AgentService:
    """Get or create AgentService singleton."""
    global _agent_service
    if _agent_service is None:
        _agent_service = AgentService(
            get_agent_repository(), get_project_repository(), get_metadata_repository()
        )
    return _agent_service


def get_project_service() -> ProjectService:
    """Get or create ProjectService singleton."""
    global _project_service
    if _project_service is None:
        _project_service = ProjectService(get_project_repository())
    return _project_service


def get_task_repository() -> TaskRepository:
    """Get or create TaskRepository singleton."""
    global _task_repo
    if _task_repo is None:
        _task_repo = TaskRepository(get_coder_client())
    return _task_repo


def get_task_service() -> TaskService:
    """Get or create TaskService singleton."""
    global _task_service
    if _task_service is None:
        _task_service = TaskService(get_task_repository(), get_agent_repository())
    return _task_service


# ========================================================================
# User Story 1: Agent Discovery Tools
# ========================================================================


@mcp.tool()
async def list_agents(
    status_filter: Annotated[
        Optional[str],
        Field(
            None,
            description="Optional filter by agent status (starting, idle, busy, offline, failed)",
        ),
    ] = None,
    project_filter: Annotated[
        Optional[str], Field(None, description="Optional filter by project name")
    ] = None,
) -> dict:
    """List all agents in the fleet with optional filtering."""
    from .tools.list_agents import list_agents as list_agents_impl

    # Convert status_filter string to AgentStatus enum if provided
    status_enum = None
    if status_filter:
        try:
            status_enum = AgentStatus(status_filter.lower())
        except ValueError:
            pass

    result = await list_agents_impl(
        get_agent_service(), status_filter=status_enum, project_filter=project_filter
    )
    return result.model_dump()


@mcp.tool()
async def show_agent(
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=32, description="Name of the agent to retrieve"),
    ],
) -> dict:
    """Show detailed information about a specific agent."""
    from .tools.show_agent import show_agent as show_agent_impl

    result = await show_agent_impl(get_agent_service(), agent_name=agent_name)
    return result.model_dump()


@mcp.tool()
async def list_agent_projects() -> dict:
    """List all available projects (templates) that can be used to create agents."""
    from .tools.list_projects import list_agent_projects as list_projects_impl

    result = await list_projects_impl(get_project_service())
    return result.model_dump()


@mcp.tool()
async def list_agent_roles(
    project: Annotated[str, Field(description="Project name to query roles for")],
) -> dict:
    """List all available roles (workspace presets) for a specific project."""
    from .tools.list_roles import list_agent_roles as list_roles_impl

    result = await list_roles_impl(get_project_service(), project=project)
    return result.model_dump()


# ========================================================================
# User Story 2: Agent Lifecycle Management Tools
# ========================================================================


@mcp.tool()
async def create_agent(
    name: Annotated[
        str, Field(description="Unique short agent name (e.g., Sony, Papi)")
    ],
    project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
    task: Annotated[
        str, Field(description="Task description defining objectives and constraints")
    ],
    role: Annotated[
        str | None,
        Field(
            description="Agent role matching Coder workspace preset (e.g., coder, operator, manager). If not specified, the default role will be chosen by the Coder backend."
        ),
    ] = None,
) -> dict:
    """Create a new Claude Code agent in a Coder workspace."""
    from .tools.create_agent import create_agent as create_agent_impl

    result = await create_agent_impl(
        get_agent_service(), name=name, project=project, task=task, role=role
    )
    return result.model_dump()


@mcp.tool()
async def delete_agent(
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=32, description="Name of the agent to delete"),
    ],
) -> dict:
    """Delete an agent and destroy its underlying workspace (forceful deletion)."""
    from .tools.delete_agent import delete_agent as delete_agent_impl

    result = await delete_agent_impl(get_agent_service(), agent_name=agent_name)
    return result.model_dump()


@mcp.tool()
async def restart_agent(
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=32, description="Name of the agent to restart"),
    ],
) -> dict:
    """Restart an agent's workspace to refresh its environment."""
    from .tools.restart_agent import restart_agent as restart_agent_impl

    result = await restart_agent_impl(get_agent_service(), agent_name=agent_name)
    return result.model_dump()


# ========================================================================
# User Story 3: Task Assignment and Cancellation Tools
# ========================================================================


@mcp.tool()
async def start_agent_task(
    agent_name: Annotated[
        str,
        Field(
            min_length=1,
            max_length=32,
            description="Name of the agent to assign task to",
        ),
    ],
    task_description: Annotated[
        str,
        Field(
            min_length=1,
            description="Task description defining objectives and constraints",
        ),
    ],
) -> dict:
    """Start a task on an idle agent."""
    from .tools.start_task import start_agent_task as start_task_impl

    result = await start_task_impl(
        get_task_service(), agent_name=agent_name, task_description=task_description
    )
    return result.model_dump()


@mcp.tool()
async def cancel_agent_task(
    agent_name: Annotated[
        str,
        Field(
            min_length=1,
            max_length=32,
            description="Name of the agent to cancel task for",
        ),
    ],
) -> dict:
    """Cancel the current task on a busy agent by sending Ctrl+C interrupt signal."""
    from .tools.cancel_task import cancel_agent_task as cancel_task_impl

    result = await cancel_task_impl(get_task_service(), agent_name=agent_name)
    return result.model_dump()


# ========================================================================
# User Story 4: Task History and Logs
# ========================================================================


@mcp.tool()
async def show_agent_task_history(
    agent_name: Annotated[str, Field(description="Name of the agent to query")],
    page: Annotated[int, Field(ge=1, description="Page number (1-indexed)")] = 1,
    page_size: Annotated[
        int, Field(ge=1, le=100, description="Items per page (max 100)")
    ] = 20,
) -> dict:
    """Show paginated task history for an agent ordered by created_at descending (newest first)."""
    from .tools.show_task_history import show_agent_task_history as show_history_impl

    return await show_history_impl(get_task_service(), agent_name, page, page_size)


@mcp.tool()
async def show_agent_log(
    agent_name: Annotated[str, Field(description="Name of the agent to query")],
    page: Annotated[int, Field(ge=1, description="Page number (1-indexed)")] = 1,
    page_size: Annotated[
        int, Field(ge=1, le=100, description="Items per page (max 100)")
    ] = 1,
) -> dict:
    """Show paginated conversation logs for an agent ordered by time descending (newest first). Default page size is 1 for latest only."""
    from .tools.show_logs import show_agent_log as show_logs_impl

    return await show_logs_impl(get_task_service(), agent_name, page, page_size)


# ========================================================================
# Health Check (Custom HTTP Route)
# ========================================================================


@mcp.custom_route("/health", methods=["GET"])
async def health_check(request):
    """Health check endpoint for monitoring and load balancers.

    Returns a JSON response indicating the server's operational status.
    This endpoint is accessible at http://host:port/health
    """
    return JSONResponse(
        {
            "status": "healthy",
            "service": "fleet-mcp",
            "version": "0.2.0",
            "coder_url": CODER_URL,
        }
    )


@mcp.custom_route("/metadata", methods=["GET"])
async def get_workspace_metadata(request):
    """Workspace metadata endpoint for agent context.

    Returns metadata about the workspace (git branch, PR number, etc.)
    by executing tasks defined in the workspace's Taskfile.yml.

    This endpoint is accessible at http://host:port/metadata
    """
    from .services.metadata_service import MetadataService

    # Get Taskfile path from environment or use default
    # FLEET_MCP_TASKFILE should be an absolute path to the Taskfile.yml
    taskfile_path = os.getenv("FLEET_MCP_TASKFILE", str(Path.cwd() / "Taskfile.yml"))

    try:
        service = MetadataService(taskfile_path=taskfile_path)
        metadata = await service.collect_metadata()

        # Return WorkspaceMetadata as JSON
        return JSONResponse(metadata.model_dump())

    except Exception as e:
        logger.error(f"Error collecting workspace metadata: {e}")
        # Return empty metadata on error (graceful degradation)
        from .models.metadata import WorkspaceMetadata

        empty_metadata = WorkspaceMetadata(data={})
        return JSONResponse(empty_metadata.model_dump())


# ========================================================================
# Authentication Configuration
# ========================================================================

# Get auth configuration from environment
AUTH_ENABLED = os.getenv("FLEET_MCP_AUTH_ENABLED", "false").lower() == "true"
AUTH_TOKEN_FILE = os.getenv(
    "FLEET_MCP_AUTH_TOKEN_FILE",
    str(Path.home() / ".fleet-mcp" / "auth_token"),
)

logger.info(f"Authentication enabled: {AUTH_ENABLED}")
if AUTH_ENABLED:
    logger.info(f"Token file location: {AUTH_TOKEN_FILE}")

# Create TokenManager singleton
_token_manager = TokenManager(token_file_path=AUTH_TOKEN_FILE)

# If authentication is enabled, create token immediately on startup
# This ensures the token is available before the first request
if AUTH_ENABLED:
    _token_manager.get_or_create_token()
    logger.info("Authentication token initialized")

# Create the ASGI application for stateless HTTP mode (uvicorn)
app = mcp.http_app(stateless_http=True)

# Wrap with authentication middleware
app.add_middleware(AuthMiddleware, token_manager=_token_manager, enabled=AUTH_ENABLED)


def main():
    """Main entry point for the console script (stdio mode)."""
    mcp.run()


def serve():
    """Console script entry point to run the server in HTTP mode with uvicorn.

    This starts the FastMCP server in stateless HTTP mode using uvicorn with:
    - Host: 127.0.0.1
    - Port: 8000
    - Auto-reload enabled for development
    - Graceful shutdown timeout: 3 seconds
    """
    import uvicorn

    uvicorn.run(
        "fleet_mcp.__main__:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        timeout_graceful_shutdown=3,
    )


# Entry point for fastmcp run (stdio mode)
if __name__ == "__main__":
    main()
