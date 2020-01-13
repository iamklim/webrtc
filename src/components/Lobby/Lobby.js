import React from 'react';
import './Lobby.sass';

import useUserMedia from '../../services/useUserMedia';
import useRTCP from '../../services/useRTCP';

import VideoStream from '../VideoStream';

function Lobby() {
  const localMediaStream = useUserMedia();
  const room = 'foo'; // TODO
  useRTCP(room, localMediaStream);

  return (
    <div className="lobby">
      <VideoStream stream={localMediaStream} />
      <div className="lobby__curtain" />
    </div>
  );
}

export default Lobby;
