"""Tests for widget components."""

import pytest
from friendo.models.session import Session, SessionManager
from friendo.widgets.preview_pane import PreviewPane
from friendo.widgets.session_list import SessionList
from textual.app import App, ComposeResult
from textual.testing import AppHarness


class TestSessionListApp(App):
    """Test app for SessionList widget."""

    def __init__(self):
        super().__init__()
        self.session_manager = SessionManager()

    def compose(self) -> ComposeResult:
        yield SessionList(self.session_manager)


class TestPreviewPaneApp(App):
    """Test app for PreviewPane widget."""

    def compose(self) -> ComposeResult:
        yield PreviewPane()


class TestSessionList:
    """Test cases for SessionList widget."""

    @pytest.fixture
    def session_list_harness(self):
        """Create a harness for testing SessionList."""
        app = TestSessionListApp()
        return AppHarness(app)

    def test_session_list_composition(self, session_list_harness):
        """Test SessionList widget composition."""
        with session_list_harness as pilot:
            session_list = pilot.app.query_one("SessionList")
            assert session_list is not None
            assert session_list.border_title == "Sessions"

    def test_demo_sessions_created(self, session_list_harness):
        """Test that demo sessions are created on mount."""
        with session_list_harness as pilot:
            # Demo sessions should be created automatically
            assert len(pilot.app.session_manager.sessions) == 4

            session_names = [s.name for s in pilot.app.session_manager.sessions]
            assert "Update README" in session_names
            assert "Add unit tests" in session_names
            assert "Resize preview pane" in session_names
            assert "Logging refactor" in session_names

    def test_create_session(self, session_list_harness):
        """Test creating a new session."""
        with session_list_harness as pilot:
            session_list = pilot.app.query_one("SessionList")
            initial_count = len(pilot.app.session_manager.sessions)

            session_list.create_session()

            assert len(pilot.app.session_manager.sessions) == initial_count + 1
            new_session = pilot.app.session_manager.current_session
            assert new_session.name == "New Session"

    def test_delete_session(self, session_list_harness):
        """Test deleting a session."""
        with session_list_harness as pilot:
            session_list = pilot.app.query_one("SessionList")
            initial_count = len(pilot.app.session_manager.sessions)

            session_list.delete_current_session()

            # Should have one less session
            assert len(pilot.app.session_manager.sessions) == initial_count - 1

    def test_refresh_sessions(self, session_list_harness):
        """Test refreshing the session list display."""
        with session_list_harness as pilot:
            session_list = pilot.app.query_one("SessionList")

            # Add a session directly to manager
            pilot.app.session_manager.create_session("Direct Session")

            # Refresh should update the display
            session_list.refresh_sessions()

            # Should have the new session in the list
            assert len(pilot.app.session_manager.sessions) == 5  # 4 demo + 1 new


class TestPreviewPane:
    """Test cases for PreviewPane widget."""

    @pytest.fixture
    def preview_pane_harness(self):
        """Create a harness for testing PreviewPane."""
        app = TestPreviewPaneApp()
        return AppHarness(app)

    def test_preview_pane_composition(self, preview_pane_harness):
        """Test PreviewPane widget composition."""
        with preview_pane_harness as pilot:
            preview_pane = pilot.app.query_one("PreviewPane")
            assert preview_pane is not None
            assert preview_pane.border_title == "Preview"

    def test_initial_content(self, preview_pane_harness):
        """Test initial preview pane content."""
        with preview_pane_harness as pilot:
            preview_content = pilot.app.query_one("#preview-content")
            diff_content = pilot.app.query_one("#diff-content")

            assert "Select a session to view details" in str(preview_content.renderable)
            assert "No changes to display" in str(diff_content.renderable)

    def test_update_content(self, preview_pane_harness):
        """Test updating preview content with session data."""
        with preview_pane_harness as pilot:
            preview_pane = pilot.app.query_one("PreviewPane")

            # Create a test session
            session = Session(
                name="Test Session", task_description="Test task description"
            )
            session.add_progress_note("Test progress note")

            # Update content
            preview_pane.update_content(session)

            # Check that content was updated
            preview_content = pilot.app.query_one("#preview-content")
            content_text = str(preview_content.renderable)

            assert "Test Session" in content_text
            assert "Test task description" in content_text
            assert "Test progress note" in content_text

    def test_switch_tab(self, preview_pane_harness):
        """Test switching between preview tabs."""
        with preview_pane_harness as pilot:
            preview_pane = pilot.app.query_one("PreviewPane")

            # Should start on preview tab
            initial_tab = preview_pane.active

            # Switch tab
            preview_pane.switch_tab()

            # Should be on different tab
            assert preview_pane.active != initial_tab

            # Switch back
            preview_pane.switch_tab()

            # Should be back to original tab
            assert preview_pane.active == initial_tab
