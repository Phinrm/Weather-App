import React, { useState } from 'react'

function HistoryTable({ records, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ location_input: '', start_date: '', end_date: '', notes: '' })

  const startEdit = (record) => {
    setEditingId(record.id)
    setForm({
      location_input: record.location_input || '',
      start_date: record.start_date || '',
      end_date: record.end_date || '',
      notes: record.notes || '',
    })
  }

  const submitEdit = (id) => {
    onUpdate(id, {
      location_input: form.location_input,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      notes: form.notes || null,
    })
    setEditingId(null)
  }

  if (!records.length) {
    return (
      <section className="card">
        <h2>Saved queries</h2>
        <p className="help-text">Search with a date range to start building history.</p>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Saved queries</h2>
      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location input</th>
              <th>Date range</th>
              <th>Notes</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  {editingId === r.id ? (
                    <input
                      value={form.location_input}
                      onChange={(e) => setForm({ ...form, location_input: e.target.value })}
                    />
                  ) : (
                    r.location_input
                  )}
                </td>
                <td>
                  {editingId === r.id ? (
                    <div className="field-row compact">
                      <input
                        type="date"
                        value={form.start_date || ''}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      />
                      <input
                        type="date"
                        value={form.end_date || ''}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      />
                    </div>
                  ) : (
                    <>
                      {r.start_date || '—'} → {r.end_date || '—'}
                    </>
                  )}
                </td>
                <td>
                  {editingId === r.id ? (
                    <input
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  ) : (
                    r.notes || '—'
                  )}
                </td>
                <td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleString()
                    : '—'}
                </td>
                <td className="actions-cell">
                  {editingId === r.id ? (
                    <>
                      <button
                        className="secondary-btn small"
                        onClick={() => submitEdit(r.id)}
                      >
                        Save
                      </button>
                      <button
                        className="ghost-btn small"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="secondary-btn small"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="ghost-btn small danger"
                        onClick={() => onDelete(r.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default HistoryTable
