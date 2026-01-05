# Testing Guide for Performance Improvements

This guide provides instructions for manually testing the performance improvements made to fix the high CPU/memory usage issue.

## Prerequisites

1. Chrome browser with Developer Mode enabled
2. Access to Chess.com account
3. Chrome DevTools for performance monitoring

## Test Setup

1. Load the extension in Chrome:
   ```
   chrome://extensions/
   Enable "Developer mode"
   Click "Load unpacked"
   Select the Chess-Assistant folder
   ```

2. Open Chrome DevTools:
   - Press F12 or right-click > Inspect
   - Navigate to the "Performance" tab

## Test Cases

### Test 1: Popup Opening Performance

**Objective**: Verify popup opens quickly without high CPU usage

**Steps**:
1. Start Chrome DevTools Performance recording
2. Click the Chess Coach extension icon 10 times rapidly
3. Stop recording
4. Analyze CPU usage and timing

**Expected Results**:
- Popup opens in < 200ms
- CPU usage stays below 30% during opening
- No JavaScript errors in console
- Memory usage remains stable

### Test 2: DOM Observation Efficiency

**Objective**: Verify MutationObserver doesn't cause excessive CPU usage

**Steps**:
1. Navigate to https://chess.com/play/online
2. Open Chrome DevTools Performance tab
3. Start recording
4. Play a quick game (or resign immediately)
5. Stop recording after game ends
6. Check for extension's background activity

**Expected Results**:
- Extension detects game end within 10 seconds
- No continuous high CPU usage spikes
- Debouncing is visible (grouped callbacks, not individual)
- Game analysis completes successfully

### Test 3: Memory Usage with Multiple Games

**Objective**: Verify memory usage stays bounded with many games

**Steps**:
1. Open Chrome DevTools Memory tab
2. Take heap snapshot (Snapshot 1)
3. Play and finish 15 quick games on Chess.com
4. Open the extension popup after each game
5. Take another heap snapshot (Snapshot 2)
6. Compare snapshots

**Expected Results**:
- Memory increase is proportional to games played
- Maximum 30 games stored in memory
- No memory leaks (objects are garbage collected)
- Total extension memory < 20MB

### Test 4: Long Game Analysis

**Objective**: Verify extension handles games with 100+ moves

**Steps**:
1. Find or play a long game (100+ moves) on Chess.com
2. Finish the game
3. Open extension popup
4. Verify analysis appears

**Expected Results**:
- Analysis completes successfully
- All moves up to 250 are analyzed
- No timeout or hang
- Key moments are identified correctly

### Test 5: Rapid Popup Opening/Closing

**Objective**: Verify no race conditions or memory leaks from rapid opening

**Steps**:
1. Open Chrome DevTools Console
2. Rapidly open and close the extension popup 20 times
3. Check for errors or warnings
4. Monitor memory usage

**Expected Results**:
- No JavaScript errors
- No duplicate processing (check via console logs)
- `isLoading` flag prevents race conditions
- Memory returns to baseline after popup closes

### Test 6: Multi-Tab Behavior

**Objective**: Verify extension works correctly with multiple Chess.com tabs

**Steps**:
1. Open 3 tabs of Chess.com games
2. Start a game in each tab
3. Finish games in different tabs
4. Open extension popup

**Expected Results**:
- Only the most recent game is shown
- No conflicts between tabs
- Game detection works in all tabs
- Extension remains responsive

### Test 7: Game History Loading

**Objective**: Verify history loads efficiently

**Steps**:
1. Ensure you have 20+ analyzed games stored
2. Open extension popup
3. Click "View Game History"
4. Measure load time

**Expected Results**:
- History displays within 100ms
- Only 10 most recent games shown
- Clicking a game loads instantly
- No lag or freezing

### Test 8: Background Pattern Analysis

**Objective**: Verify pattern analysis is efficient

**Steps**:
1. Play 25 games with similar mistakes (e.g., early queen development)
2. Finish the 25th game
3. Monitor CPU usage during analysis
4. Open popup to view results

**Expected Results**:
- Analysis completes within 5 seconds
- Only last 20 games are checked for patterns
- Patterns are correctly identified
- No excessive CPU usage

## Performance Metrics to Monitor

### CPU Usage
- **Idle**: < 1% when popup is closed
- **Popup Opening**: < 30% peak, < 1 second duration
- **Game Analysis**: < 50% peak, < 5 seconds duration
- **DOM Observation**: < 5% continuous

### Memory Usage
- **Base Extension**: < 5MB
- **With 30 Games**: < 20MB
- **After Closing Popup**: Returns to base within 30 seconds
- **No Memory Leaks**: Heap size stable over time

### Timing
- **Popup Open**: < 200ms
- **Game Detection**: < 10 seconds after game ends
- **Analysis Completion**: < 5 seconds
- **History Load**: < 100ms

## Chrome DevTools Commands

### Monitor Extension Memory
```javascript
// In Chrome DevTools Console
chrome.storage.local.getBytesInUse(null, (bytes) => {
  console.log('Storage used:', bytes, 'bytes', '(', (bytes/1024/1024).toFixed(2), 'MB)');
});
```

### Check Stored Games Count
```javascript
chrome.storage.local.get(['games'], (result) => {
  console.log('Games stored:', result.games?.length || 0);
  console.log('Data size:', JSON.stringify(result).length, 'characters');
});
```

### Monitor Background Script Activity
```javascript
// Check for running timers/observers
console.log('Active timers:', performance.getEntriesByType('measure'));
```

## Common Issues to Watch For

1. **System Hang**: Should never occur. If it does, check:
   - MutationObserver not falling back to document.body
   - Infinite loops in parsing/analysis
   - Memory exhaustion

2. **High CPU During Idle**: Should not happen. If it does, check:
   - MutationObserver still firing continuously
   - setInterval running too frequently
   - Message listeners processing when popup closed

3. **Memory Growth**: Should plateau at 30 games. If it keeps growing, check:
   - Game limit enforcement (should be 30)
   - Proper cleanup of old games
   - No circular references in stored objects

4. **Popup Not Opening**: If popup freezes, check:
   - Race condition with isLoading flag
   - Synchronous operations blocking UI
   - Large data transfers from background script

## Regression Testing

After any future changes, re-run these tests to ensure performance remains optimal:

1. Test 1 (Popup Opening)
2. Test 2 (DOM Observation)
3. Test 3 (Memory Usage)

These three tests cover the main performance critical paths.

## Success Criteria

All tests should pass with:
- ✅ No system hangs or freezes
- ✅ CPU usage within expected ranges
- ✅ Memory usage bounded and stable
- ✅ No JavaScript errors
- ✅ All functionality working correctly
- ✅ Responsive user interface

## Troubleshooting

If tests fail:

1. Check Chrome console for errors
2. Verify extension is loaded correctly
3. Try reloading the extension
4. Clear extension storage and test again
5. Check Chrome version compatibility
6. Review Performance tab for bottlenecks
