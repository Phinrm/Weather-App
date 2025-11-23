import React, { useEffect, useState } from 'react'
import {
  healthCheck,
  searchWeather,
  listRecords,
  updateRecord,
  deleteRecord,
  fetchExtras,
  exportData,
} from './api'
import Layout from './components/Layout'
import SearchBar from './components/SearchBar'
import WeatherSummary from './components/WeatherSummary'
import HistoryTable from './components/HistoryTable'
import InfoModal from './components/InfoModal'
import ExtrasPanel from './components/ExtrasPanel'

function App() {
  const [status, setStatus] = useState('Checking API...')
  const [weather, setWeather] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [extras, setExtras] = useState(null)
  const [showExtras, setShowExtras] = useState(false)

  useEffect(() => {
    healthCheck()
      .then(() => setStatus('API connected'))
      .catch(() => setStatus('API not reachable'))
  }, [])

  const handleSearch = async (values) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchWeather(values)
      setWeather(data)
      // Because searches with date range create records, refresh history
      refreshHistory()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'Something went wrong while fetching weather.')
    } finally {
      setLoading(false)
    }
  }

  const refreshHistory = async () => {
    try {
      const data = await listRecords()
      setHistory(data)
    } catch (err) {
      console.error('Failed to load history', err)
    }
  }

  useEffect(() => {
    refreshHistory()
  }, [])

  const handleUpdateRecord = async (id, updates) => {
    try {
      await updateRecord(id, updates)
      refreshHistory()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update record')
    }
  }

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await deleteRecord(id)
      refreshHistory()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete record')
    }
  }

  const handleExtras = async () => {
    if (!weather) return
    setShowExtras(true)
    setExtras(null)
    try {
      const data = await fetchExtras(weather.location_name, weather.lat, weather.lon)
      setExtras(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleExport = async (format) => {
    try {
      await exportData(format)
    } catch (err) {
      alert('Failed to export data')
    }
  }

  return (
    <Layout
      status={status}
      onInfo={() => setShowInfo(true)}
      onExport={handleExport}
    >
      <SearchBar onSearch={handleSearch} loading={loading} />

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {weather && (
        <>
          <WeatherSummary
            data={weather}
            onExtras={handleExtras}
          />
        </>
      )}

      <HistoryTable
        records={history}
        onUpdate={handleUpdateRecord}
        onDelete={handleDeleteRecord}
      />

      <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />

      <ExtrasPanel
        open={showExtras}
        onClose={() => setShowExtras(false)}
        extras={extras}
      />
    </Layout>
  )
}

export default App
