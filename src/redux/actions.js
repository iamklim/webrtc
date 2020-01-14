import {
  MEDIA_CONSTRAINTS_SET,
  IS_CHANNEL_READY_SET,
  IS_INITIATOR_SET,
  IS_STARTED_SET,
} from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const setMediaConstraints = mediaConstraints => ({
  type: MEDIA_CONSTRAINTS_SET,
  payload: { mediaConstraints },
});

export const setIsChannelReady = bool => ({
  type: IS_CHANNEL_READY_SET,
  payload: { bool },
});

export const setIsInitiator = bool => ({
  type: IS_INITIATOR_SET,
  payload: bool,
});

export const setIsStarted = bool => ({
  type: IS_STARTED_SET,
  payload: { bool },
});
