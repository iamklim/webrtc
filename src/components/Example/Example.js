// Component with basic useEffect hooks as example, feel free to copy and rename

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Example.sass';

import { connect } from 'react-redux';
import { actionExample } from '../../redux/actions';

function Example({ prop1, prop2 }) {
  // Setting state
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Component mounted');
    return () => {
      // eslint-disable-next-line no-console
      console.log('Component will unmount');
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Component mounted or updated');
  });

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Property prop1 is set or changed');
  }, [prop1]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Property prop2 is set or changed');
  }, [prop2]);

  return (
    <div className="example">
      <p>Example Component with passed {prop2}</p>
    </div>
  );
}

Example.defaultProps = {
  prop2: '',
};

Example.propTypes = {
  prop1: PropTypes.bool.isRequired,
  prop2: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    stateOption1: state.reducerExample.stateOption1,
  };
};

// eslint-disable-next-line prettier/prettier
export default connect(
  mapStateToProps,
  { actionExample }
)(Example);
