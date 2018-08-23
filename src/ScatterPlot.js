import React from 'react'
import PropTypes from 'prop-types'
import { extent as d3ArrayExtent } from 'd3-array'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'


class ScatterPlot extends React.Component {
  render() {
    const { points, width, height, margin } = this.props

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(points, ({x}) => x))
      .range([0, width])

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(points, ({y}) => y))
      .range([height, 0])

    return <svg height={height + margin * 2} width={width + margin * 2}>
      <g
        style={{
          transform: `translate(${margin}px, ${margin}px)`
        }}
      >
        {
          points.map(({x, y, color, id}) => {
            return <circle
              cx={xScale(x)}
              cy={yScale(y)}
              fill={color}
              r={3}
              key={id}
            />

          })
        }
      </g>
    </svg>
  }
}

ScatterPlot.propTypes = {
  points: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  margin: PropTypes.number
}

ScatterPlot.defaultProps = {
  margin: 10
}

export default ScatterPlot
