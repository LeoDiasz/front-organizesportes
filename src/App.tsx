import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { Login } from "./pages/Login";
import { PAGE } from "./constants";
import { CreateOrganization } from "./pages/CreateOrganization";
import { Home } from "./pages/Home";
import { CreateMatch } from "./pages/CreateMatch";
import { ListMatchs } from "./pages/ListMatchs";
import "./app.scss";  

function App() {

  return (
    <Router>
      <Routes>
        <Route index path={PAGE.LOGIN()} element={<Login />} />
        <Route path={PAGE.CREATE_ORGANIZATION()} element={<CreateOrganization/>} />
        <Route path={PAGE.HOME()} element={<Home/>} /> 
        <Route path={PAGE.CREATE_MATCH()} element={<CreateMatch/>} />
        <Route path={PAGE.LIST_MATCHS()} element={<ListMatchs/>} />
      </Routes>
    </Router>
  )
}

export default App
