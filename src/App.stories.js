import React from 'react'
import PropTypes from 'prop-types'

import { storiesOf } from '@storybook/react'

import Stepper, { shapes } from './widgets/Stepper.js'
import ScatterPlot from './graphs/ScatterPlot.js'

class EchoJson extends React.Component {
  render() {
    const { data } = this.props

    return JSON.stringify(data)
  }
}

EchoJson.propTypes = {
  data: PropTypes.object
}

class Container extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stepIndex: 0
    }

    this.handleStep = (stepIndex) => {
      this.setState({stepIndex})
    }
  }

  render() {
    return [
      <Stepper
        key='stepper'
        onStep={this.handleStep}
        stepIndex={this.state.stepIndex}
        steps={this.props.steps}
        getStepKey={this.props.getStepKey}
      />,
      React.cloneElement(React.Children.only(this.props.children), {
        data: this.props.steps[this.state.stepIndex]
      })
    ]
  }
}

Container.propTypes = {
  steps: shapes.steps,
  children: PropTypes.node
}

storiesOf('Stepper', module)
  .add('minimal', () => <Stepper steps={[]} stepIndex={0} getStepKey={()=>{}} />)
  .add('basic', () => {
    return <Container
      steps={[
        { data: "first step" },
        { data: "second step" },
        { data: "third step" }
      ]}
      stepIndex={0}
      getStepKey={({data}) => data}
    ><EchoJson/></Container>
  })

const data = [
  {
    ISO3: 'XXX',
    incidence: 55,
    mortality: 22,
    HDI: 'very high'
  },
  {
    ISO3: 'YYY',
    incidence: 44,
    mortality: 44,
    HDI: 'high'
  },
  {
    ISO3: 'ZZX',
    incidence: 33,
    mortality: 52,
    HDI: 'medium'
  },
  {
    ISO3: 'ZZY',
    incidence: 25,
    mortality: 46,
    HDI: 'medium'
  },
  {
    ISO3: 'ZZZ',
    incidence: 22,
    mortality: 55,
    HDI: "medium"
  },
]


const mapping = {
  guid: "ISO3",
  x: "incidence",
  y: "mortality",
  groupBy: "HDI",
  groupColors: {
    'very high': '#4AA1C9',
    'high': '#459162',
    'medium': '#CF764D',
    'low': '#9F3B42'
  }
}

storiesOf('ScatterPlot', module)
  .add('basic', () => <ScatterPlot
    width={200}
    height={200}
    data={data}
    mapping={mapping}
  />)
  .add('showing average of selection', () => <ScatterPlot
    width={200}
    height={200}
    data={data}
    mapping={mapping}
    showAverage={
      /* Support for `showAverage` could be added through composition
       * rather than built in if the ScatterPlot class becomes complicated.
       */
      "medium"
    }
  />)


