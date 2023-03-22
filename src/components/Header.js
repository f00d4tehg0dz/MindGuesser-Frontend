import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h5" textAlign="center" component="div">
                    <FontAwesomeIcon icon={faBrain} /> Mind Guesser
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
export default Header;
