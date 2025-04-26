// draw.ts - Refactored version
"use client"
import { useselecteTool } from "@/atom/selectedTool"
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
} | {
    type:'line',
    x1: number,
    x2: number,  
    y1: number,
    y2:number,
    lineThickness: number
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
        }else if(shape.type === "line"){
            var steep = (Math.abs(shape.y2 - shape.y1) > Math.abs(shape.x2 - shape.x1));
            if (steep){
                var x = shape.x1;
                shape.x1 = shape.y1;
                shape.y1 = x;
    
                var y = shape.y2;
                shape.y2 = shape.x2;
                shape.x2 = y;
            }
            if (shape.x1 > shape.x2) {
                var x = shape.x1;
                shape.x1 = shape.x2;
                shape.x2 = x;
    
                var y = shape.y1;
                shape.y1 = shape.y2;
                shape.y2 = y;
            }
    
            var dx = shape.x2 - shape.x1,
                dy = Math.abs(shape.y2 - shape.y1),
                error = 0,
                de = dy / dx,
                yStep = -1,
                y = shape.y1;
    
            if (shape.y1 < shape.y2) {
                yStep = 1;
            }
    
            shape.lineThickness = 5 - Math.sqrt((shape.x2 - shape.x1) *(shape.x2-shape.x1) + (shape.y2 - shape.y1) * (shape.y2-shape.y1))/10;
            if(shape.lineThickness < 1){
                shape.lineThickness = 1;   
            }
    
            for (var x = shape.x1; x < shape.x2; x++) {
                if (steep) {
                    ctx.fillStyle = "rgba(255,255,255)";
                    ctx.fillRect(y, x, shape.lineThickness , shape.lineThickness );
                } else {
                    ctx.fillStyle = "rgba(255,255,255)";
                    ctx.fillRect(x, y, shape.lineThickness , shape.lineThickness );
                }
    
                error += de;
                if (error >= 0.5) {
                    y += yStep;
                    error -= 1.0;
                }
            }
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
    //@ts-ignore
    const { selectedTool } =  useselecteTool()
    console.log(selectedTool)

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
        let lineThickness = 1;
        
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
            
            //@ts-ignore
            let shape:Shape = null
            if(selectedTool == 'rect'){
                shape = {
                    type: "rect",
                    x: startX,
                    y: startY,
                    width: width,
                    height: height
                };
            } else if(selectedTool == "circle"){
                const radius = Math.max(width,height) / 2
                shape = {
                    type:'circle',
                    radius:Math.max(width,height),
                    centerX: startX + radius,
                    centerY: startY + radius
                }
            }else if(selectedTool == "line"){
                shape = {
                    type:'line',
                    x1: e.clientX,
                    x2: startX,
                    y1: e.clientY,
                    y2: startY,
                    lineThickness: lineThickness
                }
            }

            if(!shape) return
            
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

            if(selectedTool == "rect"){
                ctx.strokeRect(startX, startY, width, height);
            }
            else if(selectedTool == "circle"){
                const radius = Math.max(width,height) / 2
                const centerX = startX + radius
                const centerY = startY + radius
                ctx.beginPath()
                ctx.arc(centerX,centerY,radius,0,Math.PI * 2)
                ctx.stroke()
                ctx.closePath()
            }
            else if(selectedTool == "line"){
                let x1 = e.clientX
                let x2 = startX
                let y1 = e.clientY
                let y2 = startY

                var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
                if (steep){
                    var x = x1;
                    x1 = y1;
                    y1 = x;
        
                    var y = y2;
                    y2 = x2;
                    x2 = y;
                }
                if (x1 > x2) {
                    var x = x1;
                    x1 = x2;
                    x2 = x;
        
                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }
        
                var dx = x2 - x1,
                    dy = Math.abs(y2 - y1),
                    error = 0,
                    de = dy / dx,
                    yStep = -1,
                    y = y1;
        
                if (y1 < y2) {
                    yStep = 1;
                }
        
                lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
                if(lineThickness < 1){
                    lineThickness = 1;   
                }
        
                for (var x = x1; x < x2; x++) {
                    if (steep) {
                        ctx.fillStyle = "rgba(255,255,255)";
                        ctx.fillRect(y, x, lineThickness , lineThickness );
                    } else {
                        ctx.fillStyle = "rgba(255,255,255)";
                        ctx.fillRect(x, y, lineThickness , lineThickness );
                    }
        
                    error += de;
                    if (error >= 0.5) {
                        y += yStep;
                        error -= 1.0;
                    }
                }
            }
            
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