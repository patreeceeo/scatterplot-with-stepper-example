import React from 'react'
import data from './data.js'
import ScatterPlot from './graphs/ScatterPlot.js'

const mapping = {
  guid: "ISO3",
  y: "MI Ratio",
  x: "Incidence",
  groupBy: "HDI",
  filterBy: (datum) => datum['Too small?'] === 'FALSE',
  groupColors: {
    'Very High': '#4AA1C9',
    'High': '#459162',
    'Medium': '#CF764D',
    'Low': '#9F3B42'
  }
}

export default class App extends React.Component {
  render() {
    const { countries } = data
    return <ScatterPlot
      data={countries}
      mapping={mapping}
      width={600}
      height={600}
      margin={48}
    />
  }
}
