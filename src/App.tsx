import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Main} from "./pages/main/Main";
import {LoginRegister} from "./pages/login-register/login-register";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/events/EventsInfo/CreateEvent";
import EditEvent from "./pages/events/EventsInfo/EditEvent";
import {Profile} from "./pages/profile/profile";
import WorkoutDetails from "./pages/workouts/WorkoutInfo/WorkoutDetail";
import Workout from "./pages/workouts/Workout";
import CreateWorkout from "./pages/workouts/WorkoutInfo/CreateWorkout";
import EditWorkout from "./pages/workouts/WorkoutInfo/EditWorkout";
import Teams from "./pages/teams/Teams";
import CreateTeam from "./pages/teams/CreateTeam/CreateTeam";
import TacticalBoard from "./pages/tactical-board/TacticalBoard";
import UserPage from "./pages/user-page/user-page";
import PlayerStat from "./pages/player-stat/player-stat";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/auth" element={<LoginRegister/>}/>

                <Route path="/events" element={<Events/>}/>
                <Route path="/CreateEvent" element={<CreateEvent />}/>
                <Route path="/edit-event/:id" element={<EditEvent />}/>

                <Route path="/tactical-board" element={<TacticalBoard/>}/>

                <Route path="/team/" element={<Teams />}/>
                <Route path="/create-team/" element={<CreateTeam />}/>
                <Route path="/:role-info/:id" element={<UserPage />}/>
                <Route path="/player-info-stat/:id" element={<PlayerStat />}/>

                <Route path="/profile" element={<Profile/>} />

                <Route path="/workouts" element={<Workout />}/>
                <Route path="/workout/:id" element={<WorkoutDetails />}/>
                <Route path="/create-workout" element={<CreateWorkout />}/>
                <Route path="/edit-workout/:id" element={<EditWorkout />}/>
            </Routes>
        </Router>
    );
}

export default App;

