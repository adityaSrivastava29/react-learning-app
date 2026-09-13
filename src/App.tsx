import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import { store } from "./store";
import Layout from "./components/Layout";
import HomePage from "./routes/HomePage";
import AboutPage from "./routes/AboutPage";
import CounterPage from "./routes/CounterPage";
import TodoPage from "./routes/TodoPage";
import TodoCompleted from "./features/todos/components/TodoCompleted";
import TodoPending from "./features/todos/components/TodoPending";
import ThemePage from "./routes/ThemePage";
import ProfilePage from "./routes/ProfilePage";
import SettingsPage from "./routes/SettingsPage";
import withLogger from "./components/hoc/withLogger";
import "./utils/i18n"; // Initialize i18n
import HooksPage from "./routes/HooksPage";
import RtkQueryPage from "./routes/RtkQueryPage";
import TrickyQuestionsPage from "./routes/TrickyQuestionsPage";
import OptimizationPage from "./routes/OptimizationPage";
import GithubStats from "./routes/GithubStats";

// HOC demonstration - wrap the entire app with logging
const AppWithLogger = withLogger(() => (
  <Provider store={store}>
    <ThemeProvider>
      <Router basename="/react-learning-app">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hooks" element={<HooksPage />} />
            <Route path="/rtk-query" element={<RtkQueryPage />} />
            <Route path="/tricky-questions" element={<TrickyQuestionsPage />} />
            <Route path="/optimization" element={<OptimizationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/todos/*" element={<TodoPage />}>
              <Route path="completed" element={<TodoCompleted />} />
              <Route path="pending" element={<TodoPending />} />
            </Route>
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/github" element={<GithubStats />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  </Provider>
));

function App() {
  return <AppWithLogger />;
}

export default App;
