// Content script for Chess.com game detection and data extraction
console.log('Chess Coach: Content script loaded');

let gameObserver = null;
let lastProcessedGame = null;

// Initialize the content script
function initialize() {
  console.log('Chess Coach: Initializing...');
  
  // Check if we're on a game page
  if (isGamePage()) {
    console.log('Chess Coach: Game page detected');
    setupGameObserver();
  }
  
  // Listen for page navigation
  setupNavigationListener();
}

// Check if current page is a game page
function isGamePage() {
  const url = window.location.href;
  return url.includes('chess.com/game/live') || 
         url.includes('chess.com/live') ||
         url.includes('chess.com/play/online') ||
         url.includes('chess.com/analysis/game/live');
}

// Setup observer to detect game end
function setupGameObserver() {
  // Disconnect existing observer
  if (gameObserver) {
    gameObserver.disconnect();
  }
  
  // Debounce the check to avoid excessive calls
  let checkTimeout = null;
  const debouncedCheck = () => {
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }
    checkTimeout = setTimeout(() => {
      checkGameEnd();
      checkTimeout = null;
    }, 500); // Wait 500ms after last mutation
  };
  
  // Create mutation observer to watch for game end
  gameObserver = new MutationObserver(debouncedCheck);
  
  // Observe only the game container area, not entire document
  // Look for the main game container first
  const gameContainer = document.querySelector('.board-layout-main, #board-layout-main, .main-board-component');
  
  if (gameContainer) {
    gameObserver.observe(gameContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-cy'] // Only watch relevant attributes
    });
  } else {
    // If game container not found, observe modal areas only (game-over dialogs appear here)
    const modalContainer = document.querySelector('#modal-container, .modal-container, body > div[role="dialog"]') || document.body;
    gameObserver.observe(modalContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-cy']
    });
  }
  
  // Single periodic check as backup (less frequent)
  setInterval(checkGameEnd, 10000); // Every 10 seconds instead of 3
}

// Check if game has ended
function checkGameEnd() {
  // Early return if we're not on a game page
  if (!isGamePage()) {
    return;
  }
  
  // Look for game over indicators (optimized selector)
  const gameOverElement = document.querySelector('.game-over-modal-content, [data-cy="game-over-modal"], .modal-game-over-content-container, .game-over-header-component');
  
  if (gameOverElement) {
    console.log('Chess Coach: Game over detected!');
    const gameData = extractGameData();
    if (gameData && !isSameGame(gameData)) {
      lastProcessedGame = gameData;
      processGameData(gameData);
    }
  }
}

// Check if this is the same game we already processed
function isSameGame(gameData) {
  if (!lastProcessedGame) return false;
  return lastProcessedGame.pgn === gameData.pgn &&
         lastProcessedGame.timestamp === gameData.timestamp;
}

// Extract game data from Chess.com page
function extractGameData() {
  try {
    const gameData = {
      pgn: extractPGN(),
      playerColor: extractPlayerColor(),
      timeControl: extractTimeControl(),
      result: extractResult(),
      timestamp: Date.now(),
      url: window.location.href
    };
    
    console.log('Chess Coach: Extracted game data:', gameData);
    return gameData;
  } catch (error) {
    console.error('Chess Coach: Error extracting game data:', error);
    return null;
  }
}

// Extract PGN from the page
function extractPGN() {
  // Method 1: Try to get from Chess.com's internal API
  try {
    // Chess.com stores game data in window object
    if (window.chesscom && window.chesscom.game) {
      const game = window.chesscom.game;
      if (game.getPGN) {
        return game.getPGN();
      }
    }
  } catch (e) {}
  
  // Method 2: Build PGN from move list
  try {
    const moves = [];
    const moveElements = document.querySelectorAll('.move-text-component, .node');
    
    moveElements.forEach((moveEl, index) => {
      const moveText = moveEl.textContent.trim();
      if (moveText && !moveText.includes('...')) {
        moves.push(moveText);
      }
    });
    
    if (moves.length > 0) {
      // Format as PGN
      let pgn = '[Event "Chess.com Game"]\n';
      pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
      pgn += '\n';
      
      // Add moves with move numbers
      for (let i = 0; i < moves.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        pgn += `${moveNum}. ${moves[i]} `;
        if (moves[i + 1]) {
          pgn += `${moves[i + 1]} `;
        }
      }
      
      return pgn.trim();
    }
  } catch (e) {
    console.error('Error building PGN:', e);
  }
  
  // Method 3: Try to extract from analysis board
  try {
    const downloadPgnButton = document.querySelector('[data-cy="download-pgn-button"]');
    if (downloadPgnButton) {
      // Simulate click and capture
      // This is a fallback, may not work in all cases
    }
  } catch (e) {}
  
  return 'PGN extraction pending';
}

// Extract player color
function extractPlayerColor() {
  try {
    // Look for player name in bottom board
    const bottomPlayer = document.querySelector('.player-bottom, .player-component:last-child');
    const topPlayer = document.querySelector('.player-top, .player-component:first-child');
    
    // Check which side has the current user
    const userElement = document.querySelector('.user-username-component, .user-tagline-username');
    if (userElement) {
      const username = userElement.textContent.trim();
      
      if (bottomPlayer && bottomPlayer.textContent.includes(username)) {
        return 'white';
      } else if (topPlayer && topPlayer.textContent.includes(username)) {
        return 'black';
      }
    }
    
    // Fallback: check board orientation
    const board = document.querySelector('.board');
    if (board) {
      const flipped = board.classList.contains('flipped');
      return flipped ? 'black' : 'white';
    }
  } catch (e) {
    console.error('Error extracting player color:', e);
  }
  
  return 'white'; // Default
}

// Extract time control
function extractTimeControl() {
  try {
    // Look for time control in game info
    const timeControlElement = document.querySelector('.game-time-control, [data-cy="time-control"]');
    if (timeControlElement) {
      return timeControlElement.textContent.trim();
    }
    
    // Try to find in clock elements
    const clocks = document.querySelectorAll('.clock-component');
    if (clocks.length > 0) {
      const clockText = clocks[0].getAttribute('data-time-control');
      if (clockText) return clockText;
    }
    
    // Look in page URL
    const urlParams = new URLSearchParams(window.location.search);
    const timeControl = urlParams.get('timeControl');
    if (timeControl) return timeControl;
    
  } catch (e) {
    console.error('Error extracting time control:', e);
  }
  
  return 'Unknown';
}

// Extract game result
function extractResult() {
  try {
    // Method 1: Look for result in game over modal header
    const gameOverHeader = document.querySelector('.game-over-header-component, .game-over-title');
    if (gameOverHeader) {
      const text = gameOverHeader.textContent.toLowerCase();
      if (text.includes('win') || text.includes('won')) {
        return 'win';
      } else if (text.includes('lose') || text.includes('lost')) {
        return 'loss';
      } else if (text.includes('draw')) {
        return 'draw';
      }
    }
    
    // Method 2: Check for checkmate/resignation indicators in content
    const resultText = document.querySelector('.game-over-modal-content');
    if (resultText) {
      const text = resultText.textContent.toLowerCase();
      if (text.includes('checkmate') || text.includes('resigned')) {
        if (text.includes('you won') || text.includes('victory')) {
          return 'win';
        } else {
          return 'loss';
        }
      }
    }
    
    // Method 3: Check various other result indicators
    const resultElements = document.querySelectorAll('[class*="result"], [class*="game-over"]');
    for (const elem of resultElements) {
      const text = elem.textContent.toLowerCase();
      if (text.includes('you won') || text.includes('victory') || text.includes('checkmate')) {
        if (!text.includes('lost')) return 'win';
      }
      if (text.includes('you lost') || text.includes('defeat')) {
        return 'loss';
      }
      if (text.includes('draw') || text.includes('tie')) {
        return 'draw';
      }
    }
  } catch (e) {
    console.error('Error extracting result:', e);
  }
  
  return 'unknown';
}

// Get current board FEN
function getCurrentFEN() {
  try {
    // Try to get FEN from Chess.com's internal game object
    if (window.chesscom && window.chesscom.game && window.chesscom.game.getFEN) {
      return window.chesscom.game.getFEN();
    }
    
    // Fallback: construct FEN from board state
    return constructFENFromBoard();
  } catch (e) {
    console.error('Error getting FEN:', e);
    return null;
  }
}

// Construct FEN from visual board state
function constructFENFromBoard() {
  try {
    const pieces = document.querySelectorAll('.piece');
    
    // Early exit if no pieces found
    if (pieces.length === 0) {
      return null;
    }
    
    const board = Array(8).fill(null).map(() => Array(8).fill(''));
    let validPieceCount = 0;
    
    pieces.forEach(piece => {
      const classes = piece.className;
      // Extract square position (e.g., 'square-11', 'square-45')
      const squareMatch = classes.match(/square-(\d)(\d)/);
      if (squareMatch) {
        const file = parseInt(squareMatch[1]) - 1;
        const rank = parseInt(squareMatch[2]) - 1;
        
        // Validate indices are within bounds
        if (file < 0 || file > 7 || rank < 0 || rank > 7) {
          return; // Skip invalid positions
        }
        
        // Extract piece type and color
        const pieceMatch = classes.match(/(w|b)(p|n|b|r|q|k)/i);
        if (pieceMatch) {
          const color = pieceMatch[1];
          const type = pieceMatch[2];
          board[rank][file] = color + type;
          validPieceCount++;
        }
      }
    });
    
    // If we didn't find enough pieces, something went wrong
    if (validPieceCount < 8) {
      return null;
    }
    
    // Convert board array to FEN notation
    let fen = '';
    for (let rank = 7; rank >= 0; rank--) {
      let empty = 0;
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (piece) {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += piece[0] === 'w' ? piece[1].toUpperCase() : piece[1].toLowerCase();
        } else {
          empty++;
        }
      }
      if (empty > 0) fen += empty;
      if (rank > 0) fen += '/';
    }
    
    // Add default additional FEN fields
    fen += ' w KQkq - 0 1';
    return fen;
  } catch (e) {
    console.error('Error constructing FEN:', e);
    return null;
  }
}

// Process game data and send to background script
function processGameData(gameData) {
  console.log('Chess Coach: Processing game data...');
  
  // Send to background script for analysis
  chrome.runtime.sendMessage({
    type: 'GAME_ENDED',
    data: gameData
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Chess Coach: Error sending message:', chrome.runtime.lastError);
    } else {
      console.log('Chess Coach: Game data sent successfully');
    }
  });
  
  // Show notification to user
  showNotification('Game analysis ready! Click the extension icon to view.');
}

// Show notification
function showNotification(message) {
  // Create a simple notification overlay
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = '♟️ ' + message;
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Setup navigation listener for SPA routing
function setupNavigationListener() {
  // Listen for URL changes
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      console.log('Chess Coach: Navigation detected');
      if (isGamePage()) {
        setupGameObserver();
      }
    }
  }).observe(document, { subtree: true, childList: true });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CURRENT_GAME') {
    const gameData = extractGameData();
    sendResponse({ gameData });
  }
  return true;
});

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
