import { pcConfig } from '../constants';

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

export default requestTurn;
