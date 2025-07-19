import React, { useEffect, useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'

const STATUS_MAP = {
  0: { label: 'Active', className: 'bg-green-100 text-green-800' },
  1: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  2: { label: 'Suspended', className: 'bg-red-100 text-red-800' },
}

interface CompanyProfile {
  id: number;
  industry: string | null;
  linkedinUrl: string | null;
  status: number;
  numberOfJobs: number;
  createdAt: string;
}

const CompaniesTable = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://fit4job.runasp.net/api/CompanyProfiles')
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setCompanies(data.data)
        } else {
          setError('No data returned from API')
        }
      } catch (err) {
        setError('Error fetching companies')
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  // Helper to format date
  const formatDate = (iso: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    return d.toISOString().split('T')[0];
  }

  return (
    <div className="p-6 bg-white min-h-screen" data-id="companies-table">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <div className="text-sm text-gray-500">{companies.length ? `Showing ${companies.length} companies` : ''}</div>
      </div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search companies by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
        </div>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter
        </button>
        {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Company
        </button> */}
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading companies...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">INDUSTRY</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">CONTACT</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">STATUS</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">STATS</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">REGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{company.industry || '-'}</td>
                  <td className="py-4 px-4">
                    {company.linkedinUrl ? (
                      <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
                    ) : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${STATUS_MAP[company.status]?.className || 'bg-gray-100 text-gray-800'}`}>
                      {STATUS_MAP[company.status]?.label || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-4">{company.numberOfJobs ?? 0} Jobs</td>
                  <td className="py-4 px-4">{formatDate(company.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CompaniesTable