import { 
  Pencil, 
  Share2, 
  Users, 
  Cloud, 
  Layers, 
  FileJson,
  ChevronRight
} from 'lucide-react';

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home(){
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pencil className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">QuickDraw</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-400 hover:text-white">Features</a>
            <a href="#templates" className="text-gray-400 hover:text-white">Templates</a>
            <a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a>
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Create Beautiful Diagrams <br />
          <span className="text-gray-400">in Minutes</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          QuickDraw is your go-to platform for creating professional diagrams, flowcharts, and wireframes. No design experience needed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center">
            Signup <ChevronRight className="ml-2 h-5 w-5" />
          </button>
          <button className="border-2 border-gray-700 text-white px-8 py-3 rounded-lg font-bold hover:border-white hover:text-white transition-colors">
            SignIn
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose QuickDraw?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Share2 className="h-8 w-8 text-white" />}
              title="Real-time Collaboration"
              description="Work together with your team in real-time. Share and edit diagrams simultaneously."
            />
            <FeatureCard
              icon={<Cloud className="h-8 w-8 text-white" />}
              title="Cloud Storage"
              description="Your diagrams are automatically saved and synced across all your devices."
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-white" />}
              title="Rich Templates"
              description="Start with pre-made templates or create your own custom designs from scratch."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 mb-8">Trusted by over 10,000+ users worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=32&fit=crop&auto=format" alt="Company logo" className="h-8 invert" />
            <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=128&h=32&fit=crop&auto=format" alt="Company logo" className="h-8 invert" />
            <img src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=128&h=32&fit=crop&auto=format" alt="Company logo" className="h-8 invert" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Start Creating?
          </h2>
          <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Pencil className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">QuickDraw</span>
              </div>
              <p className="max-w-xs">
                Create, collaborate, and share beautiful diagrams with ease.
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
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 QuickDraw. All rights reserved.</p>
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
