"use client"
import { useDrawing } from "@/draw"
import { Circle, LucideRectangleHorizontal } from "lucide-react"
import { use, useEffect, useRef } from "react"

export default function FilePage({params}:{
    params:{
        fileName:string    
    }
}){
    //@ts-ignore
    const {fileName} = use(params) 
    const fileId = fileName
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setupCanvas } = useDrawing(fileId, fileName);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Get cleanup function from setupCanvas
        const cleanup = setupCanvas(canvas);
        
        // Call cleanup when component unmounts
        return cleanup;
    }, [setupCanvas]);

    return (
        <div>
            <canvas ref={canvasRef} width="1400" height="800">
            </canvas>
            <div className="flex bg-slate-500 w-40 h-8 mx-auto">
                <button className="mx-auto"><Circle /></button>
                <button className="mx-auto"><LucideRectangleHorizontal /></button>
            </div>
        </div>
    );
}