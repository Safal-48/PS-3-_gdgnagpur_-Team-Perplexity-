import React, { useEffect, useRef } from 'react';

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
}

export const FloatingLeaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: LeafParticle[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse tracker
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.vx = (e.clientX - mouse.lastX) * 0.05;
      mouse.vy = (e.clientY - mouse.lastY) * 0.05;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial particles
    const particleCount = 20;
    const colors = [
      'rgba(16, 185, 129, ', // Emerald
      'rgba(52, 211, 153, ', // Light emerald
      'rgba(5, 150, 105, ',  // Deep emerald
      'rgba(110, 231, 183, ', // Mint
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 8,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.8 + 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() * 0.02 - 0.01) * 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.01 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Draw bezier leaf
    const drawLeaf = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      angle: number,
      opacity: number,
      colorPrefix: string
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.beginPath();
      
      // Draw standard leaf shape using bezier curves
      context.moveTo(0, -size / 2);
      context.bezierCurveTo(size / 2, -size / 4, size / 2, size / 4, 0, size / 2);
      context.bezierCurveTo(-size / 2, size / 4, -size / 2, -size / 4, 0, -size / 2);
      
      // Add stem
      context.moveTo(0, size / 2);
      context.lineTo(0, size / 2 + size / 4);

      context.fillStyle = `${colorPrefix}${opacity})`;
      context.fill();

      // Leaf center line
      context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, -size / 2);
      context.lineTo(0, size / 2);
      context.stroke();

      context.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      // Decay velocities
      mouse.vx *= 0.95;
      mouse.vy *= 0.95;

      particles.forEach((p) => {
        // Move with mouse wind effect
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          // Attract/Repel depending on proximity
          const force = (200 - dist) / 200;
          p.speedX += mouse.vx * force * 0.2;
          p.speedY += mouse.vy * force * 0.2;
        }

        // Apply normal speeds
        p.x += p.speedX;
        p.y += p.speedY;

        // Apply background drift force
        p.x += Math.sin(p.wobble) * 0.2;
        p.wobble += p.wobbleSpeed;

        // Apply rotation
        p.angle += p.spin;

        // Bounds check - reset at top if goes below bottom
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.speedY = Math.random() * 0.8 + 0.4;
          p.speedX = Math.random() * 0.5 - 0.25;
        }
        // Bounds check - wrap horizontally
        if (p.x > canvas.width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = canvas.width + 20;
        }

        drawLeaf(ctx, p.x, p.y, p.size, p.angle, p.opacity, p.color);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
