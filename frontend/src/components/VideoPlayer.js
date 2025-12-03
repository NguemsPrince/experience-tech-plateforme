import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ForwardIcon,
  BackwardIcon
} from '@heroicons/react/24/outline';

const VideoPlayer = ({ 
  src, 
  title, 
  playbackRate = 1, 
  volume = 1, 
  isMuted = false,
  showSubtitles = false,
  onPlaybackRateChange,
  onVolumeChange,
  onMuteToggle,
  onSubtitlesToggle
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [currentMuted, setCurrentMuted] = useState(isMuted);
  const [currentPlaybackRate, setCurrentPlaybackRate] = useState(playbackRate);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = currentPlaybackRate;
      video.volume = currentVolume;
      video.muted = currentMuted;
    }
  }, [currentPlaybackRate, currentVolume, currentMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      const updateBuffered = () => {
        if (video.buffered.length > 0) {
          setBuffered((video.buffered.end(0) / video.duration) * 100);
        }
      };

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('progress', updateBuffered);

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateDuration);
        video.removeEventListener('progress', updateBuffered);
      };
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    
    if (video) {
      video.volume = newVolume;
      setCurrentVolume(newVolume);
      if (newVolume > 0 && currentMuted) {
        video.muted = false;
        setCurrentMuted(false);
        onMuteToggle(false);
      }
    }
    
    onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !currentMuted;
      setCurrentMuted(!currentMuted);
      onMuteToggle(!currentMuted);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setCurrentPlaybackRate(rate);
      onPlaybackRateChange(rate);
    }
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        onClick={togglePlay}
        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3"
      />

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

      {/* Title Overlay */}
      <div className="absolute top-4 left-4 right-4">
        <h3 className="text-white text-lg font-semibold bg-black bg-opacity-50 px-3 py-2 rounded">
          {title}
        </h3>
      </div>

      {/* Center Play Button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-4 transition-all duration-200"
          >
            <PlayIcon className="w-12 h-12 text-white" />
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            className="relative h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            {/* Buffered Progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            
            {/* Played Progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            
            {/* Progress Handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>

            {/* Skip Backward */}
            <button
              onClick={skipBackward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <BackwardIcon className="w-5 h-5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={skipForward}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <ForwardIcon className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {currentMuted || currentVolume === 0 ? (
                  <SpeakerXMarkIcon className="w-5 h-5" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={currentMuted ? 0 : currentVolume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Playback Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-10 right-0 bg-black bg-opacity-90 rounded-lg p-2 min-w-[120px]">
                  <div className="text-white text-xs mb-2 px-2">Vitesse</div>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded ${
                        currentPlaybackRate === rate ? 'text-blue-400' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-600 my-2" />
                  
                  <div className="text-white text-xs mb-2 px-2">Sous-titres</div>
                  <button
                    onClick={() => onSubtitlesToggle(!showSubtitles)}
                    className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-700 rounded ${
                      showSubtitles ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    {showSubtitles ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors"
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-5 h-5" />
              ) : (
                <ArrowsPointingOutIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
