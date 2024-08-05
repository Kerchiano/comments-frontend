import './App.css'
import CommentDetail from './components/CommentDetail';
import MainPage from './components/MainPage'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="mainpage/" element={<MainPage />} />
          <Route path="/detail-title-comments/:id" element={<CommentDetail />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
