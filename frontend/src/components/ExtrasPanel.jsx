import React from 'react'

function ExtrasPanel({ open, onClose, extras }) {
  if (!open) return null

  const videos = extras?.videos || []
  const mapUrl = extras?.mapUrl

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h2>Explore this location</h2>
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="extras-grid">
          <div className="extras-block">
            <h3>Map</h3>
            {mapUrl ? (
              <iframe
                title="map"
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <p className="help-text">Map not available.</p>
            )}
          </div>
          <div className="extras-block">
            <h3>YouTube videos</h3>
            {videos.length === 0 && (
              <p className="help-text">
                No videos found or YouTube API key was not configured.
              </p>
            )}
            <div className="video-list">
              {videos.map((v) => (
                <a
                  key={v.videoId}
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="video-item"
                >
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt={v.title} />
                  )}
                  <div>
                    <div className="video-title">{v.title}</div>
                    <div className="video-channel">{v.channelTitle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtrasPanel
