import React, { useState } from 'react';
import '../style/VideoWidget.css';

const VideoWidget = ({content = {}, onSave}) => {
  const [videoSource, setVideoSource] = useState('YouTube');
  const [videoURL, setVideoURL] = useState(content.videoURL ||'');
  const [resolution, setResolution] = useState('1080p');
  const [alignment, setAlignment] = useState('center');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [autoplay, setAutoplay] = useState(false);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [cornerRadius, setCornerRadius] = useState(0);
  const [cssFilter, setCssFilter] = useState('none');
  const [margin, setMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [padding, setPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('auto');

  const handleSave = () => {
    const  widgetData={
      videoSource, videoURL, resolution, alignment, aspectRatio, autoplay, mute,
      loop, controls, privacyMode, cornerRadius, cssFilter, margin, padding, width, height
    };

    onSave(widgetData);
  };

  const getVideoEmbedURL = () => {
    if (videoSource === 'YouTube') {
      return `https://www.youtube.com/embed/${videoURL}`;
    } else if (videoSource === 'Vimeo') {
      return `https://player.vimeo.com/video/${videoURL}`;
    }
    return videoURL; // for local file or direct URL
  };

  return (
    <div
      className="video-widget"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: alignment,
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        width,
        height,
      }}
    >
      <div className="video-controls">
        <select value={videoSource} onChange={(e) => setVideoSource(e.target.value)}>
          <option value="YouTube">YouTube</option>
          <option value="Vimeo">Vimeo</option>
          <option value="Local">Local File</option>
        </select>
        <input
          type="text"
          placeholder="Video URL or ID"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleSave}>Save Video</button>
      </div>

      {videoURL && (
        <div
          className="video-container"
          style={{
            width: '100%',
            height: '0',
            paddingBottom: aspectRatio === '16:9' ? '56.25%' : aspectRatio === '4:3' ? '75%' : '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: `${cornerRadius}px`,
            filter: cssFilter,
          }}
        >
          <iframe
            src={`${getVideoEmbedURL()}?autoplay=${autoplay ? 1 : 0}&muted=${mute ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}&modestbranding=${privacyMode ? 1 : 0}`}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}
          ></iframe>
        </div>
      )}

      {/* Additional style and layout options */}
      <div className="style-options">
        <label>
          Alignment:
          <select value={alignment} onChange={(e) => setAlignment(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label>
          Aspect Ratio:
          <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="1:1">1:1</option>
          </select>
        </label>
        <label>
          CSS Filter:
          <input
            type="text"
            placeholder="CSS filter (e.g., grayscale(1))"
            value={cssFilter}
            onChange={(e) => setCssFilter(e.target.value)}
          />
        </label>
        <label>
          Autoplay:
          <input type="checkbox" checked={autoplay} onChange={() => setAutoplay(!autoplay)} />
        </label>
        <label>
          Mute:
          <input type="checkbox" checked={mute} onChange={() => setMute(!mute)} />
        </label>
        <label>
          Loop:
          <input type="checkbox" checked={loop} onChange={() => setLoop(!loop)} />
        </label>
        <label>
          Player Controls:
          <input type="checkbox" checked={controls} onChange={() => setControls(!controls)} />
        </label>
        <label>
          Privacy Mode:
          <input type="checkbox" checked={privacyMode} onChange={() => setPrivacyMode(!privacyMode)} />
        </label>
      </div>
    </div>
  );
};

export default VideoWidget;
