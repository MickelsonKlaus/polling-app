import Index from "./pages";
import {
  Routes,
  Route,
} from "react-router-dom";
import Voting from "./pages/voting";

function App() {
  return (
    <main className="layout min-h-screen w-full bg-cover bg-center p-5 lg:p-10">
      <Routes>
        <Route index element={<Index />} />
        <Route
          path="/:pollId"
          element={<Voting />}
        />
      </Routes>
    </main>
  );
}

export default App;
