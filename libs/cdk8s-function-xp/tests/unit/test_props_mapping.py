"""Test props mapping from Crossplane composite spec to cdk8s props."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from function import map_spec_to_props  # noqa: E402


def test_map_simple_spec():
    """Test mapping simple spec fields to props."""
    spec = {
        "domain": "internal.example.com",
        "storageSize": "1Gi",
    }

    props = map_spec_to_props(spec)

    assert props["domain"] == "internal.example.com"
    assert props["storage_size"] == "1Gi"  # camelCase to snake_case


def test_map_all_spec_fields():
    """Test mapping all InternalDNS spec fields."""
    spec = {
        "domain": "internal.test.com",
        "storageSize": "2Gi",
        "externalDnsVersion": "v0.14.0",
        "powerdnsVersion": "powerdns/pdns-auth-50",
        "syncInterval": "60s",
    }

    props = map_spec_to_props(spec)

    assert props["domain"] == "internal.test.com"
    assert props["storage_size"] == "2Gi"
    assert props["external_dns_version"] == "v0.14.0"
    assert props["powerdns_version"] == "powerdns/pdns-auth-50"
    assert props["sync_interval"] == "60s"


def test_camel_to_snake_case():
    """Test camelCase to snake_case conversion."""
    spec = {
        "simpleField": "value",
        "anotherCamelCase": "test",
        "multipleWordsHere": "example",
    }

    props = map_spec_to_props(spec)

    assert "simple_field" in props
    assert "another_camel_case" in props
    assert "multiple_words_here" in props


def test_preserve_already_snake_case():
    """Test that snake_case fields are preserved."""
    spec = {
        "already_snake": "value",
        "another_one": "test",
    }

    props = map_spec_to_props(spec)

    assert props["already_snake"] == "value"
    assert props["another_one"] == "test"


def test_nested_objects():
    """Test mapping nested objects."""
    spec = {
        "simpleField": "value",
        "nestedObject": {
            "innerField": "inner_value",
            "anotherInner": "test",
        },
    }

    props = map_spec_to_props(spec)

    assert props["simple_field"] == "value"
    assert isinstance(props["nested_object"], dict)
    assert props["nested_object"]["inner_field"] == "inner_value"


def test_lists_preserved():
    """Test that lists are preserved in mapping."""
    spec = {
        "stringList": ["item1", "item2", "item3"],
        "numberList": [1, 2, 3],
    }

    props = map_spec_to_props(spec)

    assert props["string_list"] == ["item1", "item2", "item3"]
    assert props["number_list"] == [1, 2, 3]


def test_empty_spec():
    """Test mapping empty spec."""
    props = map_spec_to_props({})
    assert props == {}


def test_none_values_preserved():
    """Test that None values are preserved."""
    spec = {
        "field1": "value",
        "field2": None,
    }

    props = map_spec_to_props(spec)

    assert props["field1"] == "value"
    assert props["field2"] is None


def test_boolean_values():
    """Test boolean values are preserved."""
    spec = {
        "enabled": True,
        "disabled": False,
    }

    props = map_spec_to_props(spec)

    assert props["enabled"] is True
    assert props["disabled"] is False


def test_numeric_values():
    """Test numeric values are preserved."""
    spec = {
        "port": 53,
        "replicas": 1,
        "timeout": 30.5,
    }

    props = map_spec_to_props(spec)

    assert props["port"] == 53
    assert props["replicas"] == 1
    assert props["timeout"] == 30.5
