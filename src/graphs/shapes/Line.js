import React from 'react'
import PropTypes from 'prop-types'


class Line extends React.PureComponent {
  render() {
    const {
      xScale,
      yScale,
      x1,
      y1,
      x2,
      y2,
      ...rest
    } = this.props

    return <line
      x1={xScale(x1)}
      y1={yScale(y1)}
      x2={xScale(x2)}
      y2={yScale(y2)}
      {...rest}
    />
  }
}

Line.propTypes = {
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  x1: PropTypes.number,
  y1: PropTypes.number,
  x2: PropTypes.number,
  y2: PropTypes.number,
  syncAnim: PropTypes.func,
}

export default Line
