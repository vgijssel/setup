"""Tests for session models."""

from datetime import datetime
from pathlib import Path

import pytest
from friendo.models.session import Session, SessionManager, SessionStatus


class TestSession:
    """Test cases for the Session class."""

    def test_session_creation_with_defaults(self):
        """Test creating a session with default values."""
        session = Session()

        assert len(session.id) == 8
        assert session.name == f"session-{session.id}"
        assert session.status == SessionStatus.ACTIVE
        assert session.branch_name == f"friendo/{session.id}"
        assert isinstance(session.created_at, datetime)
        assert isinstance(session.updated_at, datetime)
        assert session.workspace_path is None
        assert session.task_description == ""
        assert session.progress_notes == []

    def test_session_creation_with_custom_values(self):
        """Test creating a session with custom values."""
        session = Session(
            name="Test Session",
            task_description="Test task",
            workspace_path=Path("/test/path"),
        )

        assert session.name == "Test Session"
        assert session.task_description == "Test task"
        assert session.workspace_path == Path("/test/path")
        assert session.branch_name == f"friendo/{session.id}"

    def test_update_status(self):
        """Test updating session status."""
        session = Session()
        original_time = session.updated_at

        session.update_status(SessionStatus.PAUSED)

        assert session.status == SessionStatus.PAUSED
        assert session.updated_at > original_time

    def test_add_progress_note(self):
        """Test adding progress notes."""
        session = Session()
        original_time = session.updated_at

        session.add_progress_note("Test note")

        assert len(session.progress_notes) == 1
        assert "Test note" in session.progress_notes[0]
        assert session.updated_at > original_time

    def test_display_name(self):
        """Test display name generation."""
        session = Session(name="Test Session")

        display_name = session.display_name
        assert "Test Session" in display_name
        assert "🟢" in display_name  # Active status icon

    def test_summary(self):
        """Test session summary generation."""
        session = Session(
            name="Test Session",
            task_description="Test task",
            workspace_path=Path("/test/path"),
        )
        session.add_progress_note("Test note")

        summary = session.summary

        assert "Test Session" in summary
        assert "Test task" in summary
        assert "/test/path" in summary
        assert "Test note" in summary


class TestSessionManager:
    """Test cases for the SessionManager class."""

    def test_create_session(self):
        """Test creating a new session."""
        manager = SessionManager()

        session = manager.create_session("Test Session", "Test task")

        assert len(manager.sessions) == 1
        assert session.name == "Test Session"
        assert session.task_description == "Test task"
        assert manager.current_session == session

    def test_delete_session(self):
        """Test deleting a session."""
        manager = SessionManager()
        session = manager.create_session("Test Session")

        result = manager.delete_session(session.id)

        assert result is True
        assert len(manager.sessions) == 0
        assert manager.current_session is None

    def test_delete_nonexistent_session(self):
        """Test deleting a non-existent session."""
        manager = SessionManager()

        result = manager.delete_session("nonexistent-id")

        assert result is False

    def test_get_session(self):
        """Test getting a session by ID."""
        manager = SessionManager()
        session = manager.create_session("Test Session")

        retrieved = manager.get_session(session.id)

        assert retrieved == session

    def test_get_nonexistent_session(self):
        """Test getting a non-existent session."""
        manager = SessionManager()

        result = manager.get_session("nonexistent-id")

        assert result is None

    def test_select_session(self):
        """Test selecting a session by index."""
        manager = SessionManager()
        session1 = manager.create_session("Session 1")
        session2 = manager.create_session("Session 2")

        selected = manager.select_session(0)

        assert selected == session1
        assert manager.current_session == session1

    def test_move_selection(self):
        """Test moving selection up and down."""
        manager = SessionManager()
        manager.create_session("Session 1")
        manager.create_session("Session 2")
        manager.create_session("Session 3")

        # Should start at last created (index 2)
        assert manager.selected_index == 2

        # Move up (wraps to bottom)
        selected = manager.move_selection(1)
        assert manager.selected_index == 0

        # Move down
        selected = manager.move_selection(-1)
        assert manager.selected_index == 2

    def test_pause_resume_session(self):
        """Test pausing and resuming sessions."""
        manager = SessionManager()
        session = manager.create_session("Test Session")

        # Pause active session
        result = manager.pause_session(session.id)
        assert result is True
        assert session.status == SessionStatus.PAUSED

        # Resume paused session
        result = manager.resume_session(session.id)
        assert result is True
        assert session.status == SessionStatus.ACTIVE

        # Try to pause already active session after resuming
        result = manager.pause_session(session.id)
        assert result is True
        assert session.status == SessionStatus.PAUSED
