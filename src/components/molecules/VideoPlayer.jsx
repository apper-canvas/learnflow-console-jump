import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const VideoPlayer = ({ 
  className, 
  src, 
  title,
  onProgress,
  onComplete,
  onTimestampRequest,
  initialTime = 0,
  ...props 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      
      onProgress?.(current);
      
      if (current >= total * 0.9) {
        onComplete?.();
      }
    }
  };

  // Handle seek to timestamp from external source
  useEffect(() => {
    if (onTimestampRequest && videoRef.current) {
      const handleSeek = (timestamp) => {
        videoRef.current.currentTime = timestamp;
        setCurrentTime(timestamp);
      };
      
      // This would be called when seeking to a note timestamp
      if (typeof onTimestampRequest === 'function') {
        // Store the seek function for external use
        videoRef.current.seekTo = handleSeek;
      }
    }
  }, [onTimestampRequest]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      {...props}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {!isPlaying && (
          <div className="bg-black bg-opacity-50 rounded-full p-4 transition-opacity duration-300">
            <ApperIcon name="Play" className="w-12 h-12 text-white" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 video-controls p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ApperIcon name={isPlaying ? "Pause" : "Play"} className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center space-x-2">
            <span className="text-white text-sm">
              {formatTime(currentTime)}
            </span>
            <div 
              className="flex-1 bg-gray-400 bg-opacity-30 rounded-full h-2 cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;