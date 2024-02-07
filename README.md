# ユーザーガイド

### インストール方法

```jsx
npm install https://github.com/kinakome/mini-skyway.git
```

### Step1 : SkywayConnection を取得

まずは createConnection で miniSkyWay への接続に必要なコネクタを取得します。

```jsx
const skywayConnection = createConnection();
```

### Step2 : 自分の ID を確認

通話に必要は ID は以下のように取得することが出来ます。

※シグナリングサーバ接続後に ID が取得できるようになるため、createConnection の直後に ID を取得した場合は undefined になる可能性があります。ID が unidefined になった場合は、時間をおいて再度 ID を取得してください。

```jsx
const myId = skywayConnection.socket.id;
```

### Step3 : 映像表示エリアの確保

自分と通話相手の映像を表示するための要素を取得しておきます。

※以下は React 使用したコードです

```tsx
const localVideoRef = useRef<HTMLVideoElement>(null);
const remoteVideRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  //自分の映像を表示する要素
  const localVideoElement = localVideoRef.current;
  //通話相手の映像を表示する要素
  const remoteVideoElement = remoteVideRef.current;
}, []);
```

### Step4 : 自分の映像を取得

step3 で取得した自分の映像を表示する要素を publishLocalVideo の引数に渡すことで、ビデオの再生および通話相手への映像配信準備が実施されます。

```jsx
await publishLocalVideo(skywayConnection, localVideoElement);
```

### Step5 : 通話を開始する

発信側は、prepareCallerConnection に着信者の ID を引数に渡して呼び出すことで、通話を開始することが出来ます。

着信側は、prepareCalleeConnection に発信者の ID を引数に渡して呼び出すことで、通話を開始することが出来ます。

```jsx
//発信者側
await prepareCallerConnection(skywayConnection, calleeId);

//着信者側
await prepareCalleeConnection(skywayConnection, callerId);
```

### Step6 : 相手の映像を受信する

prepareCallerConnection / prepareCalleeConnection を呼び出した後、step3 で取得した通話相手の映像を表示する要素を subscribeRemoteVideo の引数に渡すことで、通話相手の映像を表示することが出来ます。

```jsx
subscribeRemoteVideo(skywayConnection, remoteVideoElement);
```
