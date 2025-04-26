import { create } from 'zustand'

export const useselecteTool = create((set) => ({
  selectedTool: "",
  setSelectedTool: (selectedTool: any) => set(()=>({selectedTool}))
}))
