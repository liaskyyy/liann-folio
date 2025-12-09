import React, { useEffect, useState } from "react";

// 1. Move the list OUTSIDE the component so it doesn't trigger re-renders
const VERSES_LIST = [
  "john 3:16",
  "psalm 23:1",
  "philippians 4:13",
  "proverbs 3:5",
  "romans 8:28",
  "isaiah 41:10",
  "jeremiah 29:11",
  "matthew 5:16",
  "ephesians 2:10",
];

function BibleVerse() {
  const [verse, setVerse] = useState("Loading verse...");
  const [verseRef, setVerseRef] = useState("");

  useEffect(() => {
    const fetchVerse = async () => {
      // 2. Pick a random verse inside the effect
      const randomVerse = VERSES_LIST[Math.floor(Math.random() * VERSES_LIST.length)];

      try {
        const res = await fetch(`https://bible-api.com/${randomVerse}`);
        const data = await res.json();
        
        // Clean up the text (remove newlines if necessary)
        setVerse(data.text.trim()); 
        setVerseRef(data.reference);
      } catch (err) {
        console.error("Error fetching verse:", err);
        setVerse("Stay faithful, stay inspired.");
        setVerseRef("");
      }
    };

    fetchVerse();
  }, []); // 3. Empty dependency array ensures this runs exactly once on refresh/mount

  return (
    <p className="mt-6 text-lg italic text-gray-600 dark:text-gray-300 max-w-lg">
      <span className="font-semibold text-[#3246ea]">{verseRef}</span> 
      {verseRef && ": "} 
      {verse}
    </p>
  );
}

export default BibleVerse;