import WebSocket from "ws";
import { WebSocketServer } from "ws"
const wss = new WebSocketServer({ port:8080 });
import {client} from "@repo/database/dbclient"

const users:any = []

wss.on("connection",function connection(ws){

    users.push({
        ws,
        room:[]
    })

    /*
        data : {
            inst(instruction):"join_room",
            fileId:"fileName"
        }
    */
    
    ws.on("message",async function message(data){
        const parsedData = JSON.parse(data as unknown as string)

        if(parsedData.inst === "join_room"){
            const user = users.find((x: { ws: WebSocket; }) => x.ws === ws);
            user.room.push(parsedData.fileId)

        }

        if(parsedData.inst === "leave_room"){
            const user = users.find((x:{ws:WebSocket}) => x.ws === ws)
            user.room.filter((x: any) => x === parsedData.fileId)
        }

        if(parsedData.inst === "shape"){
            const roomId = parsedData.roomId
            const dimension = parsedData.dimension

            // when user creates a new shape in frontend then msg is send to webSocket Backend along with shape dimension
            // WS backend creates new shape in DB and broadcast the shape to all user connected to that room 

           try{
            await client.shape.create({
                data:{
                    data:dimension,
                    fileId:roomId
                }
            })
           }
           catch(error:any){
                console.log(error.message)
           }

            users.forEach((user: { room: string | any[]; ws: { send: (arg0: string) => void; }; }) => {
                if(user.room.includes(roomId)){   // includes cheack if roomId present in room[]
                    user.ws.send(JSON.stringify({
                        inst:"shape",
                        dimension:dimension,
                        roomId
                    }))
                }    
            })
        }
    })

})