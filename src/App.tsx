import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WorkshopProfilePage from './pages/WorkshopProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/workshop/:slug" element={<WorkshopProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
