import React from 'react'
import PropTypes from 'prop-types'
import { extent as d3ArrayExtent } from 'd3-array'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { AnimationGroup, fadeAnimation } from './animation.js'
import Circle from './shapes/Circle.js'
import Line from './shapes/Line.js'
import groupBy from 'lodash.groupby'

export const average = (ary) => {
  return ary.reduce((total, n) => total + n, 0) / ary.length
}

export const pluck = (ary, key) => {
  return ary.map((i) => i[key])
}

/**
 * Creates a mapping function for creating circles from graph input data
 *
 * @param {object} mapping Describes how to map input data
 * @returns {function}
 *
 * Note: this is a thunk!
 */
export const datumToCircle = (mapping) => (datum) => ({
  shape: "circle",
  cx: parseFloat(datum[mapping.x]),
  cy: parseFloat(datum[mapping.y]),
  key: datum[mapping.guid],
  r: 6,
  fill: mapping.groupColors[datum[mapping.groupBy]]
})

/**
 * Creates a function for creating shape groups from input data
 *
 * @param {object} mapping Describes how to map input data
 * @returns {function}
 *
 * Note: this is a thunk!
 */
export const makeDataTransform = (mapping) => (data) => {
  const groups = groupBy(data, mapping.groupBy)

  return Object.entries(groups).map(([groupValue, group]) => ({
    shapes: group.map(datumToCircle(mapping)),
    groupValue
  }))
}

/**
 * Creates a function for creating shape groups from input data
 *
 * @param {object} mapping Describes how to map input data
 * @returns {function}
 *
 * Note: this is a thunk!
 */
export const makeDataTransformWithAverage = (mapping, groupValue) => (data) => {
  const isSelected = (datum) => datum[mapping.groupBy] === groupValue
  const selectedData = data.filter(isSelected)

  const color = mapping.groupColors[groupValue]

  const averageCircle = {
    shape: "circle",
    cx: average(pluck(selectedData, mapping.x).map(parseFloat)),
    cy: average(pluck(selectedData, mapping.y).map(parseFloat)),
    stroke: color,
    strokeWidth: 1,
    r: 6,
    fill: 'white',
    key: 'average',
  }

  const circles = [
    ...selectedData.map(datumToCircle(mapping)),
    averageCircle
  ]

  const lines = selectedData
    .map((datum) => ({
      shape: "line",
      x1: parseFloat(datum[mapping.x]),
      y1: parseFloat(datum[mapping.y]),
      x2: averageCircle.cx,
      y2: averageCircle.cy,
      strokeWidth: 1,
      stroke: color,
      strokeOpacity: 0.3,
      key: `${datum[mapping.guid]}--average`
    }))

  const otherGroups = Object.entries(groupBy(data, mapping.groupBy))
    .filter(([currentGroupValue]) => currentGroupValue !== groupValue)
    .map(([groupValue, group]) => {
      return {
        shapes: group.map(datumToCircle(mapping)),
        animation: fadeAnimation(1, 0.5),
        groupValue
      }
    })

  return [
    ...otherGroups,
    {
      shapes: [
        ...lines,
        ...circles
      ],
      animation: fadeAnimation(0, 1),
      groupValue
    }
  ]
}

/**
 * Convenience function for creating a D3 scale function
 *
 * @param {array} data The graph input data
 * @param {string} domainKey The key in the input data corresponding
 *    the dimension to be scaled, e.g. X, Y
 * @param {array} range Minimum and maximum values
 */
function createScale (data, domainKey, range) {
  const domain = d3ArrayExtent(data, (datum) => datum[domainKey])
  return d3ScaleLinear()
    .domain(domain)
    .range(range)
}

/**
 * React ScatterPlot graph component using D3. Renders a points in linear 2D space.
 *
 * @param {array} props.data The data to be plotted
 * @param {object} props.mapping Defines how the data should be translated in to points
 * @param {string} props.mapping.groupBy Group points by this key from `data`
 * @param {function} props.mapping.filterBy Only include items from data that pass this test
 *
 */
class ScatterPlot extends React.PureComponent {
  render() {
    const {
      data,
      width,
      height,
      margin,
      showAverage,
      mapping
    } = this.props

    const filteredData = mapping.filterBy ? data.filter(mapping.filterBy) : data

    const xScale = createScale(filteredData, mapping.x, [0, width])

    const yScale = createScale(filteredData, mapping.y, [height, 0])

    const groups = showAverage
      ? makeDataTransformWithAverage(mapping, showAverage)(filteredData)
      : makeDataTransform(mapping)(filteredData)

    return <svg
      height={height + margin * 2}
      width={width + margin * 2}
    >
      {/* Add margin using a <g/> with transformation */}
      <g
        style={{
          transform: `translate(${margin}px, ${margin}px)`
        }}
      >
        {groups.map(({groupValue, shapes, animation}) => {
          return <AnimationGroup
            key={groupValue}
            animation={animation}
          >
            {shapes.map(({
              shape,
              key,
              ...svgAttrs
            }) => {

              const Shape = ({
                line: Line,
                circle: Circle
              })[shape]

              return <Shape
                key={key}
                xScale={xScale}
                yScale={yScale}
                {...svgAttrs}
              />
            })}
          </AnimationGroup>
        })}
      </g>
    </svg>
  }
}

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  margin: PropTypes.number,
  showAverage: PropTypes.string,
  mapping: PropTypes.object.isRequired
}

ScatterPlot.defaultProps = {
  margin: 10
}

export default ScatterPlot
