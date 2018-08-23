import React from 'react'
import PropTypes from 'prop-types'

import { storiesOf } from '@storybook/react'

import Stepper, { shapes } from './Stepper.js'

class Graph extends React.Component {
  render() {
    const { data } = this.props

    return JSON.stringify(data)
  }
}

Graph.propTypes = {
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
      <Graph
        key='graph'
        data={this.props.steps[this.state.stepIndex]}
      />
    ]
  }
}

Container.propTypes = {
  steps: shapes.steps
}

storiesOf('Stepper', module)
  .add('minimal', () => <Stepper/>)
  .add('basic', () => {
    return <Container
      steps={[
        { data: "first step" },
        { data: "second step" },
        { data: "third step" }
      ]}
    />
  })

