import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Lobby.sass';

import useMediaStream from '../../services/useMediaStream';

function Lobby({ mediaConstraints }) {
  useMediaStream(mediaConstraints);

  return (
    <div className="lobby">
      <p>Lobby</p>
    </div>
  );
}

Lobby.defaultProps = {
  mediaConstraints: {
    audio: true,
    video: true,
  },
};

Lobby.propTypes = {
  mediaConstraints: PropTypes.shape({
    audio: PropTypes.bool,
    video: PropTypes.bool,
  }),
};

const mapStateToProps = state => {
  return {
    media: state.media.mediaConstraints,
  };
};

// eslint-disable-next-line prettier/prettier
export default connect(
  mapStateToProps,
  null
)(Lobby);
