"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
  import { VersionSwitcher } from "@/components/version-switcher"
import { Button } from "./ui/button"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"



export function AppSidebar() {
  
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const [team,setteams] = useState([]);
  const data = {
    team
  }

    if (!isLoaded) {
      return <div>Loading...</div>
    }
  
    if (!userId) {
      // You could also add a redirect to the sign-in page here
      return <div>Sign in to view this page</div>
    }

  async function getteams(){
    const response = await axios.post(`${BACKEND_URL}/teams`,{
      userId:userId
    })

    setteams(response.data.teamNames)
  }



    return (
      <Sidebar>
        <SidebarHeader className="bg-black text-white">
        <VersionSwitcher
          versions={data.team}
          defaultVersion={data.team[0]}
        />
        </SidebarHeader>
        <SidebarContent className="bg-black text-white">
          <SidebarGroup>
          </SidebarGroup>
            <Button className="bg-white text-black font-bold mx-3 hover:bg-slate-200 w-55" onClick={()=>{
              getteams()
            }}>Fetch Teams</Button>
            <a href="/dashboard/team"><Button className="bg-white text-black font-bold mx-3 hover:bg-slate-200 w-55">Create team</Button></a>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="bg-black text-white"></SidebarFooter>
      </Sidebar>
    )
  }
  