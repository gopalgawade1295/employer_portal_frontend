import './App.css';
import RegistrationForm from './components/RegistrationForm';
import { Link, Outlet, createBrowserRouter, useLocation } from 'react-router-dom';
import SuperAdmin from './components/SuperAdmin';
import JobProvider from './components/JobProvider';
import JobProviderLogin from './components/JobProviderLogin';
import Typography from '@mui/joy/Typography';
import { Box } from '@mui/material';
import Button from '@mui/joy/Button';
import JobProviderPortal from './components/JobProviderPortal';
import SuperAdminLogin from './components/SuperAdminLogin';

export const App = () => {
  const location = useLocation()

  return (
    <div className="App">
      <Typography level="h2" sx={{ m: 3, mb: 1, color: '#FF7900' }}>
        {location.pathname.includes('superadmin') ?
          "ADMIN PORTAL" :
          location.pathname === '/' ?
            "JOB PORTAL" :
            "EMPLOYER PORTAL"
        }
      </Typography>

      {location.pathname === '/' ?
        <Box>
          <Link to='/employerregistration'>
            <Button
              variant="solid"
              sx={{ m: 1, width: '300px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
            >
              Employer Registration Form
            </Button>
          </Link>
          <br />

          <Link to='/jobprovider'>
            <Button
              variant="solid"
              sx={{ m: 1, width: '300px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
            >
              Employer Portal
            </Button>
          </Link>
          <br />

          <Link to='/superadmin'>
            <Button
              variant="solid"
              sx={{ m: 1, width: '300px', background: '#FF7900', '&:hover': { background: '#FF7900' } }}
            >
              Admin Portal
            </Button>
          </Link>
        </Box> :
        <Box sx={{ width: '100%', textAlign: 'left', background: '#FEF5E7' }}>
          <Link to='/'>
            <Button
              variant="outlined"
              sx={{ m: 1, width: '100px', color: '#FF7900', border: '1px solid #FF7900', '&:hover': { border: '1px solid #FF7900', background: '#FFFFFF' } }}
            >
              Back
            </Button>
          </Link>
        </Box>
      }

      <Outlet />
    </div>
  );
}

export const MainRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/jobprovider',
        element: <JobProvider />
      },
      {
        path: '/superadmin',
        element: <SuperAdminLogin />
      },
      {
        path: '/superadminportal',
        element: <SuperAdmin />
      },
      {
        path: '/employerregistration',
        element: <RegistrationForm />
      },
      {
        path: '/jobproviderlogin',
        element: <JobProviderLogin />
      },
      {
        path: '/jobproviderportal',
        element: <JobProviderPortal />
      }
    ]
  },
])
