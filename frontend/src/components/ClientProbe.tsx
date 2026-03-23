"use client";

import { useEffect, useState } from "react";

export default function ClientProbe() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("CLIENT PROBE MOUNTED");
  }, []);

  return (
    <div className="p-8">
      <button
        type="button"
        onClick={() => {
          console.log("BUTTON CLICKED");
          setCount((c) => c + 1);
        }}
        className="border px-4 py-2"
      >
        Count: {count}
      </button>
    </div>
  );
}