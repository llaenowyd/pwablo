export default ({children, source, className}) => (
  <div
    className={className}
    style={{
      backgroundImage: `url(${source})`,
      backgroundSize: '100% 100%',
    }}
  >
    {children}
  </div>
)
