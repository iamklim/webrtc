import React from 'react';
import './Loader.sass';
import { CircularProgress } from '@material-ui/core';

function Loader() {
  return (
    <div className="loader">
      <CircularProgress />
    </div>
  );
}

export default Loader;
