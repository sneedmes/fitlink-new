import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Main} from "./pages/main/Main";
import {LoginRegister} from "./pages/login-register/login-register";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/events/EventsInfo/CreateEvent";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/events" element={<Events/>}/>

                <Route path="/CreateEvent" element={<CreateEvent />}/>
                {/*<Route path="/catalog/:id" element={<CompanyPage />} />*/}
                {/*<Route path="/profile" element={<Profile />} />*/}
                {/*<Route path="/auth" element={<AuthLanding/>}/>*/}
                {/*/!*<Route path="/company/:id/chat" element={<ChatPage />} />*!/*/}
                <Route path="/auth" element={<LoginRegister/>}/>
            </Routes>
        </Router>
    );
}

export default App;

