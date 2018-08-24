import React from 'react'
import data from './data.js'
import ScatterPlot from './graphs/ScatterPlot.js'
import Stepper from './widgets/Stepper.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.scenes = [
      {},
      { showAverage: 'Low' },
      { showAverage: 'Medium' },
      { showAverage: 'High' },
      { showAverage: 'Very High' }
    ]

    this.state = {
      currentScene: 0
    }

    this.mapping = {
      guid: "ISO3",
      y: "MI Ratio",
      x: "Incidence",
      filterBy: (datum) => datum['Too small?'] === 'FALSE',
      groupBy: "HDI",
      groupColors: {
        'Very High': '#4AA1C9',
        'High': '#459162',
        'Medium': '#CF764D',
        'Low': '#9F3B42'
      }
    }
  }

  render() {
    const { countries } = data

    return <div>
      <ScatterPlot
        data={countries}
        mapping={this.mapping}
        width={600}
        height={600}
        margin={48}
        {...this.scenes[this.state.currentScene]}
      />
      <Stepper
        steps={this.scenes}
        stepIndex={this.state.currentScene}
        onStep={(currentScene) => this.setState({currentScene})}
        getStepKey={(step) => step.showAverage || 'All HDI levels'}
      />
    </div>
  }
}
