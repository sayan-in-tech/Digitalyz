import React, { useState } from 'react'

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => void
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col">
      <label className="font-semibold text-primary mb-2">
        Natural Language Search
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter search query in plain English..."
          className="flex-1"
        />
        <button onClick={handleSearch} disabled={!query.trim()}>
          Search
        </button>
      </div>
      <div className="text-sm text-muted mt-2">
        Search across all data tables using natural language
      </div>
    </div>
  )
}

export default NaturalLanguageSearch
