"use client"
import { ChartNoAxesColumnDecreasing } from "lucide-react"
import { stringify } from "querystring"
import { use, useEffect, useState } from "react"

export default function FilePage({params}:{
    params:{
        fileName:string    
    }
}){
    //@ts-ignore
    const {fileName} = use(params) 
    const [websocket,setwebsocket] = useState<WebSocket>();

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

    },[])

    websocket?.send(JSON.stringify({
        inst:"shape",
        fileId:fileName,
        dimension:"1234"
    }))

    if(!websocket){
        console.log("websocket is not present")
        return
    }

    websocket.onmessage = (event) => {
        console.log(event)
    }
    
    return(<div>
        {fileName}
    </div>)
}