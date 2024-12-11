import React, { useEffect, useState } from "react";

interface ClickData {
  timestamp: string;
  elementTag: string;
  elementId: string;
  elementClass: string;
  url: string;
  x: number;
  y: number;
  screenshot: string | null;
}

const App = () => {
  const [clicks, setClicks] = useState<ClickData[]>([]);
  console.log("Clicks", clicks);

  useEffect(() => {
    chrome.storage.local.get(["clicks"], (result) => {
      setClicks(result.clicks || []);
    });

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.clicks) {
        setClicks(changes.clicks.newValue);
      }
    });
  }, []);

  return (
    <div className="p-4 w-96">
      <h1 className="text-xl font-bold mb-4">Click Tracker</h1>
      <div className="max-h-96 overflow-y-auto">
        {clicks.length === 0 ? (
          <p className="text-gray-500">No clicks recorded yet</p>
        ) : (
          clicks.map((click, index) => (
            <div key={index} className="mb-4 p-2 border rounded">
              <p className="text-sm text-gray-600">
                {new Date(click.timestamp).toLocaleString()}
              </p>
              {/* <p>Element: {click.elementTag}</p>
              {click.elementId && <p>ID: {click.elementId}</p>}
              {click.elementClass && <p>Class: {click.elementClass}</p>} */}
              <p>URL: {click.url}</p>
              {/* <p>Clicks: {click.elementClass}</p> */}
              <p>
                Position: ({click.x}, {click.y})
              </p>
              <p className="text-sm truncate">{click.url}</p>
              {click.screenshot && (
                <img
                  src={click.screenshot}
                  alt="Screenshot"
                  className="mt-2 border"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
