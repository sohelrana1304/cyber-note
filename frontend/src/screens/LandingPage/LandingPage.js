import "./landingPage.css";
import { Button, Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BaseURL } from "../../helper/BaseURL";

const LandingPage = () => {

  const navigate = useNavigate()

  useEffect(()=>{
    const userInfo = localStorage.getItem("userInfo")

    if(userInfo){
      navigate("/mynotes")
    }
  }, [navigate])

  return (
    <div className="main">
      <Container>
        <Row>
          <div className="intro-text">
            <div>
              <h1 className="title">Welcome to Cyber Note</h1>
              <p className="subtitle">Keep your note safe</p>
            </div>
            <div className="buttonContainer">
              {/* <a href="/login"> */}
              <Link to={`${BaseURL}/login`}>
                <Button size="lg" className="landingbutton">
                  Login
                </Button>
              </Link>
              {/* </a> */}
              <a href="/register">
                <Button
                  size="lg"
                  className="landingbutton"
                  variant="outline-primary"
                >
                  Sign up
                </Button>
              </a>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};
export default LandingPage;
