// Load keywords from an external JSON file
const keywordsURL = chrome.runtime.getURL('keywords.json');
console.log("Fetching keywords from:", keywordsURL); // Debugging log

fetch(keywordsURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const keywords = data.keywords; // Access the array of keywords
    console.log("Keywords loaded:", keywords); // Debugging log

    // Ensure it's an array
    if (!Array.isArray(keywords)) {
      throw new Error('Keywords is not an array');
    }

    // Scrape the page content
    const pageText = document.body.innerText.toLowerCase();
    let foundPatterns = [];

    // Search for dark patterns
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi'); // Case insensitive matching
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
        count: foundPatterns.length // Send the count of found patterns
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
      span.classList.add('dark-pattern-highlight'); // Class for highlighting
      span.textContent = match[0]; // Highlighted text
      const newNode = document.createDocumentFragment();

      // Split the text node
      if (match.index > 0) {
        newNode.appendChild(document.createTextNode(node.nodeValue.substring(0, match.index)));
      }
      newNode.appendChild(span);

      // Append any remaining text after the match
      if (match.index + match[0].length < node.nodeValue.length) {
        newNode.appendChild(document.createTextNode(node.nodeValue.substring(match.index + match[0].length)));
      }

      // Replace the original node with the new content
      node.parentNode.replaceChild(newNode, node);
    }
  }
}

