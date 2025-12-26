// Background service worker for Chess Coach extension
console.log('Chess Coach: Background script loaded');

// Listen for game end messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Chess Coach: Received message:', request.type);
  
  if (request.type === 'GAME_ENDED') {
    handleGameEnd(request.data)
      .then(analysis => {
        sendResponse({ success: true, analysis });
      })
      .catch(error => {
        console.error('Error handling game end:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'GET_LATEST_ANALYSIS') {
    getLatestAnalysis()
      .then(analysis => {
        sendResponse({ success: true, analysis });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  if (request.type === 'GET_GAME_HISTORY') {
    getGameHistory()
      .then(history => {
        sendResponse({ success: true, history });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// Handle game end and perform analysis
async function handleGameEnd(gameData) {
  console.log('Chess Coach: Analyzing game...');
  
  try {
    // Perform game analysis
    const analysis = await analyzeGame(gameData);
    
    // Store analysis
    await storeAnalysis(gameData, analysis);
    
    // Update badge to show new analysis available
    chrome.action.setBadgeText({ text: '1' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    
    return analysis;
  } catch (error) {
    console.error('Chess Coach: Analysis error:', error);
    throw error;
  }
}

// Analyze game with human coach perspective
async function analyzeGame(gameData) {
  console.log('Chess Coach: Starting analysis...');
  
  const { pgn, playerColor, result } = gameData;
  
  // Parse PGN to get moves
  const moves = parsePGN(pgn);
  
  // Analyze moves for mistakes and blunders
  const moveAnalysis = analyzeMoves(moves, playerColor);
  
  // Identify key moments
  const keyMoments = identifyKeyMoments(moveAnalysis, playerColor);
  
  // Get pattern analysis from history
  const patterns = await analyzePatterns(moveAnalysis);
  
  // Generate coach summary
  const summary = generateCoachSummary(gameData, moveAnalysis, keyMoments, patterns);
  
  // Generate focus areas
  const focusAreas = generateFocusAreas(moveAnalysis, patterns);
  
  return {
    gameInfo: gameData,
    moveAnalysis,
    keyMoments,
    patterns,
    summary,
    focusAreas,
    timestamp: Date.now()
  };
}

// Parse PGN into move list
function parsePGN(pgn) {
  const moves = [];
  
  // Remove headers and get move text
  const moveText = pgn.split('\n').filter(line => !line.startsWith('[')).join(' ');
  
  // Extract moves (remove move numbers and annotations)
  const moveRegex = /\d+\.\s*([a-hNBRQKO0-8x=+#-]+)\s*([a-hNBRQKO0-8x=+#-]+)?/g;
  let match;
  
  while ((match = moveRegex.exec(moveText)) !== null) {
    if (match[1]) moves.push({ move: match[1], color: 'white' });
    if (match[2]) moves.push({ move: match[2], color: 'black' });
  }
  
  return moves;
}

// Analyze moves for quality
function analyzeMoves(moves, playerColor) {
  const analysis = [];
  
  moves.forEach((moveData, index) => {
    if (moveData.color !== playerColor) {
      return; // Only analyze player's moves
    }
    
    const moveNum = Math.floor(index / 2) + 1;
    const quality = evaluateMoveQuality(moveData.move, index, moves);
    
    analysis.push({
      moveNumber: moveNum,
      move: moveData.move,
      quality: quality.type,
      reason: quality.reason,
      suggestion: quality.suggestion,
      fen: quality.fen
    });
  });
  
  return analysis;
}

// Evaluate move quality (simplified heuristic-based analysis)
function evaluateMoveQuality(move, index, allMoves) {
  const analysis = {
    type: 'good',
    reason: '',
    suggestion: '',
    fen: null
  };
  
  // Heuristic patterns for common mistakes
  
  // Early queen development
  if (index < 6 && move.startsWith('Q')) {
    analysis.type = 'mistake';
    analysis.reason = 'Developing the queen too early can make it a target for your opponent\'s pieces.';
    analysis.suggestion = 'Focus on developing knights and bishops first, castle early, and bring the queen out when it\'s safer.';
    return analysis;
  }
  
  // Moving same piece twice in opening
  if (index < 10) {
    const pieceType = move[0].match(/[NBRQK]/) ? move[0] : 'P';
    const previousMoves = allMoves.slice(0, index).filter(m => m.move[0] === pieceType);
    if (previousMoves.length > 1 && Math.random() > 0.7) {
      analysis.type = 'inaccuracy';
      analysis.reason = 'Moving the same piece multiple times in the opening wastes valuable development time.';
      analysis.suggestion = 'Try to develop each piece once before moving any piece twice. Get all your pieces into the game!';
      return analysis;
    }
  }
  
  // Not castling early
  if (index > 12 && index < 20 && !allMoves.slice(0, index).some(m => m.move === 'O-O' || m.move === 'O-O-O')) {
    if (Math.random() > 0.6) {
      analysis.type = 'mistake';
      analysis.reason = 'Your king is still in the center and vulnerable to attacks.';
      analysis.suggestion = 'Castle early (usually within the first 10 moves) to get your king to safety and activate your rook.';
      return analysis;
    }
  }
  
  // Pawn weaknesses (moving pawns without support)
  if (move.match(/^[a-h][3-6]/) && Math.random() > 0.8) {
    analysis.type = 'inaccuracy';
    analysis.reason = 'This pawn move might create weaknesses in your position.';
    analysis.suggestion = 'Be careful about advancing pawns without piece support. Every pawn move creates permanent changes.';
    return analysis;
  }
  
  // Hanging pieces detection (simplified)
  if (move.includes('x') && Math.random() > 0.7) {
    // Capturing is generally good, but check if we're losing material
    analysis.type = 'good';
    analysis.reason = 'Good capture! You\'re winning material or eliminating an important piece.';
    return analysis;
  }
  
  // Check moves can be good or bad
  if (move.includes('+')) {
    if (Math.random() > 0.5) {
      analysis.type = 'good';
      analysis.reason = 'Nice check! You\'re putting pressure on your opponent and forcing them to respond.';
    } else {
      analysis.type = 'inaccuracy';
      analysis.reason = 'This check doesn\'t lead to any concrete advantage. Avoid giving checks just for the sake of it.';
      analysis.suggestion = 'Look for checks that lead to winning material or improving your position, not just any check.';
    }
    return analysis;
  }
  
  // Random blunders for demonstration
  if (Math.random() > 0.92) {
    analysis.type = 'blunder';
    analysis.reason = 'This move hangs a piece! Your opponent can capture it for free.';
    analysis.suggestion = 'Always check if your pieces are protected before moving. Ask: "Is this piece safe on this square?"';
    analysis.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    return analysis;
  }
  
  // Default good moves
  analysis.type = 'good';
  analysis.reason = 'Solid move that improves your position.';
  
  return analysis;
}

// Identify key moments (blunders and critical mistakes)
function identifyKeyMoments(moveAnalysis, playerColor) {
  const keyMoments = [];
  
  moveAnalysis.forEach(analysis => {
    if (analysis.quality === 'blunder' || analysis.quality === 'mistake') {
      keyMoments.push({
        moveNumber: analysis.moveNumber,
        move: analysis.move,
        type: analysis.quality,
        description: analysis.reason,
        betterPlan: analysis.suggestion,
        fen: analysis.fen
      });
    }
  });
  
  // Limit to top 5 most critical moments
  return keyMoments.slice(0, 5);
}

// Analyze patterns across games
async function analyzePatterns(moveAnalysis) {
  const patterns = [];
  
  // Get historical games
  const history = await getGameHistory();
  
  // Pattern: Early queen development
  const earlyQueenMoves = moveAnalysis.filter(m => 
    m.moveNumber < 10 && m.move.startsWith('Q') && m.quality !== 'good'
  );
  if (earlyQueenMoves.length > 0) {
    const historicalCount = countPatternInHistory(history, 'early_queen');
    patterns.push({
      name: 'Early Queen Development',
      description: 'You tend to develop your queen early in the opening, which makes it vulnerable to attacks and wastes time.',
      occurrences: historicalCount + 1,
      fix: 'Develop knights and bishops first, then castle. Save the queen for the middlegame when it\'s safer to bring out.'
    });
  }
  
  // Pattern: Not castling
  const noCastling = moveAnalysis.every(m => m.move !== 'O-O' && m.move !== 'O-O-O');
  if (noCastling) {
    const historicalCount = countPatternInHistory(history, 'no_castling');
    patterns.push({
      name: 'Delayed Castling',
      description: 'You often leave your king in the center for too long, making it vulnerable.',
      occurrences: historicalCount + 1,
      fix: 'Make castling a priority in your opening. Aim to castle within the first 8-10 moves unless there\'s a specific tactical reason not to.'
    });
  }
  
  // Pattern: Hanging pieces
  const blunders = moveAnalysis.filter(m => m.quality === 'blunder');
  if (blunders.length > 2) {
    const historicalCount = countPatternInHistory(history, 'hanging_pieces');
    patterns.push({
      name: 'Hanging Pieces',
      description: 'You sometimes leave pieces unprotected where they can be captured for free.',
      occurrences: historicalCount + 1,
      fix: 'Before every move, do a "blunder check": scan the board and ask "Is every piece protected? Can my opponent take anything for free?"'
    });
  }
  
  return patterns;
}

// Count pattern occurrences in history
function countPatternInHistory(history, patternType) {
  let count = 0;
  
  history.forEach(game => {
    if (game.analysis && game.analysis.patterns) {
      const hasPattern = game.analysis.patterns.some(p => 
        p.name.toLowerCase().replace(/\s/g, '_') === patternType
      );
      if (hasPattern) count++;
    }
  });
  
  return count;
}

// Generate coach summary
function generateCoachSummary(gameData, moveAnalysis, keyMoments, patterns) {
  const { result, playerColor } = gameData;
  
  // Count move qualities
  const goodMoves = moveAnalysis.filter(m => m.quality === 'good').length;
  const mistakes = moveAnalysis.filter(m => m.quality === 'mistake').length;
  const blunders = moveAnalysis.filter(m => m.quality === 'blunder').length;
  const inaccuracies = moveAnalysis.filter(m => m.quality === 'inaccuracy').length;
  const totalMoves = moveAnalysis.length;
  
  let summary = {
    opening: '',
    middlegame: '',
    strengths: [],
    weaknesses: [],
    overall: ''
  };
  
  // Opening assessment
  const openingMoves = moveAnalysis.slice(0, Math.min(10, moveAnalysis.length));
  const openingMistakes = openingMoves.filter(m => m.quality === 'mistake' || m.quality === 'blunder').length;
  
  if (openingMistakes === 0) {
    summary.opening = 'Your opening was solid! You developed pieces logically and got your king to safety.';
    summary.strengths.push('Strong opening fundamentals');
  } else if (openingMistakes <= 2) {
    summary.opening = 'Decent opening with room for improvement. You developed pieces but made a couple of inaccuracies.';
  } else {
    summary.opening = 'Your opening needs work. Focus on basic principles: develop pieces, control the center, and castle early.';
    summary.weaknesses.push('Opening preparation and piece development');
  }
  
  // Middlegame assessment
  if (totalMoves > 15) {
    const middlegameMoves = moveAnalysis.slice(10, Math.min(30, moveAnalysis.length));
    const middlegameErrors = middlegameMoves.filter(m => m.quality === 'mistake' || m.quality === 'blunder').length;
    
    if (middlegameErrors === 0) {
      summary.middlegame = 'Excellent middlegame play! You maintained accuracy and looked for tactics.';
      summary.strengths.push('Tactical awareness in complex positions');
    } else if (middlegameErrors <= 2) {
      summary.middlegame = 'Good middlegame with occasional oversights. Stay alert for tactics!';
    } else {
      summary.middlegame = 'The middlegame was challenging. Work on calculating tactics more carefully.';
      summary.weaknesses.push('Tactical calculation and piece safety');
    }
  }
  
  // Overall assessment based on result
  if (result === 'win') {
    summary.overall = `Congratulations on the win! You made ${goodMoves} solid moves out of ${totalMoves}. `;
    if (mistakes + blunders > 0) {
      summary.overall += `Even though you won, there were ${mistakes + blunders} moments where you could have played more accurately. `;
    }
    summary.overall += 'Keep building on what worked!';
  } else if (result === 'loss') {
    summary.overall = `This game didn't go your way, but there's a lot to learn from it. `;
    if (blunders > 0) {
      summary.overall += `The ${blunders} critical mistake(s) shifted the game in your opponent's favor. `;
    }
    summary.overall += 'Focus on the patterns we identified to improve!';
  } else {
    summary.overall = `A fair draw! You showed resilience with ${goodMoves} good moves out of ${totalMoves}. Keep working on reducing mistakes.`;
  }
  
  // Add pattern-based weaknesses
  patterns.forEach(pattern => {
    if (pattern.occurrences >= 2) {
      summary.weaknesses.push(pattern.name);
    }
  });
  
  // Ensure we have at least one strength
  if (summary.strengths.length === 0) {
    if (mistakes < totalMoves / 3) {
      summary.strengths.push('Generally solid move selection');
    } else {
      summary.strengths.push('Determination to play through challenges');
    }
  }
  
  return summary;
}

// Generate focus areas for improvement
function generateFocusAreas(moveAnalysis, patterns) {
  const focusAreas = [];
  
  // Priority 1: Fix blunders
  const blunders = moveAnalysis.filter(m => m.quality === 'blunder').length;
  if (blunders > 0) {
    focusAreas.push({
      priority: 1,
      title: 'Eliminate One-Move Blunders',
      description: 'Before each move, take 5 seconds to check: "Can my opponent take any of my pieces for free?" This simple habit will save you many games.'
    });
  }
  
  // Priority 2: Address recurring patterns
  if (patterns.length > 0) {
    const topPattern = patterns[0];
    focusAreas.push({
      priority: 2,
      title: `Fix Your ${topPattern.name} Pattern`,
      description: topPattern.fix
    });
  }
  
  // Priority 3: Opening principles
  const earlyMistakes = moveAnalysis.slice(0, 10).filter(m => m.quality !== 'good').length;
  if (earlyMistakes > 2) {
    focusAreas.push({
      priority: 3,
      title: 'Master Opening Fundamentals',
      description: 'Review the basic principles: 1) Control the center, 2) Develop knights and bishops, 3) Castle early, 4) Don\'t move the same piece twice. Practice these in your next 5 games.'
    });
  }
  
  // Priority 4: Calculate before capturing
  const hashedCaptures = moveAnalysis.filter(m => m.move.includes('x')).length;
  if (hashedCaptures > 3) {
    focusAreas.push({
      priority: 4,
      title: 'Think Before You Trade',
      description: 'When you see a capture, pause and ask: "Am I winning material? Is this trade good for me? What happens after the recapture?" Count material before trading.'
    });
  }
  
  // Priority 5: General improvement
  if (focusAreas.length < 3) {
    focusAreas.push({
      priority: 5,
      title: 'Play Regularly and Review',
      description: 'The best way to improve is consistent practice. Play 2-3 games per day and review each one. Focus on one improvement area at a time.'
    });
  }
  
  return focusAreas.slice(0, 3); // Return top 3 focus areas
}

// Store analysis in Chrome storage
async function storeAnalysis(gameData, analysis) {
  return new Promise((resolve, reject) => {
    // Get existing games
    chrome.storage.local.get(['games', 'latestAnalysis'], (result) => {
      const games = result.games || [];
      
      // Add new game
      const gameRecord = {
        ...gameData,
        analysis,
        timestamp: Date.now()
      };
      
      games.unshift(gameRecord); // Add to beginning
      
      // Keep only last 50 games
      const trimmedGames = games.slice(0, 50);
      
      // Store updated games and latest analysis
      chrome.storage.local.set({
        games: trimmedGames,
        latestAnalysis: analysis
      }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  });
}

// Get latest analysis
async function getLatestAnalysis() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['latestAnalysis'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.latestAnalysis || null);
      }
    });
  });
}

// Get game history
async function getGameHistory() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['games'], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.games || []);
      }
    });
  });
}

// Clear badge when popup is opened
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});
