from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical
from textual.widgets import Footer, Header

from .models.session import SessionManager
from .widgets.preview_pane import PreviewPane
from .widgets.session_list import SessionList


class FriendoApp(App):
    """Main TUI application for managing AI agent sessions."""

    CSS_PATH = "app.tcss"
    TITLE = "Friendo - AI Agent Manager"

    BINDINGS = [
        Binding("n", "new_session", "New", show=True),
        Binding("d", "delete_session", "Delete", show=True),
        Binding("p", "pause_resume", "Pause/Resume", show=True),
        Binding("ctrl+q", "detach", "Detach", key_display="^Q"),
        Binding("s", "submit_pr", "Submit PR", show=True),
        Binding("c", "checkout", "Checkout", show=True),
        Binding("t", "switch_tab", "Switch Tab", show=True),
        Binding("q", "quit", "Quit", show=True),
    ]

    def __init__(self):
        super().__init__()
        self.session_manager = SessionManager()
        self.session_list = None
        self.preview_pane = None

    def compose(self) -> ComposeResult:
        """Create the main layout."""
        yield Header()
        with Horizontal(id="main-horizontal"):
            self.session_list = SessionList(self.session_manager)
            yield self.session_list
            self.preview_pane = PreviewPane()
            yield self.preview_pane
        yield Footer()

    def on_mount(self) -> None:
        """Initialize the application on mount."""
        self.session_list.focus()

    def action_new_session(self) -> None:
        """Create a new AI agent session."""
        if self.session_list:
            self.session_list.create_session()

    def action_delete_session(self) -> None:
        """Delete the currently selected session."""
        if self.session_list:
            self.session_list.delete_current_session()

    def action_pause_resume(self) -> None:
        """Pause or resume the currently selected session."""
        current = self.session_manager.current_session
        if current:
            if current.status.value == "active":
                self.session_manager.pause_session(current.id)
                current.add_progress_note("Session paused")
            elif current.status.value == "paused":
                self.session_manager.resume_session(current.id)
                current.add_progress_note("Session resumed")

            # Refresh the display
            if self.session_list:
                self.session_list.refresh_sessions()
            if self.preview_pane:
                self.preview_pane.update_content(current)

    def action_detach(self) -> None:
        """Detach from the current session."""
        pass

    def action_submit_pr(self) -> None:
        """Submit PR for the current session."""
        pass

    def action_checkout(self) -> None:
        """Checkout commits and pause the session."""
        pass

    def action_switch_tab(self) -> None:
        """Switch between preview and diff tabs."""
        if self.preview_pane:
            self.preview_pane.switch_tab()

    def on_session_list_session_selected(self, message) -> None:
        """Handle session selection from the session list."""
        if self.preview_pane:
            self.preview_pane.update_content(message.session)
