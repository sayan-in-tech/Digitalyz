import React, { useState } from 'react'

interface Rule {
  id: string
  type: string
  description: string
  data: any
}

interface RuleInputPanelProps {
  rules: Rule[]
  onRulesChange: (rules: Rule[]) => void
}

const RuleInputPanel: React.FC<RuleInputPanelProps> = ({ rules, onRulesChange }) => {
  const [newRuleType, setNewRuleType] = useState<string>('coRun')
  const [newRuleData, setNewRuleData] = useState<string>('')
  const [nlRuleInput, setNlRuleInput] = useState<string>('')

  const addRule = () => {
    if (!newRuleData.trim()) return
    const newRule: Rule = {
      id: Date.now().toString(),
      type: newRuleType,
      description: `${newRuleType} - ${newRuleData}`,
      data: newRuleData,
    }
    onRulesChange([...rules, newRule])
    setNewRuleData('')
  }

  const removeRule = (id: string) => {
    onRulesChange(rules.filter((r) => r.id !== id))
  }

  const convertNlRuleToStructured = (nlText: string): Rule | null => {
    if (!nlText.trim()) return null
    return {
      id: Date.now().toString(),
      type: 'coRun',
      description: `AI Converted Rule: ${nlText}`,
      data: nlText,
    }
  }

  const handleAddNlRule = () => {
    const newRule = convertNlRuleToStructured(nlRuleInput)
    if (newRule) {
      onRulesChange([...rules, newRule])
      setNlRuleInput('')
    }
  }

  const generateRuleRecommendations = () => {
    const sampleRule: Rule = {
      id: Date.now().toString(),
      type: 'coRun',
      description: 'AI Recommendation: Tasks T12 and T14 always run together',
      data: { type: 'coRun', tasks: ['T12', 'T14'] },
    }
    onRulesChange([...rules, sampleRule])
  }

  return (
    <div className="flex flex-col">
      <h2>Business Rules</h2>
      
      <div className="card">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <label className="font-medium">Rule Type:</label>
            <select 
              value={newRuleType} 
              onChange={(e) => setNewRuleType(e.target.value)}
              className="flex-1"
            >
              <option value="coRun">Co-run</option>
              <option value="slotRestriction">Slot Restriction</option>
              <option value="loadLimit">Load Limit</option>
              <option value="phaseWindow">Phase Window</option>
              <option value="patternMatch">Pattern Match</option>
              <option value="precedenceOverride">Precedence Override</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="font-medium">Rule Data (JSON or plain text):</label>
            <input
              type="text"
              value={newRuleData}
              onChange={(e) => setNewRuleData(e.target.value)}
              placeholder="Enter rule details"
              className="mt-1"
            />
          </div>
          
          <button onClick={addRule} disabled={!newRuleData.trim()}>
            Add Rule
          </button>
        </div>
      </div>

      <div className="card mt-3">
        <div className="flex flex-col gap-3">
          <label className="font-medium">Natural Language Rule Input:</label>
          <textarea
            value={nlRuleInput}
            onChange={(e) => setNlRuleInput(e.target.value)}
            rows={3}
            placeholder="Enter rule in plain English"
            className="resize-none"
          />
          <button onClick={handleAddNlRule} disabled={!nlRuleInput.trim()}>
            Add Rule from Natural Language
          </button>
        </div>
      </div>

      <div className="card mt-3">
        <button onClick={generateRuleRecommendations} className="secondary">
          Generate AI Rule Recommendations
        </button>
      </div>

      {rules.length > 0 && (
        <div className="card mt-3">
          <h3 className="text-lg font-semibold mb-3">Active Rules</h3>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex-1">
                  <div className="font-medium text-primary">{rule.type}</div>
                  <div className="text-sm text-muted">{rule.description}</div>
                </div>
                <button onClick={() => removeRule(rule.id)} className="danger ml-2">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RuleInputPanel
