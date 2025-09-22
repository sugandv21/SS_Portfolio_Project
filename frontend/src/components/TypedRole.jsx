import { useEffect, useState } from "react";

export default function TypedRole({ roles = [], typingSpeed = 80, pause = 1200 }) {
  const [idx, setIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!roles.length) return;
    const timeout = setTimeout(() => {
      setSubIdx((s) => s + (reverse ? -1 : 1));
    }, reverse ? typingSpeed / 2 : typingSpeed);

    if (!reverse && subIdx === roles[idx].length + 1) {
      setReverse(true);
      setTimeout(() => {}, pause);
    } else if (reverse && subIdx === 0) {
      setReverse(false);
      setIdx((i) => (i + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [subIdx, idx, reverse, roles, typingSpeed, pause]);

  useEffect(() => {
    const bl = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(bl);
  }, []);

  if (!roles.length) return null;
  return (
    <span className="text-lg">
      {roles[idx].slice(0, subIdx)}
      <span className="inline-block" style={{ width: "10px" }}>
        <span style={{ opacity: blink ? 1 : 0 }}>|</span>
      </span>
    </span>
  );
}
