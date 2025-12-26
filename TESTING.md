# Manual Testing Guide

This guide helps you manually test the Chess.com Game Review Assistant extension after installation.

## Pre-Testing Checklist

Before you begin testing:

- [ ] Extension loaded in Chrome without errors
- [ ] Extension icon visible in toolbar
- [ ] Chrome DevTools open (F12) for debugging
- [ ] Chess.com account ready
- [ ] 10-15 minutes available for testing

## Test 1: Extension Installation ✅

### Steps:
1. Open Chrome and go to `chrome://extensions/`
2. Verify "Chess.com Game Review Assistant" is listed
3. Verify it shows "Enabled" status
4. Click "Details" and verify permissions

### Expected Results:
- ✅ Extension shows in list
- ✅ Status is "Enabled"
- ✅ Permissions include "storage", "activeTab", "scripting"
- ✅ Host permissions include "https://www.chess.com/*"

### Troubleshooting:
- ❌ Extension not listed → Reload extension folder
- ❌ Errors shown → Check console, verify all files present

## Test 2: Content Script Loading ✅

### Steps:
1. Open Chess.com in a new tab
2. Open DevTools (F12) → Console tab
3. Look for message: "Chess Coach: Content script loaded"

### Expected Results:
- ✅ Console shows "Chess Coach: Content script loaded"
- ✅ Console shows "Chess Coach: Initializing..."
- ✅ No error messages in console

### Troubleshooting:
- ❌ Message not appearing → Refresh page
- ❌ Errors in console → Check content.js syntax
- ❌ Permission errors → Verify manifest.json permissions

## Test 3: Popup Before Game ✅

### Steps:
1. On Chess.com, click the Chess Coach extension icon
2. Observe the popup content

### Expected Results:
- ✅ Popup opens successfully
- ✅ Shows "Waiting for a game to finish on Chess.com..."
- ✅ UI displays correctly with purple gradient
- ✅ "View Game History" button visible

### Troubleshooting:
- ❌ Popup doesn't open → Check popup.html/js/css exist
- ❌ UI broken → Check popup.css loaded
- ❌ Errors → Check popup console (right-click icon → Inspect popup)

## Test 4: Play a Quick Game ✅

### Steps:
1. On Chess.com, start a game:
   - Option A: Play Computer (easiest for testing)
   - Option B: Play Online (3+0 Blitz recommended)
2. Play the game to completion (win, lose, or resign)
3. Verify game-over modal appears on Chess.com
4. Keep DevTools console open

### Expected Results During Game:
- ✅ No errors in console
- ✅ Extension doesn't interfere with gameplay

### Expected Results After Game:
- ✅ Console shows "Chess Coach: Game over detected!"
- ✅ Console shows "Chess Coach: Extracted game data"
- ✅ Console shows "Chess Coach: Processing game data..."
- ✅ Browser notification appears: "♟️ Game analysis ready!"
- ✅ Extension icon shows green badge with "1"

### Troubleshooting:
- ❌ No detection → Verify game-over modal appeared
- ❌ No extraction → Check Chess.com UI hasn't changed
- ❌ No notification → Check notification permissions

## Test 5: View Analysis ✅

### Steps:
1. After game ends and notification appears
2. Click the Chess Coach extension icon
3. Review all sections of the analysis

### Expected Results:
- ✅ Popup shows analysis (not "Waiting for game...")
- ✅ Game Summary section displays:
  - Your color (White or Black)
  - Time control
  - Result (Win/Loss/Draw)
  - Date and time
- ✅ Coach's Analysis section shows:
  - Opening assessment
  - Middlegame evaluation (if game long enough)
  - Overall assessment
  - Strengths list
  - Weaknesses list
- ✅ Key Moments section shows:
  - Critical moves (if any mistakes made)
  - Explanation for each
  - Better plan suggestion
  - FEN position (if available)
- ✅ Recurring Patterns section shows:
  - "No recurring patterns detected yet" (first game)
- ✅ Focus Areas section shows:
  - 1-3 numbered priorities
  - Actionable advice for each
- ✅ Badge clears from icon

### Troubleshooting:
- ❌ Still shows "Waiting..." → Check background.js processed game
- ❌ Missing sections → Check popup.js display functions
- ❌ No data → Check storage: chrome://extensions/ → Storage

## Test 6: Game History ✅

### Steps:
1. In the popup, click "View Game History" button
2. Verify your game appears in history
3. Click on the historical game

### Expected Results:
- ✅ History list appears
- ✅ Shows recent game with:
  - Date
  - Time control
  - Result (colored: green=win, red=loss, gray=draw)
  - Number of key moments
- ✅ Clicking game loads its full analysis
- ✅ Button changes to "Hide History"

### Troubleshooting:
- ❌ History empty → Check Chrome storage has data
- ❌ Can't click games → Check event listeners in popup.js

## Test 7: Multiple Games Pattern Detection ✅

### Steps:
1. Play 2-3 more games on Chess.com
2. Try to make different types of moves:
   - Develop queen early (Qh5 in opening)
   - Castle late (after move 12)
   - Move same piece twice in opening
3. After each game, check analysis

### Expected Results (After 3+ Games):
- ✅ Recurring Patterns section shows patterns like:
  - "Early Queen Development (2x)" if you did it multiple times
  - "Delayed Castling (2x)" if you castled late multiple times
- ✅ Pattern descriptions explain the issue
- ✅ Pattern fixes give specific advice
- ✅ Focus areas prioritize most common patterns

### Troubleshooting:
- ❌ Patterns not detected → Play more games
- ❌ Pattern count wrong → Check pattern tracking logic

## Test 8: Browser Compatibility ✅

### Steps:
1. Test in different Chromium browsers (if available):
   - Google Chrome
   - Microsoft Edge
   - Brave
   - Opera

### Expected Results:
- ✅ Extension loads in each browser
- ✅ All features work identically
- ✅ No browser-specific errors

## Test 9: Error Handling ✅

### Steps:
Test edge cases to verify robust error handling:

1. **Test A: Close popup during analysis**
   - Start game, end it, immediately close popup
   - Reopen popup
   - Expected: Analysis appears correctly

2. **Test B: Multiple tabs**
   - Open Chess.com in 2 tabs
   - Finish game in one tab
   - Expected: Only one analysis triggered

3. **Test C: Page refresh**
   - During active game, refresh page
   - Expected: No errors, game tracking continues

### Expected Results:
- ✅ No crashes or freezes
- ✅ Graceful error messages if any
- ✅ Data not corrupted

## Test 10: Performance ✅

### Steps:
1. Check extension performance:
   - Open Task Manager (Shift+Esc in Chrome)
   - Find "Chess.com Game Review Assistant"
   - Play a game and analyze

### Expected Results:
- ✅ Memory usage < 50 MB
- ✅ CPU usage minimal (< 5% during analysis)
- ✅ Analysis completes in < 2 seconds
- ✅ No page slowdown

## Test 11: Data Persistence ✅

### Steps:
1. Analyze 2-3 games
2. Close Chrome completely
3. Reopen Chrome
4. Open extension popup

### Expected Results:
- ✅ Game history still shows all games
- ✅ Latest analysis still accessible
- ✅ Pattern tracking maintained

## Test 12: Privacy Verification ✅

### Steps:
1. Open Chrome DevTools → Network tab
2. Play and analyze a game
3. Monitor network requests

### Expected Results:
- ✅ No external API calls made by extension
- ✅ No data sent to external servers
- ✅ All processing happens locally

## Common Issues and Solutions

### Issue: "Game not detected"
**Solution:**
- Verify game-over modal appeared
- Check console for detection messages
- Try playing another game
- Refresh Chess.com page

### Issue: "Analysis shows wrong color"
**Solution:**
- Check board orientation detection
- Verify you're playing (not watching)
- Report bug with specifics

### Issue: "PGN extraction pending"
**Solution:**
- Wait a few seconds
- Refresh popup
- Check move list is visible on page

### Issue: "No patterns detected"
**Solution:**
- Play at least 3 games
- Make the same mistake multiple times
- Patterns need 2+ occurrences to show

### Issue: "Extension icon not visible"
**Solution:**
- Click puzzle piece icon in toolbar
- Pin the Chess Coach extension
- Check extension is enabled

## Testing Checklist Summary

Before reporting extension as working:

- [ ] Extension loads without errors
- [ ] Content script loads on Chess.com
- [ ] Popup displays before game
- [ ] Game detection works
- [ ] Data extraction works (PGN, color, time, result)
- [ ] Analysis generates correctly
- [ ] All popup sections display
- [ ] Game history works
- [ ] Pattern detection works (3+ games)
- [ ] Notifications appear
- [ ] Badge indicator works
- [ ] Error handling works
- [ ] Performance is acceptable
- [ ] Data persists across sessions
- [ ] No external network calls

## Reporting Issues

If you find bugs during testing:

1. **Gather Information:**
   - Browser version
   - Extension version (1.0.0)
   - What you were doing
   - Console errors (if any)
   - Expected vs actual behavior

2. **Check Existing Issues:**
   - Look at GitHub issues
   - See if already reported

3. **Create Issue:**
   - Clear title
   - Reproduction steps
   - Screenshots (if relevant)
   - Console logs

## Success Criteria

Extension passes testing if:

✅ All core features work  
✅ No critical bugs  
✅ Performance acceptable  
✅ UI displays correctly  
✅ Data persists  
✅ Privacy maintained  

## Next Steps After Testing

1. ✅ Mark successful tests
2. ✅ Report any bugs found
3. ✅ Suggest improvements
4. ✅ Share feedback
5. ✅ Enjoy using the extension!

---

**Happy Testing!** 🧪♟️

For questions, see [README.md](README.md) or open a GitHub issue.
