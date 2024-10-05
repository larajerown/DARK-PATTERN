chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "DARK_PATTERNS_DETECTED") {
      console.log("Dark patterns detected on:", sender.tab.url);
      console.log("Patterns:", message.patterns);
  
      // You can add code here to show notifications or log the results.
    }
  });
  