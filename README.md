# ユーザーガイド

### インストール方法

```jsx
npm install https://github.com/kinakome/mini-skyway.git
```

### Step1 : SkywayConnectionを取得

まずはcreateConnectionでminiSkyWayへの接続に必要なコネクタを取得します。

```jsx
const skywayConnection = createConnection();
```

### Step2 : 自分のIDを確認

通話に必要はIDは以下のように取得することが出来ます。

※シグナリングサーバ接続後にIDが取得できるようになるため、createConnectionの直後にIDを取得した場合はundefinedになる可能性があります。IDがunidefinedになった場合は、時間をおいて再度IDを取得してください。

```jsx
const myId = skywayConnection.socket.id
```

### Step3 : 映像表示エリアの確保

自分と通話相手の映像を表示するための要素を取得しておきます。

※以下はReact使用したコードです

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

step3で取得した自分の映像を表示する要素をpublishLocalVideoの引数に渡すことで、ビデオの再生および通話相手への映像配信準備が実施されます。

```jsx
await publishLocalVideo(skywayConnection, localVideoElement);
```

### Step5 : 通話を開始する

発信側は、prepareCallerConnectionに着信者のIDを引数に渡して呼び出すことで、通話を開始することが出来ます。

着信側は、prepareCalleeConnectionに発信者のIDを引数に渡して呼び出すことで、通話を開始することが出来ます。

```jsx
//発信者側
await prepareCallerConnection(skywayConnection, calleeId);

//着信者側
await prepareCalleeConnection(skywayConnection, callerId);
```

### Step6 : 相手の映像を受信する

prepareCallerConnection / prepareCalleeConnectionを呼び出した後、step3で取得した通話相手の映像を表示する要素をsubscribeRemoteVideoの引数に渡すことで、通話相手の映像を表示することが出来ます。