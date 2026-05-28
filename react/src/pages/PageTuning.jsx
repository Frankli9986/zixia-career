import { useGame } from '../GameContext'
import { PARAMS } from '../data'

export default function PageTuning({ onConfirm, onBack }) {
  const { state, dispatch } = useGame()
  const { values } = state.profile

  const handleChange = (key, val) => {
    dispatch({
      type: 'UPDATE_PROFILE_VALUES',
      payload: { [key]: parseInt(val) }
    })
  }

  return (
    <div id="page-tuning" className="page active">
      <div className="container">
        <div className="back-btn" onClick={onBack}>← 返回</div>
        
        <div className="page-header">
          <h1 className="page-title">调整你的画像</h1>
          <p className="page-subtitle">拖动滑块，找到最像你的那一档</p>
        </div>

        <div className="param-list">
          {PARAMS.map(param => (
            <div key={param.key} className="param-item">
              <div className="param-header">
                <span className="param-name">{param.name}</span>
                <span className="param-value">{values[param.key] || param.default}</span>
              </div>
              <div className="param-slider-wrap">
                <span>{param.left}</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={values[param.key] || param.default}
                  onChange={(e) => handleChange(param.key, e.target.value)}
                />
                <span>{param.right}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-actions">
          <button className="btn btn-primary btn-full" onClick={onConfirm}>
            继续 →
          </button>
        </div>
      </div>
    </div>
  )
}