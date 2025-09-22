import React, { useEffect, useRef } from "react";

export default function Bg({
     shardCount = 40,
  maxSize = 60,
  minSize = 20,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Create shards
    const shards = Array.from({ length: shardCount }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * (maxSize - minSize) + minSize,
      dx: (Math.random() - 0.5) * 0.4, // slow drift
      dy: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      drot: (Math.random() - 0.5) * 0.002,
      hue: Math.floor(Math.random() * 360),
      alpha: Math.random() * 0.25 + 0.05,
    }));

    function drawShard(s) {
      const { x, y, size, rotation, hue, alpha } = s;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      // soft gradient fill for crystalline look
      const g = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      g.addColorStop(0, `hsla(${hue}, 80%, 70%, ${Math.max(0.02, alpha)})`);
      g.addColorStop(1, `hsla(${(hue + 60) % 360}, 80%, 60%, ${Math.max(0.02, alpha * 0.8)})`);
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.5);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size * 0.6);
      ctx.lineTo(-size * 0.5, 0);
      ctx.closePath();
      ctx.fill();

      // subtle stroke for edges
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.04, alpha)})`;
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      // black background (fully opaque) — keeps canvas consistent with page bg
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < shards.length; i++) {
        const s = shards[i];
        s.x += s.dx;
        s.y += s.dy;
        s.rotation += s.drot;

        // wrap-around to keep shards in view
        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = h + s.size;
        if (s.y > h + s.size) s.y = -s.size;

        drawShard(s);
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    // initial clear + start anim
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [shardCount, maxSize, minSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );

}
