# 🧩 MCP Clean Architecture for `fleet-mcp` (HTTP Stateless)

This document defines the canonical architecture for the `fleet-mcp` project.
It is designed for **FastMCP** servers served over HTTP where each request is
stateless and constructs its own dependency chain.

---

## ⚙️ Guiding Principles

- **Stateless HTTP:** every request instantiates its own dependencies.
- **Dependency flow:** tool ➜ service ➜ repository ➜ client.
- **Single responsibility:** each layer knows only the one below it.
- **Clean structure:** all I/O (HTTP, tokens, URLs) stays in the client.
- **Typed boundaries:** all inputs/outputs are Pydantic models.

---

## 🗂️ Folder Structure

```text
fleet-mcp/
└── src/
    └── fleet_mcp/
        ├── tools/
        │   ├── agent_management.py
        │   ├── task_management.py
        │   └── discovery.py
        ├── services/
        │   ├── agent_service.py
        │   ├── task_service.py
        │   └── discovery_service.py
        ├── repositories/
        │   ├── agent_repository.py
        │   ├── task_repository.py
        │   └── discovery_repository.py
        ├── clients/
        │   └── coder_client.py
        ├── schemas/
        │   ├── agent.py
        │   ├── task.py
        │   ├── discovery.py
        │   ├── common.py
        │   └── __init__.py
        └── config.py
```

---

## 🔗 Construction & Lifetime

Because the MCP server is HTTP-based, each request is independent.

Every **tool invocation** builds the dependency chain:

```text
request
  → Tool()
      → Service()
          → Repository()
              → Client()
```

There are **no module-level singletons**. Each layer constructs the next layer.

---

## 🧩 Layers

| Layer | Responsibility | Notes |
|-------|----------------|-------|
| **Tools** | MCP entrypoints (grouped by domain). Create a new service per request. | No HTTP or client logic. |
| **Services** | Implements workflows / use cases. Instantiates repositories. | Orchestrates logic only. |
| **Repositories** | Data access and shaping. Instantiates clients. | Combines multiple endpoints. |
| **Clients** | Raw HTTP communication with external systems (Coder). | Knows auth, base URL, endpoints. |
| **Schemas** | Pydantic models for tool I/O, domain, and remote data. | Typed across all layers. |

---

## 🧱 Config

Centralized configuration for shared settings:

```python
# fleet_mcp/src/fleet_mcp/config.py
import os

CODER_BASE_URL = os.getenv("CODER_BASE_URL", "https://coder.example.com/api/v2")
CODER_TOKEN = os.getenv("CODER_TOKEN", "changeme")
```

Repositories use this to build clients.

---

## 🧠 Example: Agent Flow

```text
tools/agent_management.py
    → services/agent_service.py
        → repositories/agent_repository.py
            → clients/coder_client.py
                → Coder REST API
```

### Client

```python
# clients/coder_client.py
import httpx

class CoderApiClient:
    def __init__(self, base_url: str, token: str):
        self._client = httpx.Client(
            base_url=base_url,
            headers={"Authorization": f"Bearer {token}"}
        )

    def list_agents(self):
        res = self._client.get("/api/v2/agents")
        res.raise_for_status()
        return res.json()

    def get_agent(self, agent_id: str):
        res = self._client.get(f"/api/v2/agents/{agent_id}")
        res.raise_for_status()
        return res.json()

    def create_agent(self, payload: dict):
        res = self._client.post("/api/v2/agents", json=payload)
        res.raise_for_status()
        return res.json()

    def delete_agent(self, agent_id: str):
        res = self._client.delete(f"/api/v2/agents/{agent_id}")
        res.raise_for_status()
```

### Repository

```python
# repositories/agent_repository.py
from fleet_mcp.clients.coder_client import CoderApiClient
from fleet_mcp import config
from fleet_mcp.schemas.agent import AgentRemote, AgentDomain

class AgentRepository:
    def __init__(self):
        self._coder = CoderApiClient(
            base_url=config.CODER_BASE_URL,
            token=config.CODER_TOKEN,
        )

    def list_agents(self) -> list[AgentDomain]:
        raw = self._coder.list_agents()
        remotes = [AgentRemote.model_validate(r) for r in raw]
        return [AgentDomain.from_remote(r) for r in remotes]

    def create_agent(self, payload: dict) -> AgentDomain:
        raw = self._coder.create_agent(payload)
        return AgentDomain.from_remote(AgentRemote.model_validate(raw))

    def get_agent(self, agent_id: str) -> AgentDomain:
        raw = self._coder.get_agent(agent_id)
        return AgentDomain.from_remote(AgentRemote.model_validate(raw))

    def delete_agent(self, agent_id: str):
        self._coder.delete_agent(agent_id)
```

### Service

```python
# services/agent_service.py
from fleet_mcp.repositories.agent_repository import AgentRepository
from fleet_mcp.schemas.agent import CreateAgentRequest, AgentDomain

class AgentService:
    def __init__(self):
        self._repo = AgentRepository()

    def list_agents(self) -> list[AgentDomain]:
        return self._repo.list_agents()

    def create_agent(self, req: CreateAgentRequest) -> AgentDomain:
        return self._repo.create_agent(req.model_dump())

    def show_agent(self, agent_id: str) -> AgentDomain:
        return self._repo.get_agent(agent_id)

    def delete_agent(self, agent_id: str):
        self._repo.delete_agent(agent_id)
```

### Tool (HTTP request handler)

```python
# tools/agent_management.py
from fleet_mcp.services.agent_service import AgentService
from fleet_mcp.schemas.agent import (
    CreateAgentRequest,
    CreateAgentResponse,
    ListAgentsResponse,
    ShowAgentResponse,
    DeleteAgentResponse,
)

def create_agent(req: CreateAgentRequest) -> CreateAgentResponse:
    service = AgentService()
    agent = service.create_agent(req)
    return CreateAgentResponse(agent=agent)

def list_agents() -> ListAgentsResponse:
    service = AgentService()
    agents = service.list_agents()
    return ListAgentsResponse(agents=agents)

def show_agent(agent_id: str) -> ShowAgentResponse:
    service = AgentService()
    agent = service.show_agent(agent_id)
    return ShowAgentResponse(agent=agent)

def delete_agent(agent_id: str) -> DeleteAgentResponse:
    service = AgentService()
    service.delete_agent(agent_id)
    return DeleteAgentResponse(success=True)
```

---

## 🧩 Naming Conventions

| Type | Example | Description |
|------|----------|-------------|
| Remote | `AgentRemote` | Mirrors external API payloads |
| Domain | `AgentDomain` | Internal canonical representation |
| Request | `CreateAgentRequest`, `ListAgentsRequest` | Tool input |
| Response | `CreateAgentResponse`, `ListAgentsResponse` | Tool output |

---

## ✅ Refactor Rules for Claude Code

1. Every MCP tool call (HTTP request handler) **creates a new service**.
2. Services **create repositories**; repositories **create clients**.
3. No module-level singletons.
4. All HTTP logic stays in `clients/`.
5. Pydantic models are used for all inputs/outputs.
6. Keep call chain: `tools → services → repositories → clients → external API`.

That’s the stateless, clean, layered architecture for `fleet-mcp` — ready for Claude Code to refactor around. 🚀
