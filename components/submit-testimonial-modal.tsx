'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle2 } from "lucide-react"

export function SubmitTestimonialModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    linkedin: '',
    before: '',
    content: '',
    videoUrl: '',
    cta: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Submit testimonial data
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData
        })
      })

      if (!res.ok) throw new Error('Submission failed')

      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setFormData({
            name: '',
            role: '',
            email: '',
            linkedin: '',
            before: '',
            content: '',
            videoUrl: '',
            cta: ''
        })
      }, 2000)

    } catch (error) {
      console.error(error)
      // Ideally show error toast here
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-semibold">
          Submit Your Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Tell us about your journey with DevWeekends. Your story inspires others!
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-medium">Submission Received!</h3>
            <p className="text-center text-muted-foreground">
              Your testimonial has been submitted for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Current Role / Outcome *</Label>
                <Input
                  id="role"
                  required
                  placeholder="MERN stack developer"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn *</Label>
              <Input
                id="linkedin"
                type="url"
                required
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Story *</Label>
              <Textarea
                id="content"
                required
                className="min-h-[100px]"
                placeholder="Share your experience..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta">Message to Readers *</Label>
              <Input
                id="cta"
                type="text"
                placeholder="Join Dev Weekends to level up your skills"
                required
                value={formData.cta}
                onChange={(e) => setFormData({...formData, cta: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">Short call-to-action or closing thought.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (Optional)</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://youtube.com/..."
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">Link to a YouTube video or similar.</p>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Testimonial
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
