import React, { useState } from 'react'
import * as Papa from 'papaparse'
import * as XLSX from 'xlsx'

type DataRow = { [key: string]: any }

interface FileUploaderProps {
  entity: string
  onDataLoaded: (entity: string, data: DataRow[]) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ entity, onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setIsUploading(true)
    const file = e.target.files?.[0]
    if (!file) {
      setIsUploading(false)
      return
    }

    const reader = new FileReader()
    const fileName = file.name.toLowerCase()

    reader.onload = (evt: ProgressEvent<FileReader>) => {
      const data = evt.target?.result
      if (!data) {
        setError('Failed to read file')
        setIsUploading(false)
        return
      }

      if (fileName.endsWith('.csv')) {
        const text = data as string
        (Papa as any).parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<DataRow>) => {
            onDataLoaded(entity, results.data)
            setIsUploading(false)
          },
          error: (err: Papa.ParseError) => {
            setError('CSV parse error: ' + err.message)
            setIsUploading(false)
          },
        })
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
        onDataLoaded(entity, jsonData as DataRow[])
        setIsUploading(false)
      } else {
        setError('Unsupported file type')
        setIsUploading(false)
      }
    }

    if (fileName.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsBinaryString(file)
    }
  }

  return (
    <div className="card">
      <div className="flex flex-col">
        <label className="font-semibold text-primary">
          Upload {entity.charAt(0).toUpperCase() + entity.slice(1)} File
        </label>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFile}
            disabled={isUploading}
            className="flex-1"
          />
          {isUploading && (
            <div className="text-primary font-medium">
              Processing...
            </div>
          )}
        </div>
        {error && (
          <div className="error-text mt-2">
            {error}
          </div>
        )}
        <div className="text-sm text-muted mt-2">
          Supported formats: CSV, XLSX, XLS
        </div>
      </div>
    </div>
  )
}

export default FileUploader
