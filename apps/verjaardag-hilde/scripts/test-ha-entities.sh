#!/bin/bash
#
# Test script for Verjaardag Hilde Home Assistant entities
# Usage: ./scripts/test-ha-entities.sh
#
# Requires: HA_TOKEN environment variable set with a valid Home Assistant token
#

set -e

HA_URL="${VITE_HA_URL:-http://192.168.1.32:8123}"
HA_TOKEN="${VITE_HA_TOKEN:-$HA_TOKEN}"

if [ -z "$HA_TOKEN" ]; then
    echo "Error: HA_TOKEN or VITE_HA_TOKEN environment variable must be set"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Verjaardag Hilde - HA Entity Test Script"
echo "========================================"
echo "HA URL: $HA_URL"
echo ""

# Function to get entity state
get_state() {
    local entity_id=$1
    curl -s -X GET \
        -H "Authorization: Bearer $HA_TOKEN" \
        -H "Content-Type: application/json" \
        "$HA_URL/api/states/$entity_id" | jq -r '.state // "NOT_FOUND"'
}

# Function to set input_select option
set_select() {
    local entity_id=$1
    local option=$2
    curl -s -X POST \
        -H "Authorization: Bearer $HA_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"entity_id\": \"$entity_id\", \"option\": \"$option\"}" \
        "$HA_URL/api/services/input_select/select_option" > /dev/null
}

# Function to set input_boolean
set_boolean() {
    local entity_id=$1
    local action=$2  # turn_on or turn_off
    curl -s -X POST \
        -H "Authorization: Bearer $HA_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"entity_id\": \"$entity_id\"}" \
        "$HA_URL/api/services/input_boolean/$action" > /dev/null
}

# Test function
test_entity() {
    local entity_id=$1
    local expected=$2
    local actual=$(get_state "$entity_id")

    if [ "$actual" == "NOT_FOUND" ]; then
        echo -e "${RED}FAIL${NC}: $entity_id - Entity not found"
        return 1
    elif [ "$actual" == "$expected" ]; then
        echo -e "${GREEN}PASS${NC}: $entity_id = $actual"
        return 0
    else
        echo -e "${YELLOW}WARN${NC}: $entity_id = $actual (expected: $expected)"
        return 0
    fi
}

echo "1. Testing Global Select Entity..."
echo "-----------------------------------"
test_entity "input_select.verjaardag_hilde_global_select" "1"

echo ""
echo "2. Testing Progress Puzzle Selects..."
echo "--------------------------------------"
test_entity "input_select.verjaardag_hilde_puzzle_1_select" "0"
test_entity "input_select.verjaardag_hilde_puzzle_2_select" "0"
test_entity "input_select.verjaardag_hilde_puzzle_5_select" "0"
test_entity "input_select.verjaardag_hilde_puzzle_8_select" "0"

echo ""
echo "3. Testing Collection Puzzle Booleans..."
echo "-----------------------------------------"
# Puzzle 3
for i in 1 2 3 4 5; do
    test_entity "input_boolean.verjaardag_hilde_puzzle_3_item_$i" "off"
done

# Puzzle 4
for i in 1 2 3; do
    test_entity "input_boolean.verjaardag_hilde_puzzle_4_item_$i" "off"
done

# Puzzle 6
test_entity "input_boolean.verjaardag_hilde_puzzle_6_item_1" "off"

# Puzzle 7
for i in 1 2 3 4 5; do
    test_entity "input_boolean.verjaardag_hilde_puzzle_7_item_$i" "off"
done

echo ""
echo "4. Testing State Changes..."
echo "---------------------------"

# Test global select change
echo "Setting global_select to 5..."
set_select "input_select.verjaardag_hilde_global_select" "5"
sleep 1
test_entity "input_select.verjaardag_hilde_global_select" "5"

# Test puzzle 1 progress
echo "Setting puzzle_1_select to 3..."
set_select "input_select.verjaardag_hilde_puzzle_1_select" "3"
sleep 1
test_entity "input_select.verjaardag_hilde_puzzle_1_select" "3"

# Test boolean toggle
echo "Turning on puzzle_3_item_1..."
set_boolean "input_boolean.verjaardag_hilde_puzzle_3_item_1" "turn_on"
sleep 1
test_entity "input_boolean.verjaardag_hilde_puzzle_3_item_1" "on"

echo ""
echo "5. Testing Reset Automation..."
echo "------------------------------"
echo "Triggering reset..."
set_boolean "input_boolean.verjaardag_hilde_reset_trigger" "turn_on"
sleep 2

# Verify reset worked
test_entity "input_select.verjaardag_hilde_global_select" "1"
test_entity "input_select.verjaardag_hilde_puzzle_1_select" "0"
test_entity "input_boolean.verjaardag_hilde_puzzle_3_item_1" "off"
test_entity "input_boolean.verjaardag_hilde_reset_trigger" "off"

echo ""
echo "========================================"
echo "Test complete!"
echo "========================================"
