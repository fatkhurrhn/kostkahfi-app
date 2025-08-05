import React, { useEffect, useState } from 'react'

export default function KampusForm() {
  const [kampusList, setKampusList] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://kostkahfi-app.vercel.app/pt.json')
      .then(res => res.json())
      .then(json => {
        if (Array.isArray(json)) {
          const sorted = json.sort((a, b) => a.nama.localeCompare(b.nama))
          setKampusList(sorted)
        }
      })
      .catch(err => console.error('Gagal memuat data kampus:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredList = kampusList.filter(kampus =>
    kampus.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 pt-[50px]">
        <h1 className="text-2xl font-bold mb-4">Cari Kampus</h1>

        {loading ? (
          <p className="text-sm text-gray-500">Memuat daftar kampus...</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Ketik nama kampus..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setSelected(null)
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-md mb-4"
            />

            <p className="text-sm text-gray-600 mb-2">
              Total kampus: <strong>{kampusList.length}</strong> | Ditemukan: <strong>{filteredList.length}</strong>
            </p>

            <ul className="border border-gray-200 rounded-md max-h-[300px] overflow-y-auto shadow-sm">
              {filteredList.length === 0 && (
                <li className="p-3 text-gray-500 text-sm">Tidak ada hasil.</li>
              )}
              {filteredList.map((kampus, i) => (
                <li
                  key={i}
                  className={`p-3 cursor-pointer hover:bg-blue-50 ${
                    selected?.nama === kampus.nama ? 'bg-blue-100 font-semibold' : ''
                  }`}
                  onClick={() => setSelected(kampus)}
                >
                  {kampus.nama}
                </li>
              ))}
            </ul>
          </>
        )}

        {selected && (
          <div className="mt-6 bg-green-100 border border-green-200 p-4 rounded-md max-w-xl">
            <h2 className="text-lg font-semibold text-green-800 mb-2">{selected.nama}</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Provinsi:</strong> {selected.provinsi}</li>
              <li><strong>Kab/Kota:</strong> {selected.kabupatenKota}</li>
              <li><strong>Kecamatan:</strong> {selected.kecamatan}</li>
              <li><strong>Bentuk:</strong> {selected.bentuk}</li>
              <li><strong>Lembaga:</strong> {selected.lembaga}</li>
              <li><strong>Website:</strong> <a href={`https://${selected.tautan}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{selected.tautan}</a></li>
              {selected.telepon && <li><strong>Telepon:</strong> {selected.telepon}</li>}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
