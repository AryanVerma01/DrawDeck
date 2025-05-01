"use client"

import { Input } from '@mui/material';
import { useState, useEffect, Usable } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/config';
import { use } from "react"
import Link from 'next/link';
import { RedirectToSignIn, useAuth } from '@clerk/nextjs';
import React from 'react';
import { TextShimmerWave } from '@/components/motion-primitives/text-shimmer-wave';

type PageProps = {
  params: {
    selectedVersion: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined | Promise<any> };
}

interface FileItem {
  id: string;
  name: string;
  teamId: string;
  createdAt: string;
}

export default function Dashboard({ params }: PageProps) {
  
  //@ts-ignore
  const { selectedVersion } = use(params);
  const [filename, setFilename] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [teamId, setTeamId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamIdAndFiles = async () => {
      try {
        setIsLoading(true);
      
        const teamResponse = await axios.get(`${BACKEND_URL}/write/teamId?teamname=${selectedVersion}`);
        const currentTeamId = teamResponse.data.teamId;
        setTeamId(currentTeamId);
        
        const filesResponse = await axios.post(`${BACKEND_URL}/files`, {
          teamId: currentTeamId
        });
        

        setFiles(filesResponse.data.files || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (selectedVersion) {
      fetchTeamIdAndFiles();
    }
  }, [selectedVersion, BACKEND_URL]);
  
  const { isLoaded , isSignedIn , userId} = useAuth();

  if(! isLoaded ){
    return <div>
      <div className='flex justify-center h-screen w-365 bg-black '><div className='my-auto'><TextShimmerWave
    className='[--base-color:#FAF6E9] [--base-gradient-color:#FDFAF6] text-2xl'
    duration={1}
    spread={1}
    zDistance={1}
    scaleDistance={1.1}
    rotateYDistance={20}
  >
    Loading...
  </TextShimmerWave></div>
  </div>
  </div>
}

  if(! userId){
    return <div>
      <RedirectToSignIn/>
      <div className='flex justify-center h-screen bg-black '><div className='my-auto'><TextShimmerWave
    className='[--base-color:#FAF6E9] [--base-gradient-color:#FDFAF6] text-2xl'
    duration={1}
    spread={1}
    zDistance={1}
    scaleDistance={1.1}
    rotateYDistance={20}
  >
    SignIn to View 
  </TextShimmerWave></div>
  </div>
      </div>
  }
  
  const handleCreateFile = async () => {
    if (!filename.trim()) {
      alert("Please enter a filename");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/create/file`, {
        name: filename,
        teamId: teamId
      });

      if (response.data) {
        const filesResponse = await axios.post(`${BACKEND_URL}/files`, {
          teamId: teamId
        });
        setFiles(filesResponse.data.files || []);
        setFilename("");
      }
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  return (
    <div className="bg-black text-white h-screen w-320">
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Dashboard: {selectedVersion}</h1>
        
        <div className="mb-6">
          <Input 
            type="text"
            value={filename}
            placeholder="Enter filename"
            className="border rounded bg-white text-black font-semibold mr-3"
            onChange={(e) => setFilename(e.target.value)}
          />
          <button 
            className="bg-white text-black h-10 rounded w-40 font-bold mx-3 hover:bg-slate-200"
            onClick={handleCreateFile}
          >
            Create File
          </button>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-xl mb-4 font-bold">Files</h2>
          {isLoading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file) => (  
                <a href={`http://localhost:3000/file/${file.name}`}>
                <li key={file.id} className="p-2 m-2 bg-gray-800 rounded flex justify-between hover:bg-indigo-300 hover:text-black">
                    <span>{file.name}</span>
                    <span className="text-gray-400 text-sm pl-200 hover:text-black">
                        {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                </li>
                </a>
              ))}
            </ul>
          ) : (
            <p>No files found</p>
          )}
        </div>
      </div>
    </div>
  );
}