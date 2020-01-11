import { MEDIA_CONSTRAINTS_SET } from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const setMediaConstraints = mediaConstraints => ({
  type: MEDIA_CONSTRAINTS_SET,
  payload: { mediaConstraints },
});
