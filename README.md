# ♟️ Chess.com Game Review Assistant

A Chrome extension that acts as your personal chess coach, analyzing your Chess.com games with human-friendly explanations and actionable advice.

## Features

- **🎯 Automatic Game Detection**: Detects when your Chess.com game ends and automatically extracts game data
- **📊 Comprehensive Analysis**: Extracts PGN, player color, time control, and game result
- **🧠 Human Coach Tone**: Explains mistakes, blunders, and missed ideas in plain language (no engine jargon!)
- **🔄 Pattern Recognition**: Detects recurring mistake patterns across your games
- **📍 Visual Blunder Positions**: Shows key positions using FEN notation
- **💡 Actionable Advice**: Provides specific focus areas and habits to fix
- **📈 Game History**: Tracks your analyzed games for pattern analysis

## Installation

### From Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/namansha20/Chess-Assistant.git
   cd Chess-Assistant
   ```

2. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `Chess-Assistant` folder

3. **You're ready!** The extension icon should appear in your Chrome toolbar

## Usage

1. **Play a game on Chess.com**
   - Go to [Chess.com](https://www.chess.com) and play a game (any time control)

2. **Finish the game**
   - Complete your game (win, lose, or draw)
   - The extension automatically detects the game end

3. **View your analysis**
   - Click the Chess Coach extension icon in your toolbar
   - Review your coach's analysis with:
     - Game summary (color, time control, result)
     - Coach's assessment of your opening and middlegame
     - Key moments where mistakes occurred
     - Recurring patterns across your games
     - Top 3 focus areas for improvement

4. **Track your progress**
   - Click "View Game History" to see previous analyzed games
   - Identify patterns across multiple games
   - Focus on fixing recurring mistakes

## What the Coach Analyzes

### Move Quality Assessment
- **Blunders**: Critical mistakes that lose material or the game
- **Mistakes**: Moves that significantly worsen your position
- **Inaccuracies**: Suboptimal moves that miss better opportunities
- **Good moves**: Solid moves that improve your position

### Pattern Detection
The coach tracks recurring issues like:
- Early queen development
- Delayed castling
- Hanging pieces
- Moving the same piece twice in opening
- Weak pawn structures

### Coach Summary
- **Opening assessment**: How well you followed opening principles
- **Middlegame evaluation**: Tactical awareness and calculation
- **Strengths**: What you did well this game
- **Weaknesses**: Areas that need work
- **Overall assessment**: Context-aware feedback based on result

### Focus Areas
Get 3 prioritized improvement suggestions:
1. Most critical habit to fix
2. Pattern-based improvement
3. General chess principles to master

## Example Analysis

```
Game Summary:
- Your Color: White
- Time Control: 10+0
- Result: Loss

Coach's Analysis:
Opening: Your opening needs work. Focus on basic principles: 
develop pieces, control the center, and castle early.

Middlegame: The middlegame was challenging. Work on calculating 
tactics more carefully.

Key Moments:
Move 5: Qh5 - Mistake
This move develops the queen too early, making it vulnerable.
Better plan: Develop knights and bishops first, castle early.

Move 12: Ne5? - Blunder
This move hangs a piece! Your opponent can capture it for free.
Better plan: Always check if your pieces are protected.

Recurring Patterns:
1. Early Queen Development (3 games)
   You tend to bring out your queen early in the opening.
   Fix: Develop minor pieces first, queen comes later.

Focus For Next Game:
1. Eliminate One-Move Blunders
2. Fix Your Early Queen Development Pattern
3. Master Opening Fundamentals
```

## Technical Details

### Architecture
- **Manifest V3**: Modern Chrome extension architecture
- **Content Script**: Monitors Chess.com pages for game completion
- **Background Service Worker**: Analyzes games and stores history
- **Popup UI**: Displays analysis in user-friendly format

### Data Extraction
- PGN notation from move list
- Player color from board orientation
- Time control from game settings
- Result from game-over modal
- FEN positions for key moments

### Analysis Engine
- Heuristic-based move evaluation
- Pattern matching across games
- Human-friendly explanations
- No external engine dependencies

### Storage
- Chrome local storage
- Keeps last 50 analyzed games
- Tracks patterns across games

## Privacy

- All analysis happens locally in your browser
- No data is sent to external servers
- Game data stored only in Chrome's local storage
- You can clear data anytime from Chrome settings

## Development

### File Structure
```
Chess-Assistant/
├── manifest.json          # Extension configuration
├── content.js            # Chess.com page integration
├── background.js         # Game analysis engine
├── popup.html           # Analysis display UI
├── popup.js             # Popup logic
├── popup.css            # Styling
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Key Functions

**content.js**
- `checkGameEnd()`: Detects game completion
- `extractGameData()`: Extracts PGN, color, time control, result
- `getCurrentFEN()`: Gets board position

**background.js**
- `analyzeGame()`: Main analysis engine
- `analyzeMoves()`: Evaluates move quality
- `identifyKeyMoments()`: Finds critical positions
- `analyzePatterns()`: Detects recurring mistakes
- `generateCoachSummary()`: Creates human-friendly summary

**popup.js**
- `displayAnalysis()`: Renders analysis in UI
- `displayKeyMoments()`: Shows blunder positions
- `displayPatterns()`: Shows recurring issues

## Future Enhancements

- [ ] Integration with Lichess.org
- [ ] Opening repertoire tracking
- [ ] Tactical puzzle recommendations
- [ ] Performance statistics and graphs
- [ ] Export analysis to PDF
- [ ] Custom coaching preferences

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use and modify!

## Support

If you find this extension helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs via GitHub issues
- 💡 Suggest features
- 🤝 Contribute improvements

## Acknowledgments

Built with ❤️ for chess players who want to improve their game with human-friendly guidance.

---

**Note**: This extension provides educational analysis and is not affiliated with Chess.com. For professional chess coaching, consider working with a certified chess coach.