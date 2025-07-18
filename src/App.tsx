import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { PAGE } from "./constants";
import { CreateOrganization } from "./pages/CreateOrganization";
import { Home } from "./pages/Home";
import { CreateMatch } from "./pages/CreateMatch";
import { DetailsMatch } from "./pages/DetailsMatch";
import { AppLayout } from "./components/AppLayout";
import { InviteMatch } from "./pages/InviteMatch";
import { AuthGuard } from "./components/AuthGuard";
import "./app.scss";

function App() {

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route index path={PAGE.LOGIN()} element={<AuthGuard><Login /></AuthGuard>} />
          <Route path={PAGE.CREATE_ORGANIZATION()} element={<AuthGuard><CreateOrganization /></AuthGuard>} />
          <Route path={PAGE.HOME()} element={<AuthGuard><Home /></AuthGuard>} />
          <Route path={PAGE.CREATE_MATCH()} element={<AuthGuard><CreateMatch /></AuthGuard>} />
          <Route path={PAGE.DETAILS_MATCH()} element={<AuthGuard><DetailsMatch /></AuthGuard>} />
          <Route path={PAGE.INVITE_MATCH()} element={<InviteMatch />} />
        </Routes>
      </AppLayout>

    </Router>
  )
}

export default App
