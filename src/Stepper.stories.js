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

storiesOf('ScatterPlot', module)
  .add('unfocused', () => <ScatterPlot
    width={100}
    height={100}
    points={[
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
        id: 'ZZZ',
        x: 22,
        y: 55,
        color: "orange"
      },
    ]}
  />)


