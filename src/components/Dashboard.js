import React from 'react';
import NavbarComponent from './Navbar';
import { Container, Jumbotron } from 'reactstrap';

const DashboardComponent = () => {
    return (
        <>
        <Jumbotron>
            <h1 className="display-3">Привет!</h1>
            <p className="lead">Это приложение поможет в решении некоторых задач! А каких? Придумай сам ;)</p>
            <hr className="my-2" />
            <p>Разработано мной для вас. <a href="https://github.com/Joel56ru/deka" rel="noreferrer nofollow" target="_blank">github</a></p>
        </Jumbotron>
        </>
    );
}

const Dashboard = () => {
    return (
        <>
        <NavbarComponent/>
        <Container>
            <DashboardComponent/>
        </Container>
        </>
    );
};
export default Dashboard;
  