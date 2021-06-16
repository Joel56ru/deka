import React,{useContext} from 'react';
import {Card,CardBody,Button,CardHeader} from 'reactstrap';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import {Context} from './context';

const Cardembd = ({id,label,src,start,end}) => {
    const opts = {
        height: '200',
        width: '100%',
        playerVars: {
          autoplay: 0,
          start: start,
          end: end,
          rel:0,
          modestbranding:1,
          fs:0,
        },
    };
    const playerOnStart = (event)=>{
        event.target.seekTo(start);
    }
    const playerOnPause = (event)=>{
        event.target.pauseVideo();
    }
    const playerOnPauseSeekTo = (event)=>{
        playerOnStart(event);
        playerOnPause(event);
    }
    const {removeCard} = useContext(Context);
    const delRow = () =>{
        removeCard(
           id
        );
    }

    return (
    <Card outline color="secondary" className="my-1">
        <CardHeader>{label}
        <Button className="btn-close float-end" aria-label="Close" onClick={delRow}></Button>
        </CardHeader>
        <CardBody >
        <YouTube
            videoId={src}
            opts={opts}
            onPause={playerOnStart}
            onReady={playerOnPause}
            onEnd={playerOnPauseSeekTo}
        />
        </CardBody>
    </Card>
    );
};

Cardembd.propTypes = {
    label: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
};
Cardembd.defaultProps = { label: "", src: "", start: 0, end: 0};

export default Cardembd;