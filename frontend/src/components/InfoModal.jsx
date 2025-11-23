import React from 'react'

function InfoModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>About this app</h2>
        <p>
          This weather experience was built as part of the PM Accelerator technical assessment.
          It demonstrates real-time weather lookup, a 5-day forecast, location history with full CRUD,
          external API integrations, and data export.
        </p>
        <p>
          <strong>PM Accelerator</strong> is a community and training program helping professionals
          grow into high-impact Product Managers through hands-on coaching, frameworks, and real-world projects.
        </p>
        <p>
          Learn more on their LinkedIn page:
          {' '}
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noreferrer"
          >
            Product Manager Accelerator on LinkedIn
          </a>.
        </p>
        <button className="primary-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default InfoModal
