import axios from 'axios'

// For now, hard-code the backend base URL so we know it's correct.
const API_BASE = 'https://weather-app-cwk9.onrender.com/api'

const client = axios.create({
  baseURL: API_BASE,
})

export async function healthCheck() {
  const res = await client.get('/health')
  return res.data
}

export async function searchWeather(payload) {
  const res = await client.post('/weather/search', payload)
  return res.data
}

export async function listRecords() {
  const res = await client.get('/records')
  return res.data
}

export async function updateRecord(id, payload) {
  const res = await client.put(`/records/${id}`, payload)
  return res.data
}

export async function deleteRecord(id) {
  const res = await client.delete(`/records/${id}`)
  return res.data
}

export async function fetchExtras(locationName, lat, lon) {
  const res = await client.get('/extras', {
    params: { location_name: locationName, lat, lon },
  })
  return res.data
}

export async function exportData(format) {
  if (format === 'csv') {
    const url = `${API_BASE}/export?fmt=csv`
    window.open(url, '_blank')
    return
  }
  const res = await client.get('/export', { params: { fmt: format } })
  return res.data
}
