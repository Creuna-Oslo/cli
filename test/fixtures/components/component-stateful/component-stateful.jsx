import React from 'react';
import PropTypes from 'prop-types';

class ComponentStateful extends React.Component {
  static propTypes = {
    prop: PropTypes.text
  };

  render() {
    return <div className="component-stateful">{this.props.text}</div>;
  }
}

export default ComponentStateful;
