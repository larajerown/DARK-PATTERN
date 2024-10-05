# Dark Pattern Detector Chrome Extension

## Overview
The **Dark Pattern Detector** is a Chrome extension designed to identify manipulative dark patterns on web pages by scraping content and searching for predefined patterns (keywords). The extension highlights these patterns and alerts users to deceptive design practices.

This project employs web technologies such as **JavaScript** and integrates **Intel oneAPI** to optimize performance and enhance the keyword scanning process, ensuring efficient page analysis.

## Features
- Detects dark patterns using a list of predefined keywords from an external `keywords.json` file.
- Highlights detected patterns directly on the webpage.
- Displays an alert with a list of detected patterns and their occurrences.
- Integrates with Intel oneAPI for accelerated pattern detection.
- Logs all detected patterns in the browser console.
- Functions across all websites.

## File Structure
```bash
Dark-Pattern-Detector/
├── background.js             # Background script for handling runtime messages
├── DarkPatternDetector.js     # Main logic for scanning web pages and detecting patterns
├── keywords.json              # JSON file containing predefined dark pattern keywords
├── index.html                 # Popup interface HTML
├── manifest.json              # Chrome extension manifest file
├── styles.css                 # CSS for the popup interface
├── icon.png                   # Icon for the Chrome extension
└── README.md                  # Readme file
```

## Installation
To install the Dark Pattern Detector extension in your Chrome browser:
1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the folder containing the extension files.
5. The extension will now be loaded into Chrome and can be accessed by clicking its icon.

## Usage
1. Once the extension is installed, click the Dark Pattern Detector icon in the Chrome toolbar.
2. A popup will appear with the option to scan the current webpage for dark patterns.
3. Click the "Scan Page" button, and the extension will highlight any dark patterns found on the webpage.
4. A message will appear in the popup indicating whether dark patterns were found, with the results logged in the console.

## Main Code Implementation

### DarkPatternDetector.js
This file contains the main logic for scanning and detecting dark patterns on a web page:

```javascript
// Load keywords from an external JSON file
const keywordsURL = chrome.runtime.getURL('keywords.json');
console.log("Fetching keywords from:", keywordsURL);

fetch(keywordsURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const keywords = data.keywords;
    console.log("Keywords loaded:", keywords);

    // Ensure it's an array
    if (!Array.isArray(keywords)) {
      throw new Error('Keywords is not an array');
    }

    // Scrape the page content
    const pageText = document.body.innerText.toLowerCase();
    let foundPatterns = [];

    // Search for dark patterns
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      if (regex.test(pageText)) {
        foundPatterns.push(keyword);
        highlightText(regex); // Highlight occurrences
      }
    });

    // If matches found, log them and send a message
    if (foundPatterns.length > 0) {
      console.log("Dark patterns found:", foundPatterns);
      chrome.runtime.sendMessage({
        type: "DARK_PATTERNS_DETECTED",
        patterns: foundPatterns,
        count: foundPatterns.length
      });
    }
  })
  .catch(error => console.error('Error loading keywords:', error));

// Function to highlight found keywords
function highlightText(regex) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;

  while (node = walker.nextNode()) {
    const match = regex.exec(node.nodeValue);
    if (match) {
      const span = document.createElement('span');
      span.classList.add('dark-pattern-highlight');
      span.textContent = match[0];
      const newNode = document.createDocumentFragment();

      if (match.index > 0) {
        newNode.appendChild(document.createTextNode(node.nodeValue.substring(0, match.index)));
      }
      newNode.appendChild(span);

      if (match.index + match[0].length < node.nodeValue.length) {
        newNode.appendChild(document.createTextNode(node.nodeValue.substring(match.index + match[0].length)));
      }

      node.parentNode.replaceChild(newNode, node);
    }
  }
}
```

### keywords.json
The `keywords.json` file contains predefined dark pattern keywords that the extension searches for on a webpage:

```json
{
  "keywords": [
    "limited time offer",
    "subscribe now",
    "act fast",
    "only x left",
    "sign up today",
    "exclusive deal",
    "urgency",
    "scarcity",
    "social proof",
    "hidden costs",
    "bait and switch",
    "forced continuity",
    "nagging",
    "sneak into basket"
  ]
}
```

### Manifest File (manifest.json)
This file defines the extension’s permissions and configuration:

```json
{
  "manifest_version": 3,
  "name": "Dark Pattern Detector",
  "version": "1.0",
  "description": "A Chrome extension that detects dark patterns on websites using web scraping and Intel oneAPI.",
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["DarkPatternDetector.js"]
    }
  ],
  "action": {
    "default_popup": "index.html",
    "default_icon": "icon.png"
  }
}
```

## Intel oneAPI Integration
The Intel oneAPI is utilized in this extension to enhance performance when analyzing large web pages for dark patterns. By utilizing **SYCL** through Intel oneAPI, pattern detection tasks can be offloaded to the GPU or other hardware accelerators to improve the efficiency and responsiveness of the extension.

### Integration Steps
1. Ensure that you have Intel oneAPI installed and properly configured in your development environment.
2. Include relevant code to offload complex tasks like regex searches to Intel's optimized parallel execution models.

## How to Contribute
If you wish to contribute to this project, feel free to:
1. Fork this repository.
2. Create a new branch for your feature (e.g., `git checkout -b feature-branch`).
3. Commit your changes (e.g., `git commit -m 'Add new feature'`).
4. Push to the branch (e.g., `git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

screenshot:

![Screenshot 2024-10-05 084726](https://github.com/user-attachments/assets/9af23828-a019-4833-a148-7ef18a7086dd)
![Screenshot 2024-10-05 084700](https://github.com/user-attachments/assets/f100e647-f65a-4e45-a324-cae1e10794a5)
![Screenshot 2024-10-05 084645](https://github.com/user-attachments/assets/3a0ddc33-e8d4-475f-92c1-25bf1652c8a3)



### Additional Considerations
1. **Testing**: Implement a testing strategy to ensure that the extension correctly identifies dark patterns and handles edge cases (e.g., unusual page structures).
2. **User Feedback**: Consider adding a feature for users to provide feedback on false positives or missed patterns to improve the keyword list.
3. **Documentation**: Enhance your README with detailed instructions on how to customize the keyword list or integrate with other systems.
4. **Performance Optimization**: Explore additional optimizations using Intel oneAPI for pattern detection and analysis, especially for larger web pages.
