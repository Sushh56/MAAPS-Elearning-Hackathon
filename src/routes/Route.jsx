import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
import LoginForm from '../pages/Login';
import AdminSignIn from '../pages/AdminSignIn';
import Dashboard from '../pages/Dashboard';
import { GlobalStateProvider } from '../hooks/WindowHooks';
import { UserManagement } from '../pages/Admin/UserManagement';
import { CourseManagement } from '../pages/CourseHead/CourseManagement';
import ModifyCourses from '../pages/CourseHead/ModifyCourses';
import CreateQuiz from '../pages/CourseHead/CreateQuiz';
import AttendQuizPage from '../pages/AttendQuizPage';

const RouteSpecs = () => {
    return (
        <GlobalStateProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path='/admin/signin' element={<AdminSignIn />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/manage/user' element={<UserManagement />} />
                    <Route path='/manage/courses' element={<CourseManagement />} />
                    <Route path='/manage/courses/:id/quiz' element={<CreateQuiz />} />
                    <Route path='/manage/courses/:id/quiz/:qid' element={<AttendQuizPage />} />
                    <Route path='/manage/courses/:id' element={<ModifyCourses />} />
                </Routes>
            </Router>
        </GlobalStateProvider>
    );
}

export default RouteSpecs;