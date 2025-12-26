# Installation & Testing Guide

## Quick Installation (5 minutes)

### Step 1: Load Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in top-right corner)
4. Click **"Load unpacked"** button
5. Navigate to and select the `Chess-Assistant` folder
6. The Chess Coach extension should now appear in your extensions list

### Step 2: Verify Installation

✓ You should see the Chess Coach icon (♟️) in your Chrome toolbar  
✓ The extension should show as "Enabled"  
✓ Version should be 1.0.0

### Step 3: Grant Permissions

The extension will request permission to access Chess.com. Click **"Allow"** when prompted.

## Testing the Extension

### Method 1: Play a Real Game (Recommended)

1. Go to [Chess.com](https://www.chess.com)
2. Click "Play Online" or "Play Computer"
3. Play a game to completion (any result: win, lose, or draw)
4. When the game ends, you'll see a notification: "♟️ Game analysis ready!"
5. Click the Chess Coach extension icon in your toolbar
6. View your personalized analysis

### Method 2: Quick Test (Using Finished Games)

1. Go to [Chess.com](https://www.chess.com)
2. Navigate to one of your recently finished games
3. The extension will detect the game over state
4. Click the Chess Coach icon to see if analysis appears

## What to Expect

### When Analysis is Ready

You'll see:
- **Game Summary**: Your color, time control, result
- **Coach's Analysis**: Opening and middlegame assessment
- **Key Moments**: Critical mistakes with explanations
- **Recurring Patterns**: Habits detected across games
- **Focus Areas**: Top 3 priorities for improvement

### First Game
After your first analyzed game, you'll see:
- Detailed move-by-move feedback
- Human-friendly explanations (no engine notation!)
- Specific advice on what to improve

### Multiple Games
After 2+ games, you'll see:
- Pattern detection (e.g., "Early Queen Development - 3 games")
- Trend analysis
- Prioritized improvements based on frequency

## Troubleshooting

### Extension Icon Not Appearing
- Check that Developer mode is enabled
- Try reloading the extension
- Check Chrome console for errors (F12 → Console tab)

### No Analysis After Game
- Ensure you're on Chess.com (not Lichess or other sites)
- Wait a few seconds after game ends
- Check that the game fully ended (modal appeared)
- Try refreshing the page and checking extension icon

### Analysis Shows "Waiting for game..."
- This means no game has been analyzed yet
- Play a complete game on Chess.com
- Ensure the extension has permission to access Chess.com

### Content Script Not Loading
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Verify "Chess Coach: Content script loaded" message appears
4. If not, try:
   - Refreshing the Chess.com page
   - Reloading the extension
   - Checking that content.js exists

## Developer Console

To check if the extension is working:

1. **On Chess.com page:**
   - Press F12 → Console tab
   - Look for: `Chess Coach: Content script loaded`
   - When game ends: `Chess Coach: Game over detected!`

2. **In extension popup:**
   - Right-click extension icon → "Inspect popup"
   - Check console for any errors

3. **Background service worker:**
   - Go to `chrome://extensions/`
   - Click "Service worker" under Chess Coach
   - Check console for analysis logs

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Chess.com Game Review Assistant"
3. Click "Remove"
4. Confirm removal

This will also clear all stored game analyses.

## Data Storage

- All data is stored locally in Chrome storage
- Maximum 50 games stored
- To clear data:
  - Uninstall and reinstall extension, OR
  - Use Chrome storage settings

## Browser Compatibility

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera
- ❌ Firefox (uses different extension API)
- ❌ Safari (uses different extension API)

## Next Steps

1. Play 3-5 games to see pattern detection
2. Focus on one improvement area at a time
3. Check your game history regularly
4. Review the coach's advice after each game

## Need Help?

- Check the [main README](README.md) for features
- Open an issue on GitHub
- Check Chrome DevTools console for errors

---

Happy chess training! 🎯♟️
