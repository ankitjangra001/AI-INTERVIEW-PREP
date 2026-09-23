import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Job from "./pages/Job";
import Interview from "./pages/Interview";
import CreateJob from "./pages/CreateJob";
import JobAnalysis from "./pages/JobAnalysis";
import Questions from "./pages/Questions";
import Evaluation from "./pages/Evaluation";
import InterviewHistory from "./pages/InterviewHistory";
import InterviewHistoryDetails from "./pages/InterviewHistoryDetails";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/jobs"
        element={<Job />}
      />

      

      <Route
        path="/create-job"
        element={<CreateJob />}
      />
      <Route
         path="/job-analysis/:jobId"
        element={<JobAnalysis />}
      />
      <Route
         path="/interview/:jobId"
         element={<Interview />}
      />

      <Route
        path="/questions/:jobId"
        element={<Questions />}
       />

       <Route
  path="/evaluation/:jobId"
  element={<Evaluation />}
    />

    <Route
  path="/interview-history"
  element={<InterviewHistory />}
/>

<Route
  path="/interview-history/:id"
  element={<InterviewHistoryDetails />}
/>

    </Routes>
    

    
  );
}

export default App;