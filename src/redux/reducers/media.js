import { MEDIA_CONSTRAINTS_SET } from '../actionTypes';

const initialState = {
  mediaConstraints: {
    audio: true,
    video: true,
  },
};

const media = (state = initialState, action) => {
  switch (action.type) {
    case MEDIA_CONSTRAINTS_SET: {
      return { ...state, mediaConstraints: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default media;
