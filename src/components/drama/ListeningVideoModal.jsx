import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Headphones, Tv, AlertCircle } from 'lucide-react';

export default function ListeningVideoModal({ resource, isOpen, onClose }) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen || !resource) return null;

  const isPodcast = resource.category === 'podcast';
  const hasEmbed = !!resource.embedUrl;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-lg ${isPodcast ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20' : 'bg-red-100 text-red-600 dark:bg-red-500/20'}`}>
                {isPodcast ? <Headphones className="w-5 h-5" /> : <Tv className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="font-bold text-lg leading-tight">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.hostOrChannel}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto bg-black flex flex-col items-center justify-center min-h-[300px] relative">
            {hasEmbed ? (
              <div className="w-full h-[400px] md:h-[500px]">
                <iframe
                  src={resource.embedUrl}
                  title={resource.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                <AlertCircle className="w-16 h-16 text-muted-foreground/50" />
                <h4 className="text-xl font-bold text-white">Embed Not Available</h4>
                <p className="text-muted-foreground max-w-md">
                  This {isPodcast ? 'podcast' : 'resource'} does not support in-app embedding. You can access it directly on their official platform.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-card border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground font-medium">
                {resource.levelBadge}
              </span>
              <span className="px-2 py-1 bg-muted rounded-md text-muted-foreground font-medium">
                {resource.platform}
              </span>
            </div>
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                isPodcast
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Open on {isPodcast ? 'Spotify/Apple' : 'YouTube'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
