import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext";
import { PrivateRoute } from "./components/Auth/PrivateRoute";
import Index from "./pages/Index/Index";
import './App.css'
import MealPlan from "./pages/Meals/Meals";
import Qiestionaire from "./pages/Questionaire/Questionaire";

function App() {
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/questionnaire" element={
              <PrivateRoute>
                <Qiestionaire />
              </PrivateRoute>} />
          <Route path="/mealplan" element={
            <PrivateRoute>
              <MealPlan />
            </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )

}

export default App
