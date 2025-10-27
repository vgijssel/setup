"""Tests for the escaperoom Streamlit application."""


def test_app_exists():
    """Test that the app.py file exists and can be imported."""
    import sys
    from pathlib import Path

    # Add the app directory to the path
    app_dir = Path(__file__).parent.parent
    sys.path.insert(0, str(app_dir))

    # This is a basic smoke test - just verify the file exists
    assert (app_dir / "app.py").exists()


def test_pages_exist():
    """Test that the page files exist."""
    from pathlib import Path

    app_dir = Path(__file__).parent.parent
    pages_dir = app_dir / "pages"

    assert pages_dir.exists()
    assert (pages_dir / "1_order.py").exists()
    assert (pages_dir / "2_instruction.py").exists()


def test_instruction_page_turns():
    """Test that the turns list in instruction page is valid."""
    from pathlib import Path

    app_dir = Path(__file__).parent.parent
    instruction_file = app_dir / "pages" / "2_instruction.py"

    # Read the file and extract the turns list
    content = instruction_file.read_text()

    # Verify the turns list is defined
    assert "turns = [" in content

    # Verify there are turn descriptions
    assert "Blauw begint" in content
    assert "Geel gooit" in content


def test_requirements_file_exists():
    """Test that requirements.txt exists."""
    from pathlib import Path

    app_dir = Path(__file__).parent.parent
    assert (app_dir / "requirements.txt").exists()


def test_dockerfile_exists():
    """Test that Dockerfile exists."""
    from pathlib import Path

    app_dir = Path(__file__).parent.parent
    assert (app_dir / "Dockerfile").exists()
