import * as R from 'ramda'

export default ({children, source, className}) => (
  <div
    className={className}
    style={{
      background: R.join(', ', [
        'linear-gradient(rgba(255, 255, 255, 0.5)',
        'rgba(255, 255, 255, 0.5))', 
        `url(${source})`
      ]),
      backgroundSize: '100% 100%',
    }}
  >
    {children}
  </div>
)
