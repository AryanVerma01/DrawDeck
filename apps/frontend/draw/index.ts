// draw.ts - Refactored version
"use client"
import axios from "axios"
import { useEffect, useState, useRef } from "react"

export type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
}

// Helper functions that don't use hooks
export function clearCanvas(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape) => {
        if (shape.type === 'rect') {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
}

export async function getExistingShapes(fileId: string): Promise<Shape[]> {
    try {
        console.log(fileId)
        const res = await axios.post("http://localhost:3001/shapes", {
            fileId: fileId
        });
        console.log(res);

        const data = res.data.shapes;

        if (!data || !Array.isArray(data)) {
            return [];
        }

        const shapes = data.map((x: { data: string }) => {
            try {
                const messageData = JSON.parse(x.data);
                return messageData;
            } catch (e) {
                console.error("Error parsing shape data:", e);
                return null;
            }
        }).filter(Boolean);
        
        return shapes;
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return [];
    }
}

// Custom hook for canvas drawing functionality
export function useDrawing(fileId: string, fileName: string) {
    const [shapes, setShapes] = useState<Shape[]>([]);   // when useState changes component get re-rendered
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const fileid = fileId
    
    // Initialize websocket
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        
        ws.onopen = () => {
            console.log("WebSocket Connected");
            setWebsocket(ws);
            
            ws.send(JSON.stringify({
                inst: "join_room",
                fileId: fileName
            }));
        };
        
        ws.onmessage = (event: { data: string }) => {
            try {
                const parsedData = JSON.parse(event.data);

                if (parsedData.inst === "shape") {
                    const parseShape = JSON.parse(parsedData.dimension);
                    setShapes(prevShapes => [...prevShapes, parseShape]);
                }
            } catch (e) {
                console.error("Error processing websocket message:", e);
            }
        };
        
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [fileName]);
    
    // Load existing shapes
    useEffect(() => {
        const loadShapes = async () => {
            const existingShapes = await getExistingShapes(fileid);
            setShapes(existingShapes);
        };
        
        loadShapes();
    }, [fileId]);
    
    // Setup canvas event handlers
    const setupCanvas = (canvas: HTMLCanvasElement) => {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Initial canvas setup
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw existing shapes
        clearCanvas(shapes, ctx, canvas);
        
        let clicked = false;
        let startX = 0;
        let startY = 0;
        
        const handleMouseDown = (e: MouseEvent) => {
            clicked = true;
            startX = e.clientX;
            startY = e.clientY;
            
            console.log(e.clientX, e.clientY);
        };
        
        const handleMouseUp = (e: MouseEvent) => {
            if (!clicked) return;
            
            clicked = false;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            
            const shape: Shape = {
                type: "rect",
                x: startX,
                y: startY,
                width: width,
                height: height
            };
            
            // Add shape locally
            setShapes(prevShapes => [...prevShapes, shape]);
            
            // Send shape via websocket
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(JSON.stringify({
                    inst: "shape",
                    dimension: JSON.stringify(shape),
                    roomId: fileId
                }));
            }
            
            console.log(e.clientX, e.clientY);
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!clicked) return;
            
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            
            // Redraw canvas
            clearCanvas(shapes, ctx, canvas);
            
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.strokeRect(startX, startY, width, height);
        };
        
        // Add event listeners
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);
        
        // Return cleanup function
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    };
    
    return { shapes, setupCanvas };
}