"use client"
import { initDraw } from "@/draw"
import { Circle, LucideRectangleHorizontal } from "lucide-react"
import { use, useEffect, useRef, useState } from "react"

export default function FilePage({params}:{
    params:{
        fileName:string    
    }
}){
    //@ts-ignore
    const {fileName} = use(params) 
    const fileId = fileName
    const [websocket,setwebsocket] = useState<WebSocket>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        const canvas = canvasRef.current;
        console.log(canvasRef.current)

        if(!canvas) return
        const ctx = canvas.getContext('2d');

        initDraw(canvas,ctx!,canvas.width,canvas.height,fileId,websocket)

    },[])

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () =>{
            console.log("WebSocket Connected")
            setwebsocket(ws)

            ws.send(JSON.stringify({
                inst:"join_room",
                fileId:fileName
            }))
        }
        
        ws.onmessage = (event) => {
            console.log(event)
        }
        
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }

    },[fileName])
    

    const sendShapeData = () => {
        if (websocket && websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({
                inst:"shape",
                fileId:fileName,
                dimension:"1234"
            }))
        } else {
            console.log("websocket is not present or not connected")
        }
    }
        
    return(
    <div>
        <canvas ref={canvasRef} width="1400" height="800">
        </canvas>
        <div className="flex bg-slate-500 w-40 h-8 mx-auto">
            <button className="mx-auto"><Circle></Circle></button>
            <button className="mx-auto"><LucideRectangleHorizontal/></button>
        </div>
        <button onClick={sendShapeData}>Send Shape Data</button>
    </div>)
}