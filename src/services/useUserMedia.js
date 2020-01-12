import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function useUserMedia() {
  const [stream, setStream] = useState(null);
  const { mediaConstraints } = useSelector(state => state.media);

  useEffect(() => {
    const getStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints
        );
        setStream(mediaStream);
      } catch (err) {
        console.log(err);
      }
    };

    getStream();
  }, [mediaConstraints]);

  // cleanup streams
  // useEffect(() => {
  //   return () => {
  //     if (stream) {
  //       const tracks = stream.getTracks();
  //       tracks.forEach(track => {
  //         track.stop();
  //       });
  //     }
  //   };
  // }, [stream, dispatch]);

  return stream;
}

export default useUserMedia;
