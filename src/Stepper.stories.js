import React from 'react'
import PropTypes from 'prop-types'

import { storiesOf } from '@storybook/react'

import Stepper, { shapes } from './Stepper.js'
import ScatterPlot from './ScatterPlot.js'

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
        steps={this.props.steps}
        onStep={this.handleStep}
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
  .add('minimal', () => <Stepper steps={[]} />)
  .add('basic', () => {
    return <Container
      steps={[
        { data: "first step" },
        { data: "second step" },
        { data: "third step" }
      ]}
    ><EchoJson/></Container>
  })

const points = [
  {
    id: 'XXX',
    x: 55,
    y: 22,
    color: 'green'
  },
  {
    id: 'YYY',
    x: 44,
    y: 44,
    color: 'yellow'
  },
  {
    id: 'ZZX',
    x: 33,
    y: 52,
    color: "orange"
  },
  {
    id: 'ZZY',
    x: 25,
    y: 46,
    color: "orange"
  },
  {
    id: 'ZZZ',
    x: 22,
    y: 55,
    color: "orange"
  },
]

storiesOf('ScatterPlot', module)
  .add('basic', () => <ScatterPlot
    width={200}
    height={200}
    points={points}
  />)
  .add('showing average of selection', () => <ScatterPlot
    width={200}
    height={200}
    points={points}
    showAverage={
      /* Support `showAverage` could be added through composition
       * rather than built in if the ScatterPlot class becomes complicated.
       */
      ({color}) => color === 'orange'
    }
  />)


