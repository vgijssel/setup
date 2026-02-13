# Collection Puzzle Loading Fix

## Problem Description

Collection-based puzzles (Puzzle 3, 6, 7 on Screens 5, 7, 8) were showing "Puzzel laden..." indefinitely when the Home Assistant entities didn't exist.

### Root Cause

The `useInputBoolean` hook in `src/hooks/useHaEntity.ts` sets `isLoading = true` when `useEntity` returns `null`. For missing entities, `useEntity` returns `null` forever, causing `isLoading` to never become `false`.

The `useCollectionProgress` hook checks if ANY item is loading (`items.some((item) => item.isLoading)`), so if even one entity is missing, the entire puzzle shows the loading state indefinitely.

## Solution

### 1. Added Timeout to `useInputBoolean`

```typescript
export function useInputBoolean(entityId: string) {
  const entity = useEntity(entityId as EntityName, {
    returnNullIfNotFound: true,
  });

  const [hasTimedOut, setHasTimedOut] = useState(false);

  // Add 3-second timeout to prevent infinite loading
  useEffect(() => {
    if (entity === null && !hasTimedOut) {
      const timeout = setTimeout(() => {
        setHasTimedOut(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    if (entity !== null && hasTimedOut) {
      setHasTimedOut(false);
    }
  }, [entity, hasTimedOut]);

  const isLoading = entity === null && !hasTimedOut;
  const notFound = entity === null && hasTimedOut;

  return {
    value: entity?.state === "on",
    isLoading,
    notFound,
    entity,
  };
}
```

### 2. Updated `useCollectionProgress`

Added `hasNotFoundEntities` flag to track when entities are missing:

```typescript
export function useCollectionProgress(entityIds: string[]) {
  const items = entityIds.map((id) => {
    const { value, isLoading, notFound } = useInputBoolean(id);
    return { id, completed: value, isLoading, notFound };
  });

  const hasNotFoundEntities = items.some((item) => item.notFound);

  return {
    items,
    completedCount,
    totalCount,
    progress,
    isComplete,
    isLoading,
    hasNotFoundEntities,
  };
}
```

### 3. Updated `CollectionPuzzle` Component

Added warning message when entities are not found:

```typescript
const showEntityWarning = hasNotFoundEntities;

// In JSX:
{showEntityWarning && (
  <div className="puzzle-warning" data-testid="puzzle-warning">
    <p>
      ⚠️ Sommige Home Assistant entiteiten zijn niet gevonden. De puzzel
      wordt getoond met standaardwaarden.
    </p>
  </div>
)}
```

### 4. Added Warning Styles

Added CSS for the warning message in `src/index.css`:

```css
.puzzle-warning {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
}

.puzzle-warning p {
  margin: 0;
  color: #856404;
  font-size: 0.9rem;
}
```

## Testing

### Regression Tests

Created regression tests in `tests/unit/CollectionPuzzle-regression.test.tsx` and `tests/e2e/collection-puzzle-regression.spec.ts` to document the bug behavior.

### Validation Tests

Created validation tests in `tests/e2e/collection-puzzle-validation.spec.ts` that use the Home Assistant REST API to:

1. Navigate to collection puzzle screens (5, 7, 8)
2. Verify puzzles render without infinite loading
3. Toggle collection item entities
4. Verify UI updates correctly

### Manual Testing with HA REST API

To manually test with Home Assistant REST API:

```bash
# Set HA token
export HA_TOKEN="your_long_lived_access_token"
export HA_URL="http://homeassistant.local:8123"

# Navigate to Screen 5 (Puzzle 3)
curl -X POST "$HA_URL/api/services/input_select/select_option" \
  -H "Authorization: Bearer $HA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_id": "input_select.verjaardag_hilde_global_select",
    "option": "5"
  }'

# Toggle a collection item
curl -X POST "$HA_URL/api/services/input_boolean/turn_on" \
  -H "Authorization: Bearer $HA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_id": "input_boolean.verjaardag_hilde_puzzle_3_item_1"
  }'

# Turn it off
curl -X POST "$HA_URL/api/services/input_boolean/turn_off" \
  -H "Authorization: Bearer $HA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_id": "input_boolean.verjaardag_hilde_puzzle_3_item_1"
  }'
```

### Run Validation Tests

```bash
# Run validation tests with HA token
HA_TOKEN="your_token" HA_URL="http://homeassistant.local:8123" npm run e2e -- collection-puzzle-validation

# Run without HA token (tests will be skipped)
npm run e2e -- collection-puzzle-validation
```

## Expected Behavior

### Before Fix
- Collection puzzles show "Puzzel laden..." indefinitely
- UI never renders if entities don't exist
- No error message or feedback

### After Fix
- Collection puzzles show loading for maximum 3 seconds
- After timeout, puzzle UI renders with default values
- Warning message appears if entities are missing
- Puzzle remains functional (shows 0/N items collected)
- If entities are toggled via HA REST API, UI updates correctly

## Affected Screens

- **Screen 5** (Puzzle 3: The Switches) - 5 collection items
- **Screen 7** (Puzzle 6: Power Usage) - 1 collection item
- **Screen 8** (Puzzle 7: Temperatures) - 5 collection items

## Files Modified

1. `src/hooks/useHaEntity.ts` - Added timeout mechanism
2. `src/components/CollectionPuzzle.tsx` - Added warning display
3. `src/index.css` - Added warning styles
4. `tests/unit/CollectionPuzzle-regression.test.tsx` - Regression tests
5. `tests/e2e/collection-puzzle-regression.spec.ts` - E2E regression tests
6. `tests/e2e/collection-puzzle-validation.spec.ts` - E2E validation tests

## Notes

- The 3-second timeout is configurable in `useInputBoolean`
- The fix gracefully handles both existing and non-existing entities
- UI remains functional even when entities don't exist
- Warning message provides clear feedback to users/developers
