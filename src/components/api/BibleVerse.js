import React, { useEffect, useState } from "react";

function BibleVerse() {
  const [verse, setVerse] = useState("Loading verse...");
  const [verseRef, setVerseRef] = useState("");

  const versesList = [
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

  useEffect(() => {
    const randomVerse = versesList[Math.floor(Math.random() * versesList.length)];

    const fetchVerse = async () => {
      try {
        const res = await fetch(`https://bible-api.com/${randomVerse}`);
        const data = await res.json();
        setVerse(data.text || "Stay faithful, stay inspired.");
        setVerseRef(data.reference || "");
      } catch (err) {
        console.error(err);
        setVerse("Stay faithful, stay inspired.");
        setVerseRef("");
      }
    };

    fetchVerse();
  }, [versesList]);

  return (
    <p className="mt-6 text-lg italic text-gray-600 dark:text-gray-300 max-w-lg">
      <span className="font-semibold">{verseRef}</span>: {verse}
    </p>
  );
}

export default BibleVerse;
