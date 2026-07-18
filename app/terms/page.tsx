'use client'

import { Navbar } from '@/components/navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar transparent={false} />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-5xl font-bold mb-8">Terms of Service</h1>
          
          <section className="space-y-6 text-foreground/80">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using RecruitAI, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on RecruitAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on RecruitAI</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Disclaimer</h2>
              <p>The materials on RecruitAI are provided on an &apos;as is&apos; basis. RecruitAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitations</h2>
              <p>In no event shall RecruitAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RecruitAI.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Modifications</h2>
              <p>RecruitAI may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of California, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
            </div>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">Last updated: January 2024</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
