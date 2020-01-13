export const pcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

export const sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};
