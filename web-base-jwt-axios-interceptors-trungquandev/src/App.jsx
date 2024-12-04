// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from '~/pages/Dashboard'
import Login from '~/pages/Login'

const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if(!user) return <Navigate to="/login" replace={true} />
  return <Outlet />  // Nếu có thông tin tài khoản thì mới cho chạy vào Outlet
}
const UnAuthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if(user) return <Navigate to="/dashboard" replace={true} />
  return <Outlet /> // Nếu có thông tin tài khoản thì mới cho chạy vào Outlet
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnAuthorizedRoutes/> }>
        <Route path='/login' element={<Login />} />
      </Route>

      {/* Outlet của react-router-Dom sẽ chạy vài child route trong này 
          Đưa các route cần xác thực mới được vào đây
      
      */}
      <Route element={<ProtectedRoutes/>}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>

    </Routes>
  )
}

export default App
