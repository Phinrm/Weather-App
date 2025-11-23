import React from 'react'

function Layout({ children, status, onInfo, onExport }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo-block">
          <span className="logo-mark">☁️</span>
          <div>
            <h1>SkyScope Weather</h1>
            <p className="subtitle">Real-time weather & trends</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="status-pill">{status}</span>
          <button className="ghost-btn" onClick={() => onExport('csv')}>
            Export CSV
          </button>
          <button className="ghost-btn" onClick={() => onExport('json')}>
            Export JSON
          </button>
          <button className="ghost-btn" onClick={() => onExport('markdown')}>
            Export Markdown
          </button>
          <button className="info-btn" onClick={onInfo}>
            i
          </button>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <span>Built by Phineas Barasa</span>
        <span>•</span>
        <a
          href="https://www.linkedin.com/company/product-manager-accelerator/"
          target="_blank"
          rel="noreferrer"
        >
          PM Accelerator
        </a>
      </footer>
    </div>
  )
}

export default Layout
