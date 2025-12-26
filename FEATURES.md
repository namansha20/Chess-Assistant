# Features Documentation

## Core Features

### 1. Automatic Game Detection
The extension continuously monitors your Chess.com games and automatically triggers analysis when a game ends.

**How it works:**
- Content script observes DOM changes
- Detects game-over modal appearance
- Extracts game data immediately
- Shows browser notification when ready
- Updates extension badge with indicator

**Supported game types:**
- Live chess (Blitz, Rapid, Bullet)
- Daily chess
- Computer games
- All time controls

### 2. Comprehensive Data Extraction

#### PGN (Portable Game Notation)
```
[Event "Chess.com Game"]
[Date "2025-12-26"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7
```

The extension extracts:
- Complete move sequence
- Move numbers
- Standard algebraic notation
- Special moves (castling, captures, checks)

#### Player Information
- **Your Color**: White or Black
- **Opponent**: Username (if available)
- **Ratings**: Your rating and opponent's rating

#### Game Metadata
- **Time Control**: "10+0", "15+10", "3+0", etc.
- **Result**: Win, Loss, or Draw
- **Termination**: Checkmate, Resignation, Time, Draw offer
- **Date & Time**: When the game was played
- **URL**: Link back to game on Chess.com

#### Position Data (FEN)
For key moments, the extension captures:
```
rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2
```

### 3. Human Coach Analysis

Unlike engine-based analyzers that show cryptic evaluations like "+1.5" or "Stockfish depth 20", our coach speaks like a real person.

#### Instead of:
❌ "Move 12: -2.3 → -4.7 (Inaccuracy)"

#### You get:
✅ "Move 12: Your knight is unprotected here and can be captured for free. Before moving, always ask yourself: 'Is this piece safe on this square?'"

### 4. Move Quality Assessment

Each of your moves is categorized:

#### Blunder (💥)
Critical mistakes that lose material or the game.
```
Example: Hanging your queen
Coach says: "This move hangs your queen! Your opponent can 
capture it for free. Always check if your pieces are protected."
```

#### Mistake (⚠️)
Moves that significantly worsen your position.
```
Example: Early queen development
Coach says: "Developing the queen too early makes it a target. 
Focus on developing knights and bishops first."
```

#### Inaccuracy (≈)
Suboptimal moves that miss better opportunities.
```
Example: Moving same piece twice in opening
Coach says: "Moving the same piece multiple times wastes 
development time. Get all pieces into the game first!"
```

#### Good Move (✓)
Solid moves that improve your position.
```
Example: Early castling
Coach says: "Good castling! You got your king to safety and 
activated your rook."
```

### 5. Pattern Detection

The extension tracks your games and identifies recurring mistakes:

#### Pattern Example 1: Early Queen Development
```
Occurrences: 3 games
Description: You tend to develop your queen early in the 
opening, which makes it vulnerable to attacks.

Fix: Develop knights and bishops first, then castle. Save 
the queen for the middlegame when it's safer.
```

#### Pattern Example 2: Delayed Castling
```
Occurrences: 4 games
Description: You often leave your king in the center for too 
long, making it vulnerable.

Fix: Make castling a priority. Aim to castle within the first 
8-10 moves unless there's a tactical reason not to.
```

#### Pattern Example 3: Hanging Pieces
```
Occurrences: 2 games
Description: You sometimes leave pieces unprotected where they 
can be captured for free.

Fix: Before every move, do a "blunder check": scan the board 
and ask "Is every piece protected?"
```

### 6. Key Moments Display

Shows the most critical positions where the game was decided:

```
╔══════════════════════════════════════════════════════╗
║ Move 15: Ne5? - BLUNDER                             ║
╠══════════════════════════════════════════════════════╣
║ This move hangs a piece! Your opponent can capture  ║
║ it for free.                                         ║
║                                                      ║
║ Better plan: Always check if your pieces are        ║
║ protected before moving. Ask: "Is this piece safe   ║
║ on this square?"                                     ║
║                                                      ║
║ FEN: rnbqkb1r/ppp2ppp/5n2/3pN3/8/8/PPPP1PPP/...    ║
╚══════════════════════════════════════════════════════╝
```

### 7. Coach Summary Generation

Comprehensive assessment in three parts:

#### Opening Assessment
```
✅ "Your opening was solid! You developed pieces logically 
and got your king to safety."

⚠️ "Decent opening with room for improvement. You developed 
pieces but made a couple of inaccuracies."

❌ "Your opening needs work. Focus on basic principles: 
develop pieces, control the center, and castle early."
```

#### Middlegame Evaluation
```
✅ "Excellent middlegame play! You maintained accuracy and 
looked for tactics."

⚠️ "Good middlegame with occasional oversights. Stay alert 
for tactics!"

❌ "The middlegame was challenging. Work on calculating 
tactics more carefully."
```

#### Overall Assessment
Context-aware based on result:
```
WIN: "Congratulations on the win! You made 18 solid moves 
out of 24. Keep building on what worked!"

LOSS: "This game didn't go your way, but there's a lot to 
learn from it. The 2 critical mistakes shifted the game. 
Focus on the patterns we identified!"

DRAW: "A fair draw! You showed resilience with 20 good 
moves out of 28. Keep working on reducing mistakes."
```

### 8. Focus Areas (Top 3 Priorities)

Actionable improvement suggestions ranked by priority:

```
1. Eliminate One-Move Blunders
   Before each move, take 5 seconds to check: "Can my 
   opponent take any of my pieces for free?" This simple 
   habit will save you many games.

2. Fix Your Early Queen Development Pattern
   Develop knights and bishops first, then castle. Save 
   the queen for the middlegame when it's safer to bring 
   out.

3. Master Opening Fundamentals
   Review the basic principles: 1) Control the center, 
   2) Develop knights and bishops, 3) Castle early, 
   4) Don't move the same piece twice.
```

### 9. Game History Tracking

- Stores up to 50 most recent games
- Each game includes full analysis
- Click any game to view its analysis
- Track improvement over time
- Pattern detection uses historical data

### 10. Beautiful UI

- Modern gradient design
- Intuitive layout
- Color-coded feedback
- Responsive design
- Easy navigation
- Visual indicators for game results

## Technical Features

### Privacy-Focused
- ✅ All analysis happens locally
- ✅ No data sent to external servers
- ✅ No account required
- ✅ No tracking or analytics
- ✅ Data stored only in Chrome storage

### Performance
- ⚡ Instant analysis (< 1 second)
- ⚡ Lightweight (< 100KB total)
- ⚡ No external dependencies
- ⚡ Minimal memory usage
- ⚡ Efficient DOM observation

### Compatibility
- ✅ Manifest V3 (modern standard)
- ✅ Works with Chess.com updates
- ✅ Compatible with Chess.com themes
- ✅ Works alongside other extensions
- ✅ Mobile-friendly popup

## User Experience

### Notifications
When a game ends:
```
╔═══════════════════════════════════════╗
║ ♟️ Chess Coach                        ║
║ Game analysis ready! Click the       ║
║ extension icon to view.               ║
╚═══════════════════════════════════════╝
```

### Badge Indicator
Extension icon shows badge when new analysis is available:
- Green badge with "1" when analysis ready
- Badge clears when you open the popup

### No Interruption
- Extension works silently in background
- Doesn't interfere with gameplay
- Non-intrusive notifications
- Analysis available when you're ready

## Advanced Features

### Pattern Learning
The more games you play, the smarter the analysis becomes:
- Tracks frequency of each mistake type
- Identifies your specific weaknesses
- Prioritizes most common issues
- Adjusts focus areas accordingly

### Context-Aware Advice
Advice changes based on:
- Your rating level (inferred from patterns)
- Game result (win/loss/draw)
- Stage of game (opening/middlegame/endgame)
- Frequency of mistake type

### Adaptive Feedback
- First-time mistakes get gentle explanations
- Recurring mistakes get stronger emphasis
- Improvements are recognized and praised
- Focus areas evolve as you improve

## Limitations & Future Plans

### Current Limitations
- Heuristic-based (not engine analysis)
- Chess.com only (Lichess coming)
- English language only
- No endgame tablebase
- Limited opening theory

### Planned Enhancements
- Engine integration (optional)
- Multiple site support
- More languages
- Opening book
- Endgame tablebase
- Statistics dashboard
- Progress graphs
- Custom coaching style

---

For installation instructions, see [INSTALL.md](INSTALL.md).  
For general information, see [README.md](README.md).
