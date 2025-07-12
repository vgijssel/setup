from rich.text import Text
from textual import on
from textual.message import Message
from textual.reactive import reactive
from textual.widgets import ListItem, ListView, Static

from ..models.session import Session, SessionManager


class SessionList(ListView):
    """Widget for displaying and managing AI agent sessions."""

    selected_session: reactive[Session | None] = reactive(None)

    class SessionSelected(Message):
        """Message sent when a session is selected."""

        def __init__(self, session: Session) -> None:
            self.session = session
            super().__init__()

    def __init__(self, session_manager: SessionManager, **kwargs):
        super().__init__(**kwargs)
        self.session_manager = session_manager
        self.border_title = "Sessions"

    def on_mount(self) -> None:
        """Initialize the session list on mount."""
        self.refresh_sessions()

        # Create some demo sessions if none exist
        if not self.session_manager.sessions:
            self.session_manager.create_session(
                "Update README", "Update documentation with current features"
            )
            self.session_manager.create_session(
                "Add unit tests", "Implement comprehensive test coverage"
            )
            self.session_manager.create_session(
                "Resize preview pane", "Implement resizable layout components"
            )
            self.session_manager.create_session(
                "Logging refactor", "Improve logging system performance"
            )
            self.refresh_sessions()

    def refresh_sessions(self) -> None:
        """Refresh the session list display."""
        self.clear()

        for i, session in enumerate(self.session_manager.sessions):
            # Create rich text for the session display
            text = Text()

            # Add status indicator
            status_colors = {
                "active": "green",
                "paused": "yellow",
                "completed": "blue",
                "error": "red",
            }

            status_icons = {
                "active": "●",
                "paused": "⏸",
                "completed": "✓",
                "error": "✗",
            }

            status_color = status_colors.get(session.status.value, "white")
            status_icon = status_icons.get(session.status.value, "●")

            text.append(f"{status_icon} ", style=status_color)
            text.append(session.name, style="bold")

            # Add task description if available
            if session.task_description:
                text.append(
                    f"\n  {session.task_description[:50]}{'...' if len(session.task_description) > 50 else ''}",
                    style="dim",
                )

            # Add timing info
            time_str = session.updated_at.strftime("%H:%M")
            text.append(f"\n  {time_str} • {session.id}", style="dim")

            item = ListItem(Static(text))
            item.session = session
            self.append(item)

        # Select the current session if available
        if self.session_manager.current_session and self.session_manager.sessions:
            self.index = self.session_manager.selected_index

    def create_session(self) -> None:
        """Create a new session."""
        session = self.session_manager.create_session(
            name=f"New Session", task_description="Describe your task here..."
        )
        self.refresh_sessions()
        self.index = len(self.session_manager.sessions) - 1
        self.post_message(self.SessionSelected(session))

    def delete_current_session(self) -> None:
        """Delete the currently selected session."""
        if self.session_manager.current_session:
            session_id = self.session_manager.current_session.id
            if self.session_manager.delete_session(session_id):
                self.refresh_sessions()
                if self.session_manager.current_session:
                    self.post_message(
                        self.SessionSelected(self.session_manager.current_session)
                    )

    @on(ListView.Selected)
    def on_session_selected(self, event: ListView.Selected) -> None:
        """Handle session selection."""
        if hasattr(event.item, "session"):
            session = event.item.session
            self.session_manager.select_session(event.list_view.index)
            self.selected_session = session
            self.post_message(self.SessionSelected(session))
