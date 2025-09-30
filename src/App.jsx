import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import DashboardPage from "@/components/pages/DashboardPage"
import TasksPage from "@/components/pages/TasksPage"
import NotesPage from "@/components/pages/NotesPage"
import MeetingsPage from "@/components/pages/MeetingsPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
          bodyClassName="text-sm"
        />
      </div>
    </BrowserRouter>
  )
}

export default App