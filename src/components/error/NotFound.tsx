import { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { TestAuthenticationResponse } from "../../types/authenticationTypes";
import { checkUserAuthentication } from "../../user/authentication";
import { setCurrentUser } from "../app/appSlice";
import { CurrentUserData } from "../../types/graphqlTypes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const NotFound = (props: {errorCode: string}) => {
    const dispatch = useAppDispatch()
    const userData = useAppSelector((state) => state.app.currentUser)
    useEffect(() => {
        const testAuthentication = async () => {
          const response: TestAuthenticationResponse = await checkUserAuthentication()
          if (response.authenticated) {
            dispatch(setCurrentUser(response.data as CurrentUserData))
          }
        }
      }, []);

    const { search } = useLocation();
    const navigate = useNavigate()
    const {errorCode} = props
    return (
        <Col className="about-page" style={{marginTop: '70px', paddingRight: '12px', marginLeft: '0px', height: '100%'}}>
            <Row style={{paddingTop: '200px'}}>
                <h1 style={{fontSize: '80px'}}>{errorCode}</h1>
            </Row>
            <Row><h3>Page Not Found</h3></Row>
            <Button style={{marginTop: '20px'}} onClick={() => navigate(`/customizeProduct/selectScenes/${search}`)}>Homepage</Button>
        </Col>
    );
}

export default NotFound;