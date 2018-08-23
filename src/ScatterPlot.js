import React from 'react'
import PropTypes from 'prop-types'
import { extent as d3ArrayExtent } from 'd3-array'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'

export const average = (ary) => {
  return ary.reduce((total, n) => total + n, 0) / ary.length
}

export const pluck = (ary, key) => {
  return ary.map((i) => i[key])
}

export const pointToCircle = ({x, y, color, ...rest}) => ({
  cx: x,
  cy: y,
  fill: color,
  r: 6,
  ...rest
})

export const makeDefaultTransform = () => (points) => {
  return {
    circles: points.map(pointToCircle),
    lines: []
  }
}

export const makeAverageTransform = (isSelected) => (points) => {
  const selectedPoints = points.filter(isSelected)

  // TODO
  const color = selectedPoints[0].color

  const averageCircle = {
    ...pointToCircle({
      x: average(pluck(selectedPoints, 'x')),
      y: average(pluck(selectedPoints, 'y')),
      color: 'white',
      id: 'average'
    }),
    stroke: color,
    strokeWidth: 1,
  }

  const circles = [
    ...points
      .map((point) => isSelected(point)
        ? {...point, color: color}
        : {...point, opacity: 0.5}
      )
      .map(pointToCircle),
    averageCircle
  ]

  const lines = selectedPoints
    .map(({x, y, id}) => ({
      x1: x,
      y1: y,
      x2: averageCircle.cx,
      y2: averageCircle.cy,
      strokeWidth: 1,
      stroke: color,
      strokeOpacity: 0.3,
      id: `${id}--average`
    }))

  return {circles, lines}
}

class ScatterPlot extends React.Component {
  render() {
    const { points, width, height, margin } = this.props

    const xScale = d3ScaleLinear()
      .domain(d3ArrayExtent(points, ({x}) => x))
      .range([0, width])

    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(points, ({y}) => y))
      .range([height, 0])

    const { circles, lines } = this.props.showAverage
      ? makeAverageTransform(this.props.showAverage)(points)
      : makeDefaultTransform()(points)

    return <svg height={height + margin * 2} width={width + margin * 2}>
      <g
        style={{
          transform: `translate(${margin}px, ${margin}px)`
        }}
      >
        {
          lines.map(({x1, y1, x2, y2, id, ...rest}) => {
            return <line
              x1={xScale(x1)}
              y1={yScale(y1)}
              x2={xScale(x2)}
              y2={yScale(y2)}
              {...rest}
              key={id}
            />

          })
        }
        {
          circles.map(({cx, cy, id, ...rest}) => {
            return <circle
              cx={xScale(cx)}
              cy={yScale(cy)}
              {...rest}
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
  margin: PropTypes.number,
  showAverage: PropTypes.func
}

ScatterPlot.defaultProps = {
  margin: 10
}

export default ScatterPlot
