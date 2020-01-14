export const sendMessage = (socket, message) => {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
};

export const handleIceCandidate = (event, socket) => {
  console.log('icecandidate event: ', event);
  if (event.candidate) {
    sendMessage(socket, {
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
    });
  } else {
    console.log('End of candidates.');
  }
};

export const handleRemoteStreamAdded = event => {
  console.log('Remote stream added.');
  const remoteStream = event.stream;
  console.log(remoteStream);
};

export const handleRemoteStreamRemoved = event => {
  console.log('Remote stream removed. Event: ', event);
};

export const createPeerConnection = socket => {
  try {
    const pc = new RTCPeerConnection(null);
    pc.onicecandidate = event => handleIceCandidate(event, socket);
    pc.onaddstream = event => handleRemoteStreamAdded(event);
    pc.onremovestream = event => handleRemoteStreamRemoved(event);
    console.log('Created RTCPeerConnnection');
    return pc;
    // setRtcpConnection(pc);
  } catch (e) {
    // eslint-disable-next-line prefer-template
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    return null;
  }
};

export const setLocalAndSendMessage = (
  rtcpConnection,
  socket,
  sessionDescription
) => {
  rtcpConnection.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message', sessionDescription);
  sendMessage(socket, sessionDescription);
};

export const doCall = (rtcpConnection, socket) => {
  console.log('Sending offer to peer');
  rtcpConnection
    .createOffer()
    .then(sessionDescription => {
      setLocalAndSendMessage(rtcpConnection, socket, sessionDescription);
    })
    .catch(err => {
      console.log('createOffer() error: ', err);
    });
};

export const doAnswer = (rtcpConnection, socket) => {
  console.log('Sending answer to peer.');
  rtcpConnection.createAnswer().then(answer => {
    setLocalAndSendMessage(rtcpConnection, socket, answer).catch(err => {
      console.log(`Failed to create session description: ${err.toString()}`);
    });
  });
};

export const maybeStart = (
  rtcpConnection,
  socket,
  localMediaStream,
  isStarted,
  isChannelReady,
  isInitiator,
  setIsStarted
) => {
  if (
    rtcpConnection &&
    localMediaStream &&
    !isStarted &&
    // typeof localMediaStream !== 'undefined' &&
    isChannelReady
  ) {
    console.log(
      '>>>>>>> maybeStart() ',
      isStarted,
      localMediaStream,
      isChannelReady
    );
    console.log('>>>>>> creating peer connection');
    createPeerConnection(socket);
    rtcpConnection.addStream(localMediaStream);
    setIsStarted(true);
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
};

// useEventListener('onbeforeunload', sendMessage('bye'));

export const stop = (rtcpConnection, setIsStarted, setRtcpConnection) => {
  setIsStarted(false);
  rtcpConnection.close();
  setRtcpConnection(null);
};

export const handleRemoteHangup = setIsInitiator => {
  console.log('Session terminated.');
  stop();
  setIsInitiator(false);
};
