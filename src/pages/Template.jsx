// src/pages/KampusForm.jsx
import React, { useEffect, useState } from 'react'


export default function KampusForm() {
  const [kampusList, setKampusList] = useState([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ambil daftar PT
    fetch('https://api-frontend.kemdikbud.go.id/v2/loadpt')
      .then(res => res.json())
      .then(json => {
        // API mengembalikan object dengan key "data" berisi array {text, id}
        const list = json.data?.map(item => item.text) || []
        setKampusList(list.sort()) // opsional: urutkan
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 pt-[50px]">
        <h1 className="text-2xl font-bold mb-4">Pilih Kampus</h1>

        {loading ? (
          <p className="text-sm text-gray-500">Memuat daftar kampus...</p>
        ) : (
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
          >
            <option value="">-- Pilih Kampus --</option>
            {kampusList.map(kampus => (
              <option key={kampus} value={kampus}>
                {kampus}
              </option>
            ))}
          </select>
        )}

        {selected && (
          <p className="mt-4 text-green-700">
            Anda memilih: <strong>{selected}</strong>
          </p>
        )}
      </section>
    </div>
  )
}