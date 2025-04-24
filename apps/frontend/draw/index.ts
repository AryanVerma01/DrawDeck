import axios from "axios"
import { Socket } from "dgram"
import { X } from "lucide-react"
import { stringifyCookie } from "next/dist/compiled/@edge-runtime/cookies"

type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
}


export async function initDraw(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,width:number,height:number,fileId:string,websocket:WebSocket|undefined){
    let existingShapes:Shape[] = await getExistingShapes(fileId)

    clearCanvas(existingShapes,ctx,canvas)

// Socket send newly created shape to all users in connected to websocket server


    websocket!.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)

        if(parsedData.inst == "shape"){
            const parseShape = JSON.parse(parsedData.dimension)
            existingShapes.push(parseShape)
            clearCanvas(existingShapes,ctx,canvas)
        }
    }
    
    if(!ctx) return
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,width,height)
    
    let clicked = false
    let startX = 0
    let startY = 0

    canvas.addEventListener("mousedown",(e)=>{
        clicked = true
        startX = e.clientX
        startY = e.clientY

        console.log(e.clientX)
        console.log(e.clientY)
    })

    canvas.addEventListener("mouseup",(e)=>{
        clicked = false

        const width = e.clientX - startX
        const height = e.clientY -startY

        const shape:Shape = {
            type:"rect",
            x:startX,
            y:startY,
            width:width,
            height:height
        }
        existingShapes.push(shape);

        websocket.send(JSON.stringify({
            inst:shape,
            dimension:shape,
            roomId:fileId
        }))

        console.log(e.clientX)
        console.log(e.clientY)
    })

    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const width = e.clientX - startX 
            const height = e.clientY - startY


            clearCanvas(existingShapes,ctx,canvas)

            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(startX,startY,width,height)
        }
    })

}

function clearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement){

    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    existingShapes.map((shape)=>{
        if(shape.type === 'rect'){
            ctx.strokeStyle = "rgba(255,255,255)"
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
    })

}

async function getExistingShapes(fileId:string){
    const res = await axios.post("http://localhost:3001/shapes",{
        fileId:fileId
    })

    const data = res.data.data;  // get shapesdimesion

    const shapes = data.map((x: {data:string})=>{
        const messageData = JSON.parse(x.data)
        return messageData
    })
    
    return shapes
}