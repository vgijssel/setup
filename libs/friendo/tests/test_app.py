"""Tests for the main application."""

import pytest
from friendo.app import FriendoApp
from friendo.models.session import SessionStatus
from textual.testing import AppHarness


class TestFriendoApp:
    """Test cases for the main FriendoApp."""

    @pytest.fixture
    def app_harness(self):
        """Create an app harness for testing."""
        app = FriendoApp()
        return AppHarness(app)

    def test_app_composition(self, app_harness):
        """Test that the app composes correctly."""
        with app_harness as pilot:
            # Check that main components are present
            assert pilot.app.query_one("SessionList")
            assert pilot.app.query_one("PreviewPane")
            assert pilot.app.query_one("Header")
            assert pilot.app.query_one("Footer")

    def test_create_new_session(self, app_harness):
        """Test creating a new session via keyboard shortcut."""
        with app_harness as pilot:
            initial_count = len(pilot.app.session_manager.sessions)

            # Press 'n' to create new session
            pilot.press("n")

            # Should have one more session
            assert len(pilot.app.session_manager.sessions) == initial_count + 1

            # New session should be selected
            new_session = pilot.app.session_manager.current_session
            assert new_session is not None
            assert new_session.name == "New Session"

    def test_delete_session(self, app_harness):
        """Test deleting a session via keyboard shortcut."""
        with app_harness as pilot:
            # Create a session first
            pilot.press("n")
            initial_count = len(pilot.app.session_manager.sessions)

            # Press 'd' to delete current session
            pilot.press("d")

            # Should have one less session
            assert len(pilot.app.session_manager.sessions) == initial_count - 1

    def test_pause_resume_session(self, app_harness):
        """Test pausing and resuming a session."""
        with app_harness as pilot:
            # Create a session first
            pilot.press("n")
            session = pilot.app.session_manager.current_session

            # Should start as active
            assert session.status == SessionStatus.ACTIVE

            # Press 'p' to pause
            pilot.press("p")
            assert session.status == SessionStatus.PAUSED

            # Press 'p' again to resume
            pilot.press("p")
            assert session.status == SessionStatus.ACTIVE

    def test_switch_preview_tabs(self, app_harness):
        """Test switching between preview tabs."""
        with app_harness as pilot:
            preview_pane = pilot.app.query_one("PreviewPane")

            # Should start on preview tab
            initial_tab = preview_pane.active

            # Press tab to switch
            pilot.press("tab")

            # Should be on different tab
            assert preview_pane.active != initial_tab

    def test_keyboard_shortcuts_binding(self, app_harness):
        """Test that all keyboard shortcuts are properly bound."""
        with app_harness as pilot:
            app = pilot.app

            # Check that all expected bindings exist
            binding_keys = [binding.key for binding in app.BINDINGS]

            expected_keys = ["n", "d", "p", "ctrl+q", "s", "c", "tab", "q"]
            for key in expected_keys:
                assert key in binding_keys
