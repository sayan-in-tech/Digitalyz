import React, { useState, useEffect } from 'react'

type DataRow = { [key: string]: any }
type ValidationErrors = { [rowIndex: number]: { [column: string]: string } }

interface DataGridProps {
  data: DataRow[]
  onDataChange: (data: DataRow[]) => void
  validationErrors?: ValidationErrors
}

const DataGrid: React.FC<DataGridProps> = ({ data, onDataChange, validationErrors = {} }) => {
  const [gridData, setGridData] = useState<DataRow[]>([])

  useEffect(() => {
    setGridData(data)
  }, [data])

  const handleCellChange = (rowIndex: number, column: string, value: any) => {
    const newData = [...gridData]
    newData[rowIndex] = { ...newData[rowIndex], [column]: value }
    setGridData(newData)
    onDataChange(newData)
  }

  if (gridData.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-muted text-lg">No data to display</div>
        <div className="text-sm text-muted mt-1">Upload a file to see data here</div>
      </div>
    )
  }

  const columns = Object.keys(gridData[0])

  return (
    <div className="scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gridData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => {
                const error = validationErrors[rowIndex]?.[col]
                return (
                  <td key={col}>
                    <input
                      type="text"
                      value={row[col] ?? ''}
                      onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                      className={error ? 'error-input' : ''}
                      title={error || ''}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataGrid
