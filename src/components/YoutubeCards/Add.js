import React,{useState,useContext,useEffect} from 'react';
import {Row,Card,CardBody,CardTitle,Form, FormGroup, Button, Input, Col,Label,FormFeedback} from 'reactstrap';
import {Context} from './Context';

const AddCard = () => {
    const [urlVideo, seturlVideo] = useState('');
    const [startVideo, setstartVideo] = useState(0);
    const [endVideo, setendVideo] = useState(0);
    const [labelVideo, setlabelVideo] = useState('');
    const [isDisabled, setisDisabled] = useState(true);
    const {addCardRow} = useContext(Context);

    const AddRow = () =>{
        addCardRow(
            linkifyYouTubeURLs(urlVideo,false),
            startVideo,
            endVideo,
            labelVideo
        );
        seturlVideo('');
        setstartVideo(0);
        setendVideo(0);
        setlabelVideo('');
    }

    function linkifyYouTubeURLs(text,chek) {
        var re = /^https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*$/ig;
        if(chek){
            return re.test(text);
        }else{
            return text.replace(re, '$1');
        }
    }

    const [isurldisabled, setisurldisabled] = useState(false);
    useEffect(()=>{
        if(!linkifyYouTubeURLs(urlVideo,true) && urlVideo.length > 0){
            setisurldisabled(true);
        }else{
            setisurldisabled(false);
        }
    },[urlVideo]);
    
    const [islabeldisabled, setislabeldisabled] = useState(false);
    useEffect(()=>{
        if(labelVideo.length > 30){
            setislabeldisabled(true);
        }else{
            setislabeldisabled(false);
        }
    },[labelVideo]);

    useEffect(()=>{
        setisDisabled(startVideo < 0 || startVideo > endVideo || endVideo < 0 || !labelVideo || labelVideo.length > 30 || isurldisabled || !urlVideo);
    },[startVideo,endVideo,labelVideo,isurldisabled,urlVideo]);

    return (
    <Card outline color="secondary" className="my-1">
        <CardBody >
            <CardTitle tag="h6">Добавить видео Youtube</CardTitle>
            <Form>
                <Row className="my-1">
                    <Col>
                        <FormGroup>
                            <Label for="urlvideo" className="small">Ссылка на видео</Label>
                            <Input
                                invalid={isurldisabled}
                                id="urlvideo"
                                type="url"
                                name="urlvideo"
                                placeholder="Ссылка на видео"
                                value={urlVideo}
                                onChange={({ target }) => seturlVideo(target.value)}
                            />
                            <FormFeedback>Введите ссылку в формате https://www.youtube.com/watch?v=dQw4w9WgXcQ</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="my-1">
                    <Col>
                        <FormGroup>
                            <Label for="startvideo" className="small">Начало (сек.)</Label>
                            <Input
                                id="startvideo"
                                type="number"
                                name="startvideo"
                                placeholder="Начало в сек"
                                value={startVideo}
                                onChange={({ target }) => setstartVideo(Number(target.value))}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for="endvideo" className="small">Конец (сек.)</Label>
                            <Input
                                id="endvideo"
                                type="number"
                                name="endvideo"
                                placeholder="Конец в сек"
                                value={endVideo}
                                onChange={({ target }) => setendVideo(Number(target.value))}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="my-1">
                    <Col>
                        <FormGroup>
                            <Input
                                invalid={islabeldisabled}
                                type="text"
                                name="labelvideo"
                                placeholder="Описание"
                                value={labelVideo}
                                onChange={({ target }) => setlabelVideo(target.value)}
                            />
                            <FormFeedback>Описание не более 30 символов</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Button onClick={AddRow} disabled={isDisabled} color="primary">Добавить</Button>
            </Form>

        </CardBody>
    </Card>
    );
};
export default AddCard;