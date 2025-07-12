import uuid
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import List, Optional


class SessionStatus(Enum):
    """Status of an AI agent session."""

    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ERROR = "error"


@dataclass
class Session:
    """Represents an AI agent session."""

    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    status: SessionStatus = SessionStatus.ACTIVE
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    workspace_path: Optional[Path] = None
    branch_name: Optional[str] = None
    task_description: str = ""
    progress_notes: List[str] = field(default_factory=list)

    def __post_init__(self):
        if not self.name:
            self.name = f"session-{self.id}"
        if not self.branch_name:
            self.branch_name = f"friendo/{self.id}"

    def update_status(self, status: SessionStatus) -> None:
        """Update the session status and timestamp."""
        self.status = status
        self.updated_at = datetime.now()

    def add_progress_note(self, note: str) -> None:
        """Add a progress note to the session."""
        self.progress_notes.append(f"[{datetime.now().strftime('%H:%M')}] {note}")
        self.updated_at = datetime.now()

    @property
    def display_name(self) -> str:
        """Return formatted display name for the session."""
        status_icon = {
            SessionStatus.ACTIVE: "🟢",
            SessionStatus.PAUSED: "🟡",
            SessionStatus.COMPLETED: "✅",
            SessionStatus.ERROR: "🔴",
        }
        return f"{status_icon[self.status]} {self.name}"

    @property
    def summary(self) -> str:
        """Return a summary of the session."""
        lines = [
            f"Session: {self.name} ({self.id})",
            f"Status: {self.status.value.title()}",
            f"Created: {self.created_at.strftime('%Y-%m-%d %H:%M')}",
            f"Updated: {self.updated_at.strftime('%Y-%m-%d %H:%M')}",
        ]

        if self.workspace_path:
            lines.append(f"Workspace: {self.workspace_path}")

        if self.branch_name:
            lines.append(f"Branch: {self.branch_name}")

        if self.task_description:
            lines.append(f"Task: {self.task_description}")

        if self.progress_notes:
            lines.append("\nProgress Notes:")
            lines.extend(f"  • {note}" for note in self.progress_notes[-5:])

        return "\n".join(lines)


class SessionManager:
    """Manages a collection of AI agent sessions."""

    def __init__(self):
        self.sessions: List[Session] = []
        self._selected_index: int = 0

    def create_session(self, name: str = "", task_description: str = "") -> Session:
        """Create a new session."""
        session = Session(name=name, task_description=task_description)
        self.sessions.append(session)
        self._selected_index = len(self.sessions) - 1
        return session

    def delete_session(self, session_id: str) -> bool:
        """Delete a session by ID."""
        for i, session in enumerate(self.sessions):
            if session.id == session_id:
                del self.sessions[i]
                if self._selected_index >= len(self.sessions) and self.sessions:
                    self._selected_index = len(self.sessions) - 1
                elif not self.sessions:
                    self._selected_index = 0
                return True
        return False

    def get_session(self, session_id: str) -> Optional[Session]:
        """Get a session by ID."""
        for session in self.sessions:
            if session.id == session_id:
                return session
        return None

    @property
    def current_session(self) -> Optional[Session]:
        """Get the currently selected session."""
        if 0 <= self._selected_index < len(self.sessions):
            return self.sessions[self._selected_index]
        return None

    @property
    def selected_index(self) -> int:
        """Get the selected session index."""
        return self._selected_index

    def select_session(self, index: int) -> Optional[Session]:
        """Select a session by index."""
        if 0 <= index < len(self.sessions):
            self._selected_index = index
            return self.sessions[index]
        return None

    def move_selection(self, delta: int) -> Optional[Session]:
        """Move selection up or down by delta."""
        if not self.sessions:
            return None

        new_index = (self._selected_index + delta) % len(self.sessions)
        return self.select_session(new_index)

    def pause_session(self, session_id: str) -> bool:
        """Pause a session."""
        session = self.get_session(session_id)
        if session and session.status == SessionStatus.ACTIVE:
            session.update_status(SessionStatus.PAUSED)
            return True
        return False

    def resume_session(self, session_id: str) -> bool:
        """Resume a paused session."""
        session = self.get_session(session_id)
        if session and session.status == SessionStatus.PAUSED:
            session.update_status(SessionStatus.ACTIVE)
            return True
        return False
