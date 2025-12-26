// Popup script for Chess Coach extension
console.log('Chess Coach: Popup loaded');

let currentAnalysis = null;
let gameHistory = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Chess Coach: Popup initialized');
  
  // Setup event listeners
  setupEventListeners();
  
  // Load latest analysis
  await loadLatestAnalysis();
  
  // Load game history
  await loadGameHistory();
});

// Setup event listeners
function setupEventListeners() {
  const viewHistoryBtn = document.getElementById('viewHistoryBtn');
  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', toggleHistory);
  }
}

// Load latest analysis
async function loadLatestAnalysis() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_LATEST_ANALYSIS' });
    
    if (response.success && response.analysis) {
      currentAnalysis = response.analysis;
      displayAnalysis(currentAnalysis);
      hideStatus();
    } else {
      showStatus('Waiting for a game to finish on Chess.com...');
    }
  } catch (error) {
    console.error('Error loading analysis:', error);
    showStatus('Error loading analysis. Try refreshing.');
  }
}

// Load game history
async function loadGameHistory() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_GAME_HISTORY' });
    
    if (response.success) {
      gameHistory = response.history || [];
      console.log(`Loaded ${gameHistory.length} games from history`);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Display analysis in popup
function displayAnalysis(analysis) {
  if (!analysis) return;
  
  // Show analysis container
  document.getElementById('analysis').classList.remove('hidden');
  
  // Display game details
  displayGameDetails(analysis.gameInfo);
  
  // Display coach summary
  displayCoachSummary(analysis.summary);
  
  // Display key moments
  displayKeyMoments(analysis.keyMoments);
  
  // Display patterns
  displayPatterns(analysis.patterns);
  
  // Display focus areas
  displayFocusAreas(analysis.focusAreas);
  
  // Clear badge with error handling
  try {
    chrome.action.setBadgeText({ text: '' }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Could not clear badge:', chrome.runtime.lastError.message);
      }
    });
  } catch (error) {
    console.warn('Badge API error:', error);
  }
}

// Display game details
function displayGameDetails(gameInfo) {
  const container = document.getElementById('gameDetails');
  if (!container) return;
  
  const { playerColor, timeControl, result, timestamp } = gameInfo;
  
  const resultClass = result === 'win' ? 'win' : result === 'loss' ? 'loss' : 'draw';
  const resultText = result.charAt(0).toUpperCase() + result.slice(1);
  const date = new Date(timestamp).toLocaleString();
  
  container.innerHTML = `
    <div class="game-detail">
      <span class="label">Your Color:</span>
      <span class="value">${playerColor.charAt(0).toUpperCase() + playerColor.slice(1)}</span>
    </div>
    <div class="game-detail">
      <span class="label">Time Control:</span>
      <span class="value">${timeControl}</span>
    </div>
    <div class="game-detail">
      <span class="label">Result:</span>
      <span class="value ${resultClass}">${resultText}</span>
    </div>
    <div class="game-detail">
      <span class="label">Date:</span>
      <span class="value">${date}</span>
    </div>
  `;
}

// Display coach summary
function displayCoachSummary(summary) {
  const container = document.getElementById('coachSummary');
  if (!container || !summary) return;
  
  let html = '';
  
  // Opening assessment
  if (summary.opening) {
    html += `<div class="summary-text"><strong>Opening:</strong> ${summary.opening}</div>`;
  }
  
  // Middlegame assessment
  if (summary.middlegame) {
    html += `<div class="summary-text"><strong>Middlegame:</strong> ${summary.middlegame}</div>`;
  }
  
  // Overall assessment
  if (summary.overall) {
    html += `<div class="summary-text"><strong>Overall:</strong> ${summary.overall}</div>`;
  }
  
  // Strengths
  if (summary.strengths && summary.strengths.length > 0) {
    html += '<div class="summary-text"><strong class="strength">Strengths:</strong><ul>';
    summary.strengths.forEach(strength => {
      html += `<li>${strength}</li>`;
    });
    html += '</ul></div>';
  }
  
  // Weaknesses
  if (summary.weaknesses && summary.weaknesses.length > 0) {
    html += '<div class="summary-text"><strong class="weakness">Areas to Work On:</strong><ul>';
    summary.weaknesses.forEach(weakness => {
      html += `<li>${weakness}</li>`;
    });
    html += '</ul></div>';
  }
  
  container.innerHTML = html;
}

// Display key moments
function displayKeyMoments(moments) {
  const container = document.getElementById('keyMoments');
  if (!container) return;
  
  if (!moments || moments.length === 0) {
    container.innerHTML = '<p style="color: #4caf50; font-weight: 600;">Great! No major mistakes detected in this game.</p>';
    return;
  }
  
  let html = '';
  
  moments.forEach(moment => {
    const typeClass = moment.type === 'blunder' ? '' : moment.type;
    const typeLabel = moment.type.charAt(0).toUpperCase() + moment.type.slice(1);
    
    html += `
      <div class="moment ${typeClass}">
        <div class="moment-header">Move ${moment.moveNumber}: ${moment.move} - ${typeLabel}</div>
        <div class="moment-description">${moment.description}</div>
        <div class="moment-description"><strong>Better plan:</strong> ${moment.betterPlan}</div>
        ${moment.fen ? `<div class="fen-position" title="Board position after this move">FEN: ${moment.fen}</div>` : ''}
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Display patterns
function displayPatterns(patterns) {
  const container = document.getElementById('patterns');
  if (!container) return;
  
  if (!patterns || patterns.length === 0) {
    container.innerHTML = '<p style="color: #666;">No recurring patterns detected yet. Play more games to track your habits!</p>';
    return;
  }
  
  let html = '';
  
  patterns.forEach(pattern => {
    html += `
      <div class="pattern-item">
        <div class="pattern-name">${pattern.name} <span class="pattern-count">(${pattern.occurrences}x)</span></div>
        <div class="pattern-description">${pattern.description}</div>
        <div class="pattern-description"><strong>How to fix:</strong> ${pattern.fix}</div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Display focus areas
function displayFocusAreas(focusAreas) {
  const container = document.getElementById('focusAreas');
  if (!container) return;
  
  if (!focusAreas || focusAreas.length === 0) {
    container.innerHTML = '<p style="color: #666;">Keep playing consistently and reviewing your games!</p>';
    return;
  }
  
  let html = '';
  
  focusAreas.forEach((area, index) => {
    html += `
      <div class="focus-item">
        <div class="focus-number">${index + 1}</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 5px;">${area.title}</div>
          <div class="focus-text">${area.description}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// Toggle history view
function toggleHistory() {
  const historyList = document.getElementById('historyList');
  const btn = document.getElementById('viewHistoryBtn');
  
  if (historyList.classList.contains('hidden')) {
    displayHistory();
    historyList.classList.remove('hidden');
    btn.textContent = 'Hide History';
  } else {
    historyList.classList.add('hidden');
    btn.textContent = 'View Game History';
  }
}

// Display game history
function displayHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;
  
  if (gameHistory.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No games analyzed yet.</p>';
    return;
  }
  
  let html = '<h3 style="margin: 15px 0 10px 0;">Recent Games</h3>';
  
  gameHistory.slice(0, 10).forEach((game, index) => {
    const date = new Date(game.timestamp).toLocaleDateString();
    const resultClass = game.result === 'win' ? 'win' : game.result === 'loss' ? 'loss' : 'draw';
    const resultText = game.result.charAt(0).toUpperCase() + game.result.slice(1);
    
    html += `
      <div class="history-item" data-index="${index}">
        <div class="history-date">${date} - ${game.timeControl}</div>
        <div class="history-result ${resultClass}">${resultText} as ${game.playerColor}</div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          ${game.analysis ? `${game.analysis.keyMoments.length} key moments found` : 'Analyzing...'}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Add click listeners to history items
  container.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'));
      loadHistoricalGame(index);
    });
  });
}

// Load and display a historical game
function loadHistoricalGame(index) {
  const game = gameHistory[index];
  if (game && game.analysis) {
    currentAnalysis = game.analysis;
    displayAnalysis(currentAnalysis);
    
    // Scroll to top
    document.querySelector('.container').scrollTop = 0;
    
    // Hide history
    document.getElementById('historyList').classList.add('hidden');
    document.getElementById('viewHistoryBtn').textContent = 'View Game History';
  }
}

// Show status message
function showStatus(message) {
  const statusDiv = document.getElementById('status');
  const analysisDiv = document.getElementById('analysis');
  
  if (statusDiv) {
    statusDiv.innerHTML = `<p>${message}</p>`;
    statusDiv.classList.remove('hidden');
  }
  
  if (analysisDiv) {
    analysisDiv.classList.add('hidden');
  }
}

// Hide status message
function hideStatus() {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.classList.add('hidden');
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'NEW_ANALYSIS_AVAILABLE') {
    loadLatestAnalysis();
  }
});
