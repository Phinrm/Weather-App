import React, { useState } from 'react'

function SearchBar({ onSearch, loading }) {
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!location.trim()) {
      alert('Please enter a location.')
      return
    }
    onSearch({
      location,
      start_date: startDate || null,
      end_date: endDate || null,
      notes: notes || null,
    })
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const loc = `${latitude},${longitude}`
        setLocation(loc)
      },
      () => {
        alert('Could not get your location.')
      }
    )
  }

  return (
    <section className="card search-card">
      <h2>Check the weather</h2>
      <p className="help-text">
        Type a city, landmark, ZIP/postal code, or coordinates. Optionally add a date range to save the query.
      </p>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Location</label>
          <div className="field-inline">
            <input
              type="text"
              placeholder="e.g. Nairobi, Eiffel Tower, 10001 or 37.77,-122.41"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button
              type="button"
              className="secondary-btn"
              onClick={handleUseCurrentLocation}
            >
              Use my location
            </button>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Start date (optional)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label>End date (optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Notes (optional)</label>
          <input
            type="text"
            placeholder="e.g. Trip planning, daily routine..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get weather'}
        </button>
      </form>
    </section>
  )
}

export default SearchBar
