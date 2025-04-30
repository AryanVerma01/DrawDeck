"use client"
import { useselecteTool } from "@/atom/selectedTool"
import { useDrawing } from "@/draw"
import { RedirectToSignIn, useAuth } from "@clerk/nextjs"
import { ArrowRight, Circle, Diamond, LucideRectangleHorizontal, Pencil } from "lucide-react"
import { use, useEffect, useRef , useState } from "react";

export default function FilePage({params}:{
    params:{
        fileName:string    
    }
}){
    //@ts-ignore
    const {fileName} = use(params) 
    const fileId = fileName
    //@ts-ignore
    const { selectedTool,setSelectedTool } = useselecteTool()

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

    const {isLoaded , isSignedIn , userId} = useAuth();

    if(!isLoaded){
        return <div>Loading ...</div>
    }
    
    if(!isSignedIn){
        return <div>
            Please Signin to access the File
            <RedirectToSignIn/>
        </div>
    }

    return (
        <div className="relative h-screen w-full">
            <canvas
                ref={canvasRef}
                width="1536"
                height="775"
            ></canvas>
            <div className="flex bg-black w-40 h-10 mx-auto justify-around absolute top-10 right-172 rounded-2xl border-2">
                <button onClick={()=>{
                    setSelectedTool("circle")
                }}><Circle className={`${ selectedTool == "circle" ? `text-red-500` :`text-white`}`}/></button>
                <button onClick={()=>{ 
                    setSelectedTool("rect")
                }}><LucideRectangleHorizontal  className={` ${ selectedTool == "rect"? `text-red-500` : `text-white`}`}/></button>
                <button onClick={()=>{
                    setSelectedTool("diamond")
                }}><Diamond className={`${ selectedTool == "diamond" ? `text-red-500` : `text-white`}`}/></button>
                <button onClick={()=>{
                    setSelectedTool("line")
                }}><Pencil className={`${ selectedTool == "line" ? `text-red-500` : `text-white`}`}/></button>
            </div>
        </div>
    );
}