"use client"
import { 
  Pencil, 
  Share2, 
  Users, 
  Cloud, 
  Layers, 
  FileJson,
  ChevronRight,
  Shapes,
  Eraser,
  Save
} from 'lucide-react';

import {
  ClerkProvider,
  RedirectToSignUp,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs'
import { useState } from 'react';
import axios from 'axios';
import { TextShimmerWave } from '@/components/motion-primitives/text-shimmer-wave';
import { motion } from "framer-motion";
import { MousePointer } from "lucide-react";

const colorPalette = ['#4361EE', '#7209B7', '#F72585', '#3A0CA3', '#000000'];

export default function Home(){

  const { userId, isSignedIn } =  useAuth()
  const [teams,setteams] = useState([])
 
  if(!userId){
    return <div className='flex justify-center h-screen bg-black'><div className='my-auto'><RedirectToSignUp/><TextShimmerWave
    className='[--base-color:#FAF6E9] [--base-gradient-color:#FDFAF6] text-2xl'
    duration={1}
    spread={1}
    zDistance={1}
    scaleDistance={1.1}
    rotateYDistance={20}
  >
    Loading
  </TextShimmerWave></div></div>
  }
  

  async function getteams(){
    const res = await axios.post("http://localhost:3001/teams",{
      userId:userId
    })
    setteams(res.data.teamNames)
  }

  setTimeout(() => { getteams() },1*1000)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="container mx-auto px-20 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pencil className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">DrawDeck</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-400  text-md font-semibold hover:text-white">Features</a>
            <a href="#templates" className="text-gray-400 text-md font-semibold hover:text-white">Templates</a>
            <a href="#pricing" className="text-gray-400 text-md font-semibold hover:text-white">Pricing</a>
          </div>
          <div className='flex'>
          <SignedOut>
            <div className='bg-white text-black font-semibold w-20 h-10 rounded-xl py-2 pl-3 mx-2 hover:bg-slate-100'>
              <SignInButton />
            </div>
            <div className='bg-white text-black font-semibold w-20 h-10 rounded-xl py-2 pl-3 mx-2 hover:bg-slate-100'>
              <SignUpButton />
            </div>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Collaborate in real-time <br />
          <span className="text-gray-400">on virtual canvas</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          DrawDeck is a powerful collaborative whiteboard that brings teams together. Draw, design, and brainstorm in real-time with natural hand-drawn aesthetics.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href={`${ teams.length === 0 ? `http://localhost:3000/dashboard/team` :`http://localhost:3000/dashboard/${teams[0]}`}`}>
          <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center" onClick={()=>{
            getteams()
          }}>
            <div>Start Drawing</div> <div className='hover:pl-2 hover:-mr-5-'><ChevronRight className="ml-2 h-5 w-5" /></div>
          </button></a>
        </div>
      </section>

      <section className='w-200 mx-auto'>
      <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border bg-card aspect-[4/3]">
        <div className="absolute top-0 left-0 right-0 h-10 bg-background/90 border-b border-border flex items-center px-4 space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
          <div className="flex-1 text-center text-xs font-bold text-muted-foreground">DrawDeck — Collaborative Canvas</div>
        </div>
        
        <div className="absolute top-10 left-0 right-0 bottom-0 bg-black dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="w-full h-full relative">

            <motion.div
              initial={{ x: 120, y: 80 }}
              animate={{ x: 200, y: 120 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute"
            >
              <div className="flex flex-col items-center">
                <MousePointer className="h-5 w-5 text-blue-500" />
                <div className="mt-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Alex
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 250, y: 150 }}
              animate={{ x: 150, y: 170 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="absolute"
            >
              <div className="flex flex-col items-center">
                <MousePointer className="h-5 w-5 text-purple-500" />
                <div className="mt-1 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Sarah
                </div>
              </div>
            </motion.div>

            <div className="absolute inset-0 opacity-30">
              <div className="w-2/4 h-1 bg-blue-500 rounded-full transform rotate-12 translate-y-12"></div>
              <div className="w-3/4 h-1 bg-purple-500 rounded-full transform -rotate-6 translate-y-24"></div>
              <div className="w-1/2 h-1 bg-pink-500 rounded-full transform rotate-3 translate-y-36"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-16 left-4 bg-background rounded-lg shadow-lg border border-border p-1.5 flex flex-col space-y-2">
          {colorPalette.map((color, i) => (
            <button
              key={i}
              className={`w-6 h-6 rounded-full ${i === 0 ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              style={{ backgroundColor: color }}
              aria-label={`Color ${i+1}`}
            />
          ))}
        </div>
        
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border px-3 py-1.5 flex items-center space-x-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-black">3 online</span>
        </div>
      </div>
    
      <div className="absolute -z-10 -top-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
    </motion.div>
      </section>

      <section id="features" className="py-20 mt-15 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose DrawDeck?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-400" />}
              title="Real-time Collaboration"
              description="Work together with your team in real-time. Share and edit diagrams simultaneously."
            />
            <FeatureCard
              icon={<Save className="h-8 w-8 text-indigo-400" />}
              title="Cloud Storage"
              description="Your diagrams are automatically saved and synced across all your devices."
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-indigo-400" />}
              title="Rich Templates"
              description="Start with pre-made templates or create your own custom designs from scratch."
            />
            <FeatureCard
              icon={<Shapes className='h-8 w-8 text-indigo-400'></Shapes>}
              title='Shape Tools'
              description="Create perfect shapes that maintain their hand-drawn aesthetic while being precisely proportioned."
            />
            <FeatureCard
               icon= {<Eraser className="h-8 w-8 text-indigo-400" />}
               title= "Selective Erasing"
               description= "Precisely erase only what you need without affecting surrounding elements."
            />
            <FeatureCard
              icon={<Share2 className="h-8 w-8 text-violet-400" />}
              title= "One-click Sharing"
              description="Share your boards with anyone through a simple link or embed in other applications."
            />
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-around">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-4">
                <Pencil className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">DrawDeck</span>
              </div>
              <p className="max-w-100">
                 DrawDeck is a real-time collaborative whiteboard application that helps teams visualize ideas, brainstorm, and create together regardless of location.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Templates</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className=" border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 DrawDeck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl hover:bg-gray-900 transition-colors">
      <div className="inline-block p-3 bg-gray-900 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
