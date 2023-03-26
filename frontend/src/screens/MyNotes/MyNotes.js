import { useEffect } from "react";
import { Accordion, Badge, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MainScreen from "../../components/MainScreen";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction, listNotes } from "../../actions/notesActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

const MyNotes = ({ search }) => {
  const dispatch = useDispatch();
  const noteList = useSelector((state) => state.noteList);
  const { loading, error, notes } = noteList;

  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const noteCrate = useSelector((state) => state.noteCrate);
  const { success: successCreate } = noteCrate;

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { success: successUpdate } = noteUpdate;

  const noteDelete = useSelector((state) => state.noteDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = noteDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
    dispatch(listNotes());
  }, [
    dispatch,
    successCreate,
    navigate,
    userInfo,
    successUpdate,
    successDelete,
  ]);

  return (
    <div>
      <MainScreen title={`Welcome ${userInfo?.name?.split(" ")[0]}...`}>
        <Link to="/createnote">
          <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
            Create a Note
          </Button>
        </Link>
        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}
        {notes
          ?.reverse()
          .filter((filterdNote) =>
            filterdNote.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((note) => (
            <Accordion defaultActiveKey="0">
              <Card style={{ margin: 10 }}>
                <Card.Header style={{ display: "flex"}}>
                  <span
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                      fontWeight: "bold"
                    }}
                  >
                    <Accordion.Header>{note.title}</Accordion.Header>
                  </span>
                  <div>
                    <Link to={`/note/${note._id}`}>
                      <Button>Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="mx-2"
                      onClick={() => deleteHandler(note._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Header>
                <Accordion.Body>
                  <Card.Body>
                    <h4>
                      <Badge pill bg="success">
                        Category - {note.category}
                      </Badge>
                    </h4>
                    <blockquote className="blockquote mb-0">
                      <p>{note.content}</p>
                      <footer className="blockquote-footer">
                        Created On - {note.createdAt.substring(0, 10)}
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Accordion.Body>
              </Card>
            </Accordion>
          ))}
      </MainScreen>
    </div>
  );
};
export default MyNotes;
