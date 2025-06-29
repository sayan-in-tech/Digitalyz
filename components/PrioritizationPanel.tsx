import React, { useState } from 'react'

interface PrioritizationPanelProps {
  weights: { [key: string]: number }
  onWeightsChange: (weights: { [key: string]: number }) => void
}

const presetProfiles = {
  'Maximize Fulfillment': { PriorityLevel: 5, RequestedTaskIDs: 4, Fairness: 3, Cost: 1 },
  'Fair Distribution': { PriorityLevel: 3, RequestedTaskIDs: 3, Fairness: 5, Cost: 2 },
  'Minimize Workload': { PriorityLevel: 1, RequestedTaskIDs: 2, Fairness: 3, Cost: 5 },
}

type PresetProfileKey = keyof typeof presetProfiles

const PrioritizationPanel: React.FC<PrioritizationPanelProps> = ({ weights, onWeightsChange }) => {
  const [selectedProfile, setSelectedProfile] = useState<PresetProfileKey | ''>('')

  const handleSliderChange = (key: string, value: number) => {
    onWeightsChange({ ...weights, [key]: value })
    setSelectedProfile('')
  }

  const applyPreset = (profile: PresetProfileKey) => {
    const preset = presetProfiles[profile]
    if (preset) {
      onWeightsChange(preset)
      setSelectedProfile(profile)
    }
  }

  return (
    <div className="flex flex-col">
      <h2>Prioritization & Weights</h2>
      
      <div className="card">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <label className="font-medium">Preset Profiles:</label>
            <select
              value={selectedProfile}
              onChange={(e) => applyPreset(e.target.value as PresetProfileKey)}
              className="flex-1"
            >
              <option value="">Select a profile</option>
              {Object.keys(presetProfiles).map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <h3 className="text-lg font-semibold mb-3">Custom Weights</h3>
        <div className="space-y-4">
          {Object.keys(weights).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="font-medium">{key}:</label>
                <span className="text-primary font-semibold text-lg">{weights[key]}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={weights[key]}
                onChange={(e) => handleSliderChange(key, Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>Low Priority</span>
                <span>High Priority</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-3">
        <div className="text-sm text-muted">
          <div className="font-medium mb-2">Weight Descriptions:</div>
          <div className="space-y-1">
            <div><span className="text-primary">PriorityLevel:</span> Task priority importance</div>
            <div><span className="text-primary">RequestedTaskIDs:</span> Client requested task matching</div>
            <div><span className="text-primary">Fairness:</span> Equal distribution among workers</div>
            <div><span className="text-primary">Cost:</span> Cost optimization factor</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrioritizationPanel
