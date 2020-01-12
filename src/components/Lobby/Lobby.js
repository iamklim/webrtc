import React from 'react';
import './Lobby.sass';

import useUserMedia from '../../services/useUserMedia';
import VideoStream from '../VideoStream';

function Lobby() {
  const localMediaStream = useUserMedia();

  return (
    <div className="lobby">
      <VideoStream stream={localMediaStream} />
      <div className="lobby__curtain" />
    </div>
  );
}

export default Lobby;
