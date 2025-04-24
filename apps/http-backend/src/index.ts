import express from "express"
import cors from "cors"
import { teamValidation } from "./validations/teamvalidation";
const app = express();
import { client } from "@repo/database/dbclient"
import { date } from "zod";
import { fileValidation } from "./validations/filevalidation";
import e from "express";

app.use(express.json())
app.use(cors())

app.post("/create/teams",async (req,res)=>{
    try{
        const parsedbody = teamValidation.safeParse(req.body);

        if(parsedbody.error){
            res.status(500).json({
                msg:"Error in Inputs" + parsedbody.error
            })
            return
        }
    
        const name = parsedbody.data.name.toString();
        const userId = parsedbody.data.userId.toString();
    
        const response = await client.team.create({
            data:{
                name:name,
                userid:userId
            }
        })
    
        res.status(200).json({
            msg:"New team Created",
            response
        })
    }
    catch(error:any){
        res.status(500).json({
            msg:"Team not Created" + error.message
        })
    }

})

app.post("/teams",async(req,res)=>{
    try{
        const userId = req.body.userId

        if(!userId) {
            res.json({
                msg:"UserId not recieved"
            })
            return
        }

        const teams = await client.team.findMany({
            where:{
                userid:userId
            }
        })
    
        let teamNames = []
    
        for(let i=0;i<teams.length;i++){
            teamNames.push(teams[i]?.name)
        }
    
        res.status(200).json({
            teamNames
        })
    }
    catch(error:any){
        res.status(500).json({
            msg:"Unable to fetch teams"+error.message
        })
    }
})

app.post("/create/file",async(req,res)=>{
    try{
        const parsedBody = fileValidation.safeParse(req.body);
    
        if(parsedBody.error){
            res.status(500).json({
                msg:"Invalid File Inputs" + parsedBody.error
            })
            return
        }
    
        const response = await client.file.create({
            data:{
                name:parsedBody.data.name,
                teamId:parsedBody.data.teamId
            }
        })
    
        res.status(200).json({
            response
        })
    }
    catch(error:any){
        res.status(500).json({
            msg:"Unable to create file" + error.message
        })
    }
})

app.post("/files",async(req,res)=>{
    try{
        const teamId = req.body.teamId

        if(!teamId){
            res.status(500).json({
                msg:"TeamID not recieved"
            })
            return
        }
    
        const files = await client.file.findMany({
            where:{
                teamId:teamId
            }
        })
    
        res.status(200).json({
            files
        })
    }
    catch(error){
        res.status(500).json({
            msg:"Unable to fetch files from DB"
        })
    }
})

app.get("/write/teamId",async(req,res)=>{
    try{
        //@ts-ignore
        const teamname:string = req.query.teamname;

        if(!teamname){
            res.status(500).json({
                msg:"Team Name not recieved"
            })
            return
        }
        
        const team = await client.team.findFirstOrThrow({
            where:{
                name:teamname
            }
        })

        res.status(200).json({
            teamId:team.id        
        })
    }
    catch(error){
        res.status(500).json({
            msg:"Unable from fetch teamId from DB"
        })
    }
})

app.post('/shapes',(req,res)=>{
    try{
        const fileId = req.body.fileId

        if(!fileId){
            res.json("fileId not recieved")
        }
    
        const shapes = client.shape.findMany({
            where:{
                fileId:fileId
            }
        })
    
        res.status(200).json({
            shapes
        })
    }
    catch(error:any){
        res.status(500).json({
            msg:"Unable to fetch shapes from backend"
        })
    }
})

app.listen(3001,()=>{
    console.log("HTTP Server running at port:3001")
})