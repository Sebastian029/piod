import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index/Index";
import './App.css'
import MealPlan from "./pages/Meals/Meals";
import Qiestionaire from "./pages/Questionaire/Questionaire";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/questionnaire" element={<Qiestionaire />} />
        <Route path="/mealplan" element={<MealPlan />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
