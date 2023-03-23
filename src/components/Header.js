import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Info as InfoIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain } from '@fortawesome/free-solid-svg-icons'

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Information', path: '/information' },
  ];

  const renderMenuItems = () => (
    <List>
      {menuItems.map((item) => (
        <ListItem button key={item.text} component={Link} to={item.path} onClick={handleDrawerToggle}>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="static" sx={{  backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontSize: '2.0em', flexGrow: 1 }}>
          <FontAwesomeIcon icon={faBrain} /> Mind Guesser
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {renderMenuItems()}
      </Drawer>
    </>
  );
}

export default Header;
