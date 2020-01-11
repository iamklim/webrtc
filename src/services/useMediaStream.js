import { useEffect } from 'react';

const useMediaStream = constraints => {
  useEffect(() => {
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log(stream);
      } catch (err) {
        console.log(err);
      }
    }

    getStream();
  }, [constraints]);
};

export default useMediaStream;
