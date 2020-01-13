import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './VideoStream.sass';

import Loader from '../Loader';

function VideoStream({ stream, muted, minimized }) {
  const videoRef = useRef();

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`video-stream ${minimized ? 'video-stream--minimized' : ''}`}
    >
      <div className="video-stream__inner">
        {stream ? (
          <video
            autoPlay
            playsInline
            ref={videoRef}
            muted={muted}
            className="video-stream__inner-source"
          >
            <track default kind="captions" />
          </video>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

VideoStream.defaultProps = {
  stream: null,
  muted: true,
  minimized: false,
};

VideoStream.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
  muted: PropTypes.bool,
  minimized: PropTypes.bool,
};

export default VideoStream;
