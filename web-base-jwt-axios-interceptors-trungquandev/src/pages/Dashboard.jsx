// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { CircularProgress } from '@mui/material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
        console.log(res.data)
        setUser(res.data)
      } catch (error) {
        toast.error(error.response?.data?.message || error?.message)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    //Case 1: chỉ cần xóa thông tin trong localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')

    //Case 2: đối với cookies => gọi API xử lý remove Cookie
    await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`) // thường dùng method chuẩn là delete
    setUser(null) // phòng trường hợp ko được điều hướng tới trang login
    navigate('/login')
  }

  if (!user) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      maxWidth: '1120px',
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 1em'
    }}>
      <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{user?.email}</Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>
        <Button 
        type='button'
          variant= 'contained'
          color='info'
          size='large'
          sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end'}}
          onClick={handleLogout}
        >
          Logout
        </Button>
      <Divider sx={{ my: 2 }} />
    </Box>

  )
}

export default Dashboard
