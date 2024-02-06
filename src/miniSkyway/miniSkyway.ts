import { addIceCandidate, setIceCandidate } from '../rtc/ice';
import { getLocalStream, playVideo } from '../media/media';
import { reciveOffer, sendOffer } from '../rtc/sdp';
import { Socket, io } from 'socket.io-client';

export type SkywayConnection = {
  socket: Socket;
  peerConnection: RTCPeerConnection;
};

// RTCPeerConnectionとwebsocketの作成
export const createConnection = (config: RTCConfiguration | undefined) => {
  const socketUrl = 'https://kinakome-work.com';

  const socket = io(socketUrl);
  const peerConnection = new RTCPeerConnection(config);
  return { socket: socket, peerConnection: peerConnection };
};

// 発信者の接続準備
export const prepareCallerConnection = async (
  skywayConnection: SkywayConnection,
  calleeId: string
) => {
  const { peerConnection, socket } = skywayConnection;
  setIceCandidate(peerConnection, socket);
  addIceCandidate(peerConnection, socket, calleeId);

  await sendOffer(peerConnection, socket, calleeId);
  socket.on('reciveSdp', (answer: RTCSessionDescription) => {
    (async () => {
      await peerConnection.setRemoteDescription(answer);
    })();
  });
};

// 受信者の接続準備
export const prepareCalleeConnection = async (
  skywayConnection: SkywayConnection,
  callerId: string
) => {
  const { peerConnection, socket } = skywayConnection;

  socket.on('reciveSdp', (offer: RTCSessionDescription) => {
    (async () => {
      setIceCandidate(peerConnection, socket);
      addIceCandidate(peerConnection, socket, callerId);
      await reciveOffer(peerConnection, socket, offer, callerId);
    })();
  });
};

// ローカルの映像再生および配信
export const publishLocalVideo = async (
  skywayConnection: SkywayConnection,
  localVideoElement: HTMLVideoElement
) => {
  const { peerConnection } = skywayConnection;

  const localStream = await getLocalStream();
  if (localStream) {
    await playVideo(localVideoElement, localStream); // ローカルでビデオを再生

    const videoTrack = localStream.getVideoTracks()[0];
    peerConnection.addTrack(videoTrack, localStream); // ビデオを配信
  } else {
    console.warn('no local stream');
  }
};

// 通話相手の映像受信および再生
export const subscribeRemoteVideo = (
  skywayConnection: SkywayConnection,
  remoteVideoElement: HTMLVideoElement
) => {
  const { peerConnection } = skywayConnection;

  peerConnection.ontrack = (event) => {
    const stream = event.streams[0];
    playVideo(remoteVideoElement, stream);
  };
};
