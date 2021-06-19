import React from 'react';
import NavbarComponent from './Navbar';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    InputGroup,
    CardFooter,
    Button,
    Input,
    InputGroupAddon,
    ButtonGroup,
    Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeMute, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

const YouTubeViewerComponent = () => {
    return (
        <Row className="my-3">
            <Col sm="12" lg={{ size: 6, offset: 3 }}>
                <Card>
                    <CardHeader>Добавьте ссылку</CardHeader>
                    <CardBody>
                        <CardTitle tag="h5">Ссылка на Youtube</CardTitle>
                        <InputGroup className="my-3">
                            <Input />
                            <InputGroupAddon addonType="append">
                                <Button color="primary">Отправить</Button>
                            </InputGroupAddon>
                        </InputGroup>
                        <ButtonGroup>
                            <Button color="secondary"><FontAwesomeIcon icon={faPlay} /></Button>
                            <Button color="secondary"><FontAwesomeIcon icon={faBackward} /></Button>
                            <Button color="secondary"><FontAwesomeIcon icon={faForward} /></Button>
                            <Button color="secondary"><FontAwesomeIcon icon={faVolumeMute} /></Button>
                        </ButtonGroup>
                    </CardBody>
                    <CardFooter>Управляйте воспроизведением</CardFooter>
                </Card>
            </Col>
        </Row>
    );
}

const YouTubeViewer = () => {
    return (
        <>
        <NavbarComponent/>
        <Container fluid={true}>
            <YouTubeViewerComponent/>
        </Container>
        </>
    );
};
export default YouTubeViewer;
  