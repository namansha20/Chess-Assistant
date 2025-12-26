# Privacy Policy for Chess.com Game Review Assistant

**Last Updated:** December 26, 2025

## Overview

Chess.com Game Review Assistant is a browser extension that analyzes your Chess.com games locally in your browser. We are committed to protecting your privacy.

## Data Collection

**We DO NOT collect, store, or transmit any personal data to external servers.**

All game analysis happens entirely in your local browser. No data leaves your device.

## What Data is Stored Locally

The extension stores the following data in your browser's local storage (Chrome Storage API):

1. **Game Data:**
   - PGN notation (chess moves)
   - Player color (White/Black)
   - Time control
   - Game result (Win/Loss/Draw)
   - Game timestamp
   - Chess.com game URL

2. **Analysis Results:**
   - Move quality assessments
   - Pattern detection data
   - Coach summary text
   - Focus areas
   - Key moments

3. **Game History:**
   - Up to 50 most recent analyzed games
   - Pattern occurrence counts

## How Local Data is Used

This locally stored data is used only to:
- Display your game analysis
- Track patterns across your games
- Show your game history
- Provide personalized improvement suggestions

## Data Storage Location

All data is stored using the Chrome Storage API in your browser's local storage. This means:

- ✅ Data never leaves your computer
- ✅ Data is not transmitted to any server
- ✅ Data is not accessible to extension developers
- ✅ Data is not shared with any third parties
- ✅ Data is not used for analytics or tracking

## Data Deletion

You can delete all stored data at any time by:

**Method 1: Uninstall Extension**
- Removes extension and all stored data
- Go to `chrome://extensions/` or `edge://extensions/`
- Click "Remove" on Chess.com Game Review Assistant

**Method 2: Clear Extension Data**
- Open browser settings
- Privacy and Security → Clear browsing data
- Select "Cookies and other site data"
- Choose time range "All time"
- Click "Clear data"

**Method 3: Use Chrome Storage API**
- Open DevTools (F12)
- Go to Application → Storage → Local Storage
- Find extension storage and clear manually

## Third-Party Services

### Chess.com Access

The extension requires access to Chess.com (https://www.chess.com/*) to:
- Detect when your games end
- Extract publicly visible game data from your own games
- Read move information from the game board

**Important:** The extension only accesses data from games you are playing. It does not access other users' private data.

### No External Services

The extension does NOT use:
- ❌ External analytics services (no Google Analytics, etc.)
- ❌ Crash reporting services
- ❌ Advertising networks
- ❌ Social media integrations
- ❌ External APIs or servers
- ❌ Cookies for tracking
- ❌ User authentication services

## Permissions Explained

The extension requests the following permissions:

### storage
**Purpose:** Store game analysis locally in your browser
**Data Stored:** Game history and analysis results
**Location:** Your browser's local storage only

### activeTab
**Purpose:** Access the current Chess.com tab when you click the extension
**Scope:** Only when you interact with the extension
**Data Accessed:** Game data from the current tab only

### scripting
**Purpose:** Inject content script to detect games on Chess.com
**Scope:** Only on Chess.com pages
**Data Accessed:** Game move data and result information

### host_permissions (chess.com)
**Purpose:** Monitor Chess.com pages for game completion
**Scope:** Only chess.com domain
**Data Accessed:** Publicly visible game information

## Data Security

Since all data is stored locally:
- Data is protected by your browser's security measures
- Data is protected by your operating system's security
- No risk of server breaches (no servers used)
- No risk of data interception (no transmission)

## Children's Privacy

This extension does not knowingly collect data from anyone. All processing is local. However, Chess.com has its own age requirements. Please ensure you meet Chess.com's terms of service.

## Open Source

This extension is open source. You can review the complete source code at:
https://github.com/namansha20/Chess-Assistant

This allows independent security audits and verification of our privacy claims.

## Changes to Privacy Policy

We may update this privacy policy from time to time. We will notify users of any material changes by:
- Updating the "Last Updated" date
- Including information in extension update notes
- Posting updates on our GitHub repository

## Your Rights

Under various privacy laws (GDPR, CCPA, etc.), you have rights regarding your data:

✅ **Right to Access:** All your data is visible in the extension popup and stored locally where you can access it directly

✅ **Right to Delete:** You can delete all data by uninstalling the extension or clearing browser storage

✅ **Right to Portability:** Your data is stored in standard formats (JSON) in Chrome Storage API

✅ **Right to Object:** You can stop data processing at any time by disabling or uninstalling the extension

Since no data is sent to us, there is nothing to request from us.

## Contact Information

For privacy concerns or questions:

**GitHub Issues:** https://github.com/namansha20/Chess-Assistant/issues
**Repository:** https://github.com/namansha20/Chess-Assistant

## Compliance

This extension is designed to comply with:
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Chrome Web Store Privacy Policy Requirements
- Microsoft Edge Add-ons Privacy Requirements

## Summary

**In simple terms:**
- We don't collect your data
- Everything happens on your computer
- Nothing is sent to servers
- You can delete everything anytime
- Your privacy is fully protected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**This extension is privacy-first by design.**

We believe your chess games and improvement journey should be private. That's why we built everything to work locally, with zero data collection.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chess.com Game Review Assistant
Version 1.0.0
December 26, 2025
