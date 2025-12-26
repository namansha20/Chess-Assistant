# Changelog

All notable changes to the Chess.com Game Review Assistant extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-26

### Added
- Initial release of Chess.com Game Review Assistant
- Chrome Manifest V3 extension structure
- Automatic game detection on Chess.com
- PGN extraction from finished games
- Player color, time control, and result extraction
- FEN position tracking for key moments
- Human coach-style analysis with no engine jargon
- Move quality assessment (blunders, mistakes, inaccuracies, good moves)
- Heuristic-based move evaluation:
  - Early queen development detection
  - Delayed castling identification
  - Hanging piece detection
  - Opening principle violations
- Key moment identification with explanations
- Recurring pattern detection across multiple games
- Coach summary generation with:
  - Opening assessment
  - Middlegame evaluation
  - Strengths and weaknesses
  - Overall game evaluation
- Top 3 focus areas for improvement
- Beautiful gradient-styled popup UI
- Chrome local storage integration
- Game history tracking (up to 50 games)
- Game history viewer
- Visual indicators for wins/losses/draws
- Browser notification when analysis is ready
- Detailed installation and usage documentation
- Extension icons (16px, 48px, 128px)

### Features Explained

#### Game Detection
- Monitors Chess.com pages for game completion
- Detects game-over modal and extracts data
- Works with live games, daily games, and analysis board
- Automatic data extraction without user interaction

#### Analysis Engine
- Evaluates moves based on chess principles
- Identifies common opening mistakes
- Tracks piece safety and development
- Detects tactical oversights
- Provides specific, actionable advice

#### Pattern Recognition
- Tracks mistakes across games
- Identifies recurring bad habits
- Counts pattern occurrences
- Provides targeted fixes for each pattern

#### Coach Summaries
- Context-aware feedback based on game result
- Phase-by-phase assessment (opening, middlegame)
- Balanced view of strengths and weaknesses
- Encouraging tone that motivates improvement

#### Focus Areas
- Prioritized improvement suggestions
- Limited to top 3 for focused practice
- Specific, actionable instructions
- Connected to actual game situations

### Technical Details
- Built with Manifest V3 for modern Chrome extensions
- Content script for Chess.com integration
- Background service worker for analysis
- Local storage for game history
- No external dependencies
- Privacy-focused (no data leaves browser)

### Browser Support
- Google Chrome (v88+)
- Microsoft Edge (Chromium)
- Brave Browser
- Opera

### Known Limitations
- Currently supports Chess.com only (Lichess support planned)
- Heuristic-based analysis (not engine-powered)
- PGN extraction may vary based on Chess.com UI changes
- Maximum 50 games stored in history

## [Unreleased]

### Planned Features
- [ ] Lichess.org support
- [ ] Opening repertoire tracking
- [ ] Tactical puzzle recommendations
- [ ] Performance statistics and graphs
- [ ] Export analysis to PDF
- [ ] Custom coaching preferences
- [ ] Multiple language support
- [ ] Dark mode theme
- [ ] More detailed endgame analysis
- [ ] Integration with external chess engines (optional)

---

For detailed usage instructions, see [README.md](README.md) and [INSTALL.md](INSTALL.md).
