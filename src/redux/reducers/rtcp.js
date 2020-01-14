/* eslint-disable import/named */
import {
  IS_CHANNEL_READY_SET,
  IS_INITIATOR_SET,
  IS_STARTED_SET,
} from '../actionTypes';

const initialState = {
  isChannelReady: false,
  isInitiator: false,
  isStarted: false,
};

const rtcp = (state = initialState, action) => {
  switch (action.type) {
    case IS_CHANNEL_READY_SET: {
      return { ...state, isChannelReady: action.payload };
    }
    case IS_INITIATOR_SET: {
      return { ...state, isInitiator: action.payload };
    }
    case IS_STARTED_SET: {
      return { ...state, isStarted: action.payload };
    }
    default: {
      return state;
    }
  }
};

export default rtcp;
