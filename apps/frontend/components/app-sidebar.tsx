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
import { TextShimmerWave } from "./motion-primitives/text-shimmer-wave"



export function AppSidebar() {
  
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const [loading,setloading] = useState<boolean>(true)
  const [team,setteams] = useState([]);
  const data = {
    team
  }
  
    if (!isLoaded) {
      return <div className='flex justify-center h-screen w-65 bg-black border-r-1'><div className='my-auto'><TextShimmerWave
          className='[--base-color:#FAF6E9] [--base-gradient-color:#FDFAF6] text-md'
          duration={1}
          spread={1}
          zDistance={1}
          scaleDistance={1.1}
          rotateYDistance={20}
        >
          Loading...
        </TextShimmerWave></div>
        </div>
    }
  
    if (!userId) {
      // You could also add a redirect to the sign-in page here
      return <div>Sign in to view this page</div>
    }

  async function getteams(){
    const response = await axios.post(`${BACKEND_URL}/teams`,{
      userId:userId
    })
    setloading(false)
    setteams(response.data.teamNames)
  }

  setTimeout(()=>getteams(),2*1000)
  
    return (
      <Sidebar>
        <SidebarHeader className="bg-gray-900 text-white">
        <VersionSwitcher
          versions={data.team}
          defaultVersion={data.team[0]}
        />
        </SidebarHeader>
        <SidebarContent className="bg-gray-900 text-white">
          <SidebarGroup>
          </SidebarGroup>
            <a href="/dashboard/team"><Button className="bg-white text-black font-bold mx-3 hover:bg-slate-200 w-55">Create team</Button></a>
            <a href="/"><Button className="bg-white text-black font-bold mx-3 hover:bg-slate-200 w-55">Home</Button></a>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="bg-gray-900 text-white"></SidebarFooter>
      </Sidebar>
    )
  }

  