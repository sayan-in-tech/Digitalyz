import React from 'react'
import { utils, writeFile } from 'xlsx'

interface ExportPanelProps {
  clientsData: any[]
  workersData: any[]
  tasksData: any[]
  rules: any[]
  weights: { [key: string]: number }
}

const ExportPanel: React.FC<ExportPanelProps> = ({ clientsData, workersData, tasksData, rules, weights }) => {
  const exportCSV = (data: any[], filename: string) => {
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Sheet1')
    writeFile(wb, filename)
  }

  const exportRulesJSON = () => {
    const rulesConfig = {
      rules,
      prioritization: weights,
    }
    const blob = new Blob([JSON.stringify(rulesConfig, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rules.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const hasData = clientsData.length > 0 || workersData.length > 0 || tasksData.length > 0

  return (
    <div className="flex flex-col">
      <h2>Export Cleaned Data & Rules</h2>
      
      {!hasData && (
        <div className="card text-center">
          <div className="text-muted text-lg">No data to export</div>
          <div className="text-sm text-muted mt-1">Upload files first to enable export options</div>
        </div>
      )}

      {hasData && (
        <div className="grid grid-2 gap-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Export Data Files</h3>
            <div className="space-y-2">
              <button 
                onClick={() => exportCSV(clientsData, 'clients_cleaned.csv')} 
                disabled={clientsData.length === 0}
                className="w-full"
              >
                Export Clients CSV ({clientsData.length} records)
              </button>
              <button 
                onClick={() => exportCSV(workersData, 'workers_cleaned.csv')} 
                disabled={workersData.length === 0}
                className="w-full"
              >
                Export Workers CSV ({workersData.length} records)
              </button>
              <button 
                onClick={() => exportCSV(tasksData, 'tasks_cleaned.csv')} 
                disabled={tasksData.length === 0}
                className="w-full"
              >
                Export Tasks CSV ({tasksData.length} records)
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Export Configuration</h3>
            <div className="space-y-2">
              <button 
                onClick={exportRulesJSON} 
                disabled={rules.length === 0}
                className="w-full secondary"
              >
                Export Rules JSON ({rules.length} rules)
              </button>
              <div className="text-sm text-muted mt-3">
                <div className="font-medium mb-1">Export Summary:</div>
                <div>• {clientsData.length} client records</div>
                <div>• {workersData.length} worker records</div>
                <div>• {tasksData.length} task records</div>
                <div>• {rules.length} business rules</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportPanel
