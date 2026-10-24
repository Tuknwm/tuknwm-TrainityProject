"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomScrollbar() {
  const thumbRef = useRef(null);
  const [thumbH, setThumbH] = useState(0);
  const [thumbY, setThumbY] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const ratio = clientHeight / scrollHeight;
      if (ratio >= 1) { setVisible(false); return; }
      setThumbH(Math.max(ratio * clientHeight, 40));
      setThumbY((scrollTop / (scrollHeight - clientHeight)) * (clientHeight - Math.max(ratio * clientHeight, 40)));
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 1200);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(timerRef.current);
    };
  }, []);

  const dragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  const onMouseDown = (e) => {
    dragging.current = true;
    startY.current = e.clientY;
    startScroll.current = document.documentElement.scrollTop;
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const { scrollHeight, clientHeight } = document.documentElement;
      const dy = e.clientY - startY.current;
      const scrollRange = scrollHeight - clientHeight;
      const trackRange = clientHeight - thumbH;
      document.documentElement.scrollTop = startScroll.current + (dy / trackRange) * scrollRange;
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [thumbH]);

  return (
    <div style={{ position: "fixed", right: "4px", top: 0, bottom: 0, width: "5px", zIndex: 9999, pointerEvents: "none" }}>
      <div
        ref={thumbRef}
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          right: 0,
          width: "5px",
          height: `${thumbH}px`,
          top: `${thumbY}px`,
          background: "rgba(255,255,255,0.70)",
          borderRadius: "99px",
          cursor: "grab",
          pointerEvents: "auto",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
