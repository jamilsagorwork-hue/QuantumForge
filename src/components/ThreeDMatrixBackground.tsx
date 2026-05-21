import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  color: string;
}

export default function ThreeDMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localWidth = (canvas.width = window.innerWidth);
    let localHeight = (canvas.height = window.innerHeight);

    const nodes: Node[] = [];
    const count = 75;
    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#f472b6"];

    // Initialize 3D points
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 1000 + 100,
        px: 0,
        py: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - localWidth / 2) * 0.4;
      targetMouseY = (e.clientY - localHeight / 2) * 0.4;
    };

    const handleResize = () => {
      localWidth = canvas.width = window.innerWidth;
      localHeight = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const focalLength = 350;
    let animationId = 0;

    const render = () => {
      ctx.clearRect(0, 0, localWidth, localHeight);

      // Create a background radial mesh grid lines
      ctx.strokeStyle = "rgba(17, 24, 39, 0.25)";
      ctx.lineWidth = 0.5;
      
      // Smooth lerp mouse coordinates
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Render futuristic grid horizon
      const centerX = localWidth / 2;
      const centerY = localHeight / 2;

      // Update and project 3D coordinates
      nodes.forEach((node) => {
        // Slowly float nodes outward in Z (depth)
        node.z -= 1.2;
        if (node.z <= 0) {
          node.z = 1000;
          node.x = (Math.random() - 0.5) * 1600;
          node.y = (Math.random() - 0.25) * 1200;
        }

        // Apply mouse inertia rotations around center 
        const rotatedX = node.x - mouseX * (node.z / 1000);
        const rotatedY = node.y - mouseY * (node.z / 1000);

        // Standard perspective division
        const scale = focalLength / (focalLength + node.z);
        const projX = centerX + rotatedX * scale;
        const projY = centerY + rotatedY * scale;

        node.px = projX;
        node.py = projY;

        // Visual density gradient based on proximity/depth
        const size = Math.max(0.5, scale * 6);
        const alpha = Math.min(1, scale * 1.5);

        ctx.fillStyle = node.color;
        ctx.globalAlpha = alpha * 0.45;
        
        // Draw connected core
        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw outer technical energy rings
        if (scale > 0.6) {
          ctx.strokeStyle = node.color;
          ctx.globalAlpha = alpha * 0.15;
          ctx.beginPath();
          ctx.arc(projX, projY, size * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw vector linking web wires between close nodes
      ctx.globalAlpha = 0.12;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].px - nodes[j].px;
          const dy = nodes[i].py - nodes[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            // Draw connecting line with gradient match
            const grad = ctx.createLinearGradient(
              nodes[i].px,
              nodes[i].py,
              nodes[j].px,
              nodes[j].py
            );
            grad.addColorStop(0, nodes[i].color);
            grad.addColorStop(1, nodes[j].color);
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(nodes[i].px, nodes[i].py);
            ctx.lineTo(nodes[j].px, nodes[j].py);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      id="three-d-matrix-bg"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-slate-950"
    />
  );
}
