export default ({
  adjustsFontSizeToFit,
  allowFontScaling,
  children,
  numberOfLines,
  className,
  style,
}) => (
  <div className={className} style={style}>
    {children}
  </div>
)
