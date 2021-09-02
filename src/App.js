import {CssBaseline} from "@material-ui/core"
import "./style/App.scss";
import Content from "./components/Content";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
    <CssBaseline/>
    <Chat/>
    <Content/>
    </div>
  );
}

export default App;
