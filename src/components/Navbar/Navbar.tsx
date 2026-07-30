import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Games as GamesIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1} 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box component={Link} to="/" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          textDecoration: 'none',
          color: theme.palette.text.primary,
        }}>
          <GamesIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            GameCatalog
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          <Button component={Link} to="/games" color="inherit">
            Browse Games
          </Button>

          {isAdmin ? (
            <>
              <Button
                component={Link}
                to="/admin"
                variant="contained"
                startIcon={<AdminIcon />}
              >
                Admin Panel
              </Button>
              <Button
                onClick={handleLogout}
                color="inherit"
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/admin"
              variant="outlined"
              startIcon={<LoginIcon />}
            >
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/games" onClick={handleClose}>
          Browse Games
        </MenuItem>
        {isAdmin ? (
          [
            <MenuItem key="admin" component={Link} to="/admin" onClick={handleClose}>
              Admin Panel
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              Logout
            </MenuItem>
          ]
        ) : (
          <MenuItem component={Link} to="/admin" onClick={handleClose}>
            Admin Login
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Navbar;
