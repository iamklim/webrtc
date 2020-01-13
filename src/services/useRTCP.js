import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io';

import { pcConfig } from '../constants';
import useEventListener from './useEventListener';

function useRTCP({ localMediaStream }) {
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [rtcpConnection, setRtcpConnection] = useState(null);
  // const [turnReady, setTurnReady] = useState(null);
  const room = 'foo'; // TODO
  const socket = io.connect();

  const sendMessage = useCallback(
    message => {
      console.log('Client sending message: ', message);
      socket.emit('message', message);
    },
    [socket]
  );

  const handleIceCandidate = useCallback(
    event => {
      console.log('icecandidate event: ', event);
      if (event.candidate) {
        sendMessage({
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.log('End of candidates.');
      }
    },
    [sendMessage]
  );

  const handleRemoteStreamAdded = event => {
    console.log('Remote stream added.');
    const remoteStream = event.stream;
    console.log(remoteStream);
  };

  const handleRemoteStreamRemoved = event => {
    console.log('Remote stream removed. Event: ', event);
  };

  const createPeerConnection = useCallback(() => {
    try {
      const pc = new RTCPeerConnection(null);
      pc.onicecandidate = handleIceCandidate;
      pc.onaddstream = handleRemoteStreamAdded;
      pc.onremovestream = handleRemoteStreamRemoved;
      setRtcpConnection(pc);
      console.log('Created RTCPeerConnnection');
    } catch (e) {
      // eslint-disable-next-line prefer-template
      console.log('Failed to create PeerConnection, exception: ' + e.message);
    }
  }, [handleIceCandidate]);

  const setLocalAndSendMessage = useCallback(
    sessionDescription => {
      rtcpConnection.setLocalDescription(sessionDescription);
      console.log('setLocalAndSendMessage sending message', sessionDescription);
      sendMessage(sessionDescription);
    },
    [rtcpConnection, sendMessage]
  );

  const doCall = useCallback(() => {
    console.log('Sending offer to peer');
    rtcpConnection
      .createOffer()
      .then(sessionDescription => {
        setLocalAndSendMessage(sessionDescription);
      })
      .catch(err => {
        console.log('createOffer() error: ', err);
      });
  }, [rtcpConnection, setLocalAndSendMessage]);

  const doAnswer = useCallback(() => {
    console.log('Sending answer to peer.');
    rtcpConnection.createAnswer().then(answer => {
      setLocalAndSendMessage(answer).catch(err => {
        console.log(`Failed to create session description: ${err.toString()}`);
      });
    });
  }, [rtcpConnection, setLocalAndSendMessage]);

  const maybeStart = useCallback(() => {
    console.log(
      '>>>>>>> maybeStart() ',
      isStarted,
      localMediaStream,
      isChannelReady
    );
    if (
      !isStarted &&
      typeof localMediaStream !== 'undefined' &&
      isChannelReady
    ) {
      console.log('>>>>>> creating peer connection');
      createPeerConnection();
      rtcpConnection.addStream(localMediaStream);
      setIsStarted(true);
      console.log('isInitiator', isInitiator);
      if (isInitiator) {
        doCall();
      }
    }
  }, [
    createPeerConnection,
    doCall,
    isChannelReady,
    isInitiator,
    isStarted,
    localMediaStream,
    rtcpConnection,
  ]);

  useEventListener('onbeforeunload', sendMessage('bye'));

  const stop = useCallback(() => {
    setIsStarted(false);
    rtcpConnection.close();
    setRtcpConnection(null);
  }, [rtcpConnection]);

  const handleRemoteHangup = useCallback(() => {
    console.log('Session terminated.');
    stop();
    setIsInitiator(false);
  }, [stop]);

  const requestTurn = turnURL => {
    let turnExists = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const i in pcConfig.iceServers) {
      if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
        turnExists = true;
        // setTurnReady(true);
        break;
      }
    }
    if (!turnExists) {
      console.log('Getting TURN server from ', turnURL);
      // No TURN server. Get one from computeengineondemand.appspot.com:
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const turnServer = JSON.parse(xhr.responseText);
          console.log('Got TURN server: ', turnServer);
          pcConfig.iceServers.push({
            urls: `turn:${turnServer.username}@${turnServer.turn}`,
            credential: turnServer.password,
          });
          // setTurnReady(true);
        }
      };
      xhr.open('GET', turnURL, true);
      xhr.send();
    }
  };

  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
      );
    }
  }, []);

  useEffect(() => {
    console.log('Adding local stream.');
    if (localMediaStream) {
      sendMessage('got user media');
      if (isInitiator) {
        maybeStart();
      }
    }
  }, [isInitiator, localMediaStream, maybeStart, sendMessage]);

  useEffect(() => {
    if (room !== '') {
      socket.emit('create or join', room);
      console.log('Attempted to create or  join room', room);
    }

    socket.on('created', () => {
      // eslint-disable-next-line prefer-template
      console.log('Created room ' + room);
      setIsInitiator(true);
    });

    socket.on('full', () => {
      // eslint-disable-next-line prefer-template
      console.log('Room ' + room + ' is full');
    });

    socket.on('join', () => {
      // eslint-disable-next-line prefer-template
      console.log('Another peer made a request to join room ' + room);
      // eslint-disable-next-line prefer-template
      console.log('This peer is the initiator of room ' + room + '!');
      setIsChannelReady(true);
    });

    socket.on('joined', () => {
      // eslint-disable-next-line prefer-template
      console.log('joined: ' + room);
      setIsChannelReady(true);
    });

    socket.on('log', array => {
      // eslint-disable-next-line prefer-spread
      console.log.apply(console, array);
    });

    socket.on('message', message => {
      console.log('Client received message:', message);
      if (message === 'got user media') {
        maybeStart();
      } else if (message.type === 'offer') {
        if (!isInitiator && !isStarted) {
          maybeStart();
        }
        rtcpConnection.setRemoteDescription(new RTCSessionDescription(message));
        doAnswer();
      } else if (message.type === 'answer' && isStarted) {
        rtcpConnection.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate' && isStarted) {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate,
        });
        rtcpConnection.addIceCandidate(candidate);
      } else if (message === 'bye' && isStarted) {
        handleRemoteHangup();
      }
    });
  }, [
    doAnswer,
    handleRemoteHangup,
    isInitiator,
    isStarted,
    maybeStart,
    rtcpConnection,
    setLocalAndSendMessage,
    socket,
  ]);
}

export default useRTCP;
