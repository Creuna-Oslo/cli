import React from 'react';
import PropTypes from 'prop-types';

const ComponentStateless = ({ prop }) => (
  <div className="component-stateless">{prop}</div>
);

ComponentStateless.propTypes = {
  prop: PropTypes.string
};

export default ComponentStateless;
