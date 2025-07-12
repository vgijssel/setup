"""Tests for the main application."""

import pytest
from friendo.app import FriendoApp
from friendo.models.session import SessionStatus


class TestFriendoApp:
    """Test cases for the main FriendoApp."""

    @pytest.mark.asyncio
    async def test_app_composition(self):
        """Test that the app composes correctly."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            # Check that main components are present
            assert pilot.app.query_one("SessionList")
            assert pilot.app.query_one("PreviewPane")
            assert pilot.app.query_one("Header")
            assert pilot.app.query_one("Footer")

    @pytest.mark.asyncio
    async def test_create_new_session(self):
        """Test creating a new session via keyboard shortcut."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            initial_count = len(pilot.app.session_manager.sessions)

            # Press 'n' to create new session
            await pilot.press("n")

            # Should have one more session
            assert len(pilot.app.session_manager.sessions) == initial_count + 1

            # New session should be selected
            new_session = pilot.app.session_manager.current_session
            assert new_session is not None
            assert new_session.name == "New Session"

    @pytest.mark.asyncio
    async def test_delete_session(self):
        """Test deleting a session via keyboard shortcut."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            # Create a session first
            await pilot.press("n")
            initial_count = len(pilot.app.session_manager.sessions)

            # Press 'd' to delete current session
            await pilot.press("d")

            # Should have one less session
            assert len(pilot.app.session_manager.sessions) == initial_count - 1

    @pytest.mark.asyncio
    async def test_pause_resume_session(self):
        """Test pausing and resuming a session."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            # Create a session first
            await pilot.press("n")
            session = pilot.app.session_manager.current_session

            # Should start as active
            assert session.status == SessionStatus.ACTIVE

            # Press 'p' to pause
            await pilot.press("p")
            assert session.status == SessionStatus.PAUSED

            # Press 'p' again to resume
            await pilot.press("p")
            assert session.status == SessionStatus.ACTIVE

    @pytest.mark.asyncio
    async def test_switch_preview_tabs(self):
        """Test switching between preview tabs."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            preview_pane = pilot.app.query_one("PreviewPane")

            # Should start on preview tab
            initial_tab = preview_pane.active
            assert initial_tab == "preview-tab"  # Confirm initial state

            # Test key binding with 't' key (changed from tab to avoid conflicts)
            await pilot.press("t")
            assert preview_pane.active == "diff-tab"  # Should switch to diff tab

            # Test switch back
            await pilot.press("t")
            assert preview_pane.active == "preview-tab"  # Should switch back

    @pytest.mark.asyncio
    async def test_keyboard_shortcuts_binding(self):
        """Test that all keyboard shortcuts are properly bound."""
        app = FriendoApp()
        async with app.run_test() as pilot:
            app = pilot.app

            # Check that all expected bindings exist
            binding_keys = [binding.key for binding in app.BINDINGS]

            expected_keys = ["n", "d", "p", "ctrl+q", "s", "c", "t", "q"]
            for key in expected_keys:
                assert key in binding_keys
