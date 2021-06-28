import React, {useState,useRef,useEffect} from 'react';
import NavbarComponent from './Navbar';
import YouTube from 'react-youtube';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    InputGroup,
    Tooltip,
    Button,
    Input,
    InputGroupAddon,
    Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import useWebSocket, { ReadyState } from 'react-use-websocket';

function linkifyYouTubeURLs(text,chek) {
    var re = /^https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*$/ig;
    if(chek){
        return re.test(text);
    }else{
        return text.replace(re, '$1');
    }
}

const YouTubeViewerComponent = () => {
    const didUnmount = useRef(true);
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [roomws, setRoomws] = useState('');
    const [roomwsInput, setRoomwsInput] = useState('');
    const [src, setSrc] = useState('');
    const [srcInput, setSrcInput] = useState('');
    const [isReadyConnect, setisReadyConnect] = useState(false);
    const [isReadySend, setisReadySend] = useState(false);
    const [isReadyRemotePlay, setisReadyRemotePlay] = useState(false);
    const [isRemoteMute, setisRemoteMute] = useState(false);

    const {
        sendMessage,
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
        [ReadyState.CONNECTING]: {color: 'badge bg-info', status: 'Connecting'},
        [ReadyState.OPEN]: {color: 'badge bg-success', status: 'Online'},
        [ReadyState.CLOSING]: {color: 'badge bg-warning', status: 'Closing'},
        [ReadyState.CLOSED]: {color: 'badge bg-danger', status: 'Disconnected'},
        [ReadyState.UNINSTANTIATED]: {color: 'badge bg-danger', status: 'Uninstantiated'},
    }[readyState];

    useEffect(() => {
        if (localStorage.getItem('roomws') !== null){
            setRoomws(localStorage.getItem('roomws'));
            setRoomwsInput(localStorage.getItem('roomws'));
        }
    }, []);
    
    useEffect(() => {
        if (roomws === ''){
            return;
        }
        setCurrentSocketUrl('ws://localhost:8080/ws/' + roomws);
    }, [roomws]);

    /**
     * Подключение к WS 
     */
    const handleConnect = () => {
        localStorage.setItem('roomws',roomwsInput);
        setCurrentSocketUrl('ws://localhost:8080/ws/' + roomwsInput);
        sendMessage(JSON.stringify({auth: true}),[]);
    }
    /**
     * Отправка готовности и id видео 
     */
    const handleReady = () => {
        setisReadyRemotePlay(true);
        sendMessage(JSON.stringify({ready: true, src:src}),[]);
    }

    /**
     * Обработка ввода ссылки 
     */
    const handsrc = (event) => {
        if (linkifyYouTubeURLs(event,true)){
            setSrc(linkifyYouTubeURLs(event));
            setisReadySend(true);
        }else{
            setSrc('');
            setisReadySend(false);
        }
        setisReadyRemotePlay(false);
        setSrcInput(event);
    }

    /**
     * Стейты плеера на отправку
     */
    const handlePlayerOnStateChange = (event) => {
        if (isReadyRemotePlay){
            sendMessage(JSON.stringify(
                {
                    currenttime: event.target.getCurrentTime(),
                    play: event.target.getPlayerState(),
                    mute: isRemoteMute,
                }
            ),[]);
        }
    }

    /**
     * Ввод кода и готовность к подключению
     */
    const handleRoomWSInput = (event) => {
        setRoomwsInput(event);
        if (event !== ''){
            setisReadyConnect(true);
        }else{
            setisReadyConnect(false);
        }
    }

    /**
     * Управление звуком на удалённом подключении
     */
    const handleRemoneMute = () => {
        if (isReadyRemotePlay){
            setisRemoteMute(!isRemoteMute);
            sendMessage(JSON.stringify(
                {
                    mute: !isRemoteMute,
                }
            ),[]);
        }
    }

    /**
     * Отключить звук на локальном подключении
     */
    const handleReadyPlayer = (event) => {
        event.target.mute();
    }
    
    const opts = {
        height: 500,
        width: "100%",
        playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            fs: 1,
            showinfo: 0,
        },
    };
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);
    return (
        <>
        <Row className="my-3">
            <Col sm="12" lg={8}>
                <Card>
                    <CardHeader>Управление воспроизведением на плеере</CardHeader>
                    <CardBody>
                        <CardTitle tag="h5">Ссылка на Youtube </CardTitle>
                        <InputGroup className="my-3">
                            <Input 
                                value={srcInput}
                                onChange={({ target }) => handsrc(target.value)}
                                autoComplete="off"
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="primary" onClick={handleReady} disabled={!isReadySend}>Отправить</Button>
                                <Button color="secondary" className="ms-1" onClick={handleRemoneMute}><FontAwesomeIcon icon={isRemoteMute ? faVolumeMute : faVolumeUp}/></Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </CardBody>
                </Card>
            </Col>
            <Col sm="12" lg={4}>
                <Card>
                    <CardHeader>
                        <span className={connectionStatus.color}>{connectionStatus.status}</span>
                        <FontAwesomeIcon id="TooltipExample" className="ms-1 text-secondary" icon={faLink}/>
                        <Tooltip placement="right" isOpen={tooltipOpen} target="TooltipExample" toggle={toggle}>
                            http://localhost:3000/viewer/obs
                        </Tooltip>
                    </CardHeader>
                    <CardBody>
                        <CardTitle tag="h5">Код подключения</CardTitle>
                        <InputGroup className="my-3">
                            <Input 
                                value={roomwsInput}
                                onChange={({ target }) => handleRoomWSInput(target.value)}
                                autoComplete="off"
                                type="password"
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="primary" onClick={handleConnect} disabled={!isReadyConnect}>Подключить</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col sm="12">
                {
                    src === '' ?
                    (
                        ""
                    ) :
                    (
                    <YouTube
                        videoId={src}
                        opts={opts}
                        onStateChange={handlePlayerOnStateChange}
                        onReady={handleReadyPlayer}
                    />
                    )
                }
                
            </Col>
        </Row>
        </>
    );
}

const YouTubeViewer = () => {
    return (
        <>
        <NavbarComponent/>
        <Container>
            <YouTubeViewerComponent/>
        </Container>
        </>
    );
};
export default YouTubeViewer;
  