import React, {useState,useRef,useEffect} from 'react';
import YouTube from 'react-youtube';
import {
    Container,
    Row,
    Col,
    Alert,
} from 'reactstrap';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function gencode(){
    let password = "";
    let symbols = "abcdefghijkl0123456789mnopqrstuvwxyz";
    for (let i = 0; i < 15; i++){
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));     
    }
    return password;
}
/**
 * Обработчик плеера
 */
var targetevent;
const StreamViewer = () => {
    const didUnmount = useRef(true);
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [roomws, setRoomws] = useState('');
    const [isAuth, setIsAuth] = useState(false);
    const [isReady, setisReady] = useState(false);
    const [src, setSrc] = useState('');
    

    const {
        lastMessage,
        readyState,
    } = useWebSocket(currentSocketUrl, {
        shouldReconnect: () => {
            return didUnmount.current === true;
        },
        reconnectAttempts: 100,
        reconnectInterval: 3000,
        share: true,
    });
    useEffect(() => {
        return () => {
            didUnmount.current = true;
        };
    }, []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: {check: true, color: 'warning', status: 'Connecting'},
        [ReadyState.OPEN]: {check: false, color: 'success', status: 'Online'},
        [ReadyState.CLOSING]: {check: true, color: 'danger', status: 'Closing'},
        [ReadyState.CLOSED]: {check: true, color: 'danger', status: 'Disconnected'},
        [ReadyState.UNINSTANTIATED]: {check: true, color: 'danger', status: 'Uninstantiated'},
    }[readyState];


    useEffect(() => {
        if (localStorage.getItem('roomws') === null){
            setRoomws(gencode());
        }else{
            setRoomws(localStorage.getItem('roomws'));
        }
        if (localStorage.getItem('auth') !== null){
            setIsAuth(localStorage.getItem('auth'));
        }
    }, []);

    useEffect(() => {
        if (roomws === ''){
            return;
        }
        localStorage.setItem('roomws',roomws);
        setCurrentSocketUrl('ws://localhost:8080/ws/' + roomws);
    }, [roomws]);

    useEffect(() => {
        if (lastMessage === null) {
            return;
        }
        let mess = JSON.parse(lastMessage.data);
        if (mess.auth !== undefined) {
            localStorage.setItem('auth',true);
            setIsAuth(mess.auth);
        }
        if (mess.ready !== undefined) {
            setisReady(mess.ready);
            setSrc(mess.src);
        }
        if (mess.currenttime !== undefined) {
            targetevent.seekTo(mess.currenttime);
        }
        if (mess.play !== undefined) {
            if(mess.play === 1){
                targetevent.playVideo();
            }
            if(mess.play === 2 || mess.play === 3){
                targetevent.pauseVideo();
            }
        }
        if (mess.mute !== undefined) {
            if (mess.mute){
                targetevent.mute();
            }else{
                targetevent.unMute();
            }
        }
    }, [lastMessage]);
    
    const handleReadyPlayer = (event) => {
        targetevent = event.target;
    }
    
    const opts = {
        height: 1080,
        width: 1920,
        playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            fs: 0,
            howinfo: 0,
        },
    };
    return (
        <>
        {
        isAuth ? (
        <Container fluid={true} className="m-0 p-0" style={{height: 1080, width: 1920, overflow: "hidden"}}>
            {
                connectionStatus.check ? (
                    <Alert fade className="m-3" color={connectionStatus.color}>
                        {connectionStatus.status}
                    </Alert>
                ) : ("")
            }
           
            {
                isReady ? (
                    <YouTube
                        videoId={src}
                        opts={opts}
                        onReady={handleReadyPlayer}
                    />
                ) :
                (
                    ""
                )
            }
            
        </Container>
        ) :
        (
        <Container className="bg-white">
            <Row>
                <Col sm="12" md={{ size: 6, offset: 3 }}>
                    <h1 className="display-1 my-5 text-center">{roomws}</h1>
                </Col>
            </Row>
        </Container>
        )
        }
        </>
    );
};
export default StreamViewer;
  