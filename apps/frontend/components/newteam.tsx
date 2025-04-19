"use client"
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useAuth } from "@clerk/clerk-react";

export default function TeamForm(){

    const [teamname,setteamname] = useState("");
    const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

    if (!isLoaded) {
      return <div>Loading...</div>
    }
  
    if (!isSignedIn) {
      // You could also add a redirect to the sign-in page here
      return <div>Not signed In</div>
    }


   return(
    <div className="bg-black h-screen w-320 flex">
        <div className="border h-80 w-90 rounded-4xl mx-auto my-auto">
            <div className="my-20">
                <div className="text-white font-bold text-3xl my-4 text-center mx-20 ">
                    Enter your Team's Name
                </div>
                <Input type="text" placeholder="team's name" className="w-60 mx-15 my-8 text-center text-white font-bold" onChange={(e)=>{setteamname(e.target.value)}}></Input>
                <Button className="bg-white text-black font-bold mx-33" onClick={async()=>{
                    const response = await axios.post("http://localhost:3001/create/teams",{
                        name:teamname,
                        userId
                    })
                    console.log(response)
                }}>Submit</Button>
            </div>  
        </div>
    </div>
   ) 
}