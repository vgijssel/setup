from rich.panel import Panel
from rich.syntax import Syntax
from rich.text import Text
from textual.containers import Vertical
from textual.widgets import Static, TabbedContent, TabPane

from ..models.session import Session


class PreviewPane(TabbedContent):
    """Widget for displaying session details and diffs."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.border_title = "Preview"
        self.current_session: Session | None = None

    def compose(self):
        """Create the tabbed content structure."""
        with TabPane("Preview", id="preview-tab"):
            yield Static("Select a session to view details", id="preview-content")

        with TabPane("Diff", id="diff-tab"):
            yield Static("No changes to display", id="diff-content")

    def update_content(self, session: Session) -> None:
        """Update the preview content with session information."""
        self.current_session = session

        # Update preview tab
        preview_widget = self.query_one("#preview-content", Static)
        preview_text = Text()

        # Session header
        preview_text.append(f"Session: {session.name}\n", style="bold cyan")
        preview_text.append(f"ID: {session.id}\n", style="dim")
        preview_text.append(
            f"Status: {session.status.value.title()}\n",
            style="green" if session.status.value == "active" else "yellow",
        )
        preview_text.append(
            f"Created: {session.created_at.strftime('%Y-%m-%d %H:%M')}\n", style="dim"
        )
        preview_text.append(
            f"Updated: {session.updated_at.strftime('%Y-%m-%d %H:%M')}\n\n", style="dim"
        )

        # Task description
        if session.task_description:
            preview_text.append("Task Description:\n", style="bold")
            preview_text.append(f"{session.task_description}\n\n", style="white")

        # Workspace info
        if session.workspace_path:
            preview_text.append("Workspace:\n", style="bold")
            preview_text.append(f"{session.workspace_path}\n\n", style="cyan")

        if session.branch_name:
            preview_text.append("Branch:\n", style="bold")
            preview_text.append(f"{session.branch_name}\n\n", style="green")

        # Progress notes
        if session.progress_notes:
            preview_text.append("Progress Notes:\n", style="bold")
            for note in session.progress_notes[-10:]:  # Show last 10 notes
                preview_text.append(f"• {note}\n", style="white")

        preview_widget.update(preview_text)

        # Update diff tab (placeholder for now)
        diff_widget = self.query_one("#diff-content", Static)
        diff_text = Text()
        diff_text.append("#### Instance/Session Management\n", style="bold cyan")
        diff_text.append("- ", style="green")
        diff_text.append("n", style="bold green")
        diff_text.append(" - Create a new session with prompt\n", style="green")
        diff_text.append("- ", style="green")
        diff_text.append("N", style="bold green")
        diff_text.append(" - Create a new session with prompt\n", style="green")
        diff_text.append("- ", style="red")
        diff_text.append("d", style="bold red")
        diff_text.append(" - Kill (delete) the selected session\n", style="red")
        diff_text.append("- ", style="white")
        diff_text.append("'r'j", style="bold white")
        diff_text.append(" / ", style="white")
        diff_text.append("'k'", style="bold white")
        diff_text.append(" - Navigate between sessions\n\n", style="white")

        diff_text.append("#### Actions\n", style="bold cyan")
        diff_text.append("- ", style="red")
        diff_text.append("→/o", style="bold red")
        diff_text.append(" - Attach to the selected session to reprompt\n", style="red")
        diff_text.append("- ", style="white")
        diff_text.append("ctrl-q", style="bold white")
        diff_text.append(" - Detach from session\n", style="white")
        diff_text.append("- ", style="white")
        diff_text.append("s", style="bold white")
        diff_text.append(" - Commit and push branch to github\n", style="white")
        diff_text.append("- ", style="red")
        diff_text.append("c", style="bold red")
        diff_text.append(
            " - Checkout commits changes and pauses the session\n", style="red"
        )
        diff_text.append("- ", style="green")
        diff_text.append("→/o", style="bold green")
        diff_text.append(" - Attach to the selected session\n", style="green")
        diff_text.append("- ", style="white")
        diff_text.append("ctrl-q", style="bold white")
        diff_text.append(
            " - Detach from session when attached to a session\n", style="white"
        )
        diff_text.append("- ", style="white")
        diff_text.append("s", style="bold white")
        diff_text.append(
            " - Submit PR (commit and push branch to GitHub)\n", style="white"
        )
        diff_text.append("- ", style="white")
        diff_text.append("r", style="bold white")
        diff_text.append(" - Resume a paused session\n\n", style="white")

        diff_text.append("#### Navigation\n", style="bold cyan")
        diff_text.append("- ", style="white")
        diff_text.append("tab", style="bold white")
        diff_text.append(" - Switch between preview tab and diff tab\n", style="white")
        diff_text.append("- ", style="white")
        diff_text.append("q", style="bold white")
        diff_text.append(" - Quit the application\n", style="white")

        diff_widget.update(diff_text)

    def switch_tab(self) -> None:
        """Switch between preview and diff tabs."""
        current_tab = self.active
        if current_tab == "preview-tab":
            self.active = "diff-tab"
        else:
            self.active = "preview-tab"
