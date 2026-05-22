'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Quote } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from 'react';

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  cta?: string;
  videoUrl?: string;
  imageUrl?: string;
  type: 'text' | 'video';
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = testimonial.videoUrl ? getYoutubeId(testimonial.videoUrl) : null;
  const avatarUrl = testimonial.imageUrl || '/avatar.svg';
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
    : avatarUrl;

  if (testimonial.type === 'video' && testimonial.videoUrl) {
    return (
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogTrigger asChild>
          <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col border-muted/60">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <Image
                src={thumbnailUrl}
                alt={testimonial.name}
                fill
                className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <Badge className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 border-none text-white">
                Video
              </Badge>
            </div>
            <CardHeader className="p-4 pb-2 space-y-1">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border">
                  <Image src={avatarUrl} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold leading-tight">{testimonial.name}</h3>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground line-clamp-2 italic">
                "{testimonial.content}"
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black border-none">
          <div className="relative aspect-video w-full">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={testimonial.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            ) : (
                <div className="flex items-center justify-center h-full text-white">
                    Video format not supported
                </div>
            )}
          </div>
          <div className="p-4 bg-background">
             <div className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border">
                  <Image src={testimonial.imageUrl} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
              {testimonial.cta && (
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {testimonial.cta}
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-muted/60">
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        <Quote className="w-8 h-8 text-primary/20" />
        <p className="text-muted-foreground italic leading-relaxed flex-1">
          "{testimonial.content}"
        </p>
        <div className="flex items-center gap-3 mt-auto pt-4 border-t">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border">
            <Image
              src={avatarUrl}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{testimonial.name}</h3>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
        {testimonial.cta && (
          <p className="text-sm font-semibold text-foreground">
            {testimonial.cta}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
