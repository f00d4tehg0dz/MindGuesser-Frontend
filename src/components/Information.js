import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, CssBaseline, TextField, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import Typewriter from 'typewriter-effect';
const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Information = () => {

    return (
        <Container maxWidth="sm">
            <Stack spacing={4} sx={{ marginTop: 25 }}>
            <Typography variant="body1" color="info"
                        >
                            <Typewriter
                            onInit={(typewriter) => {
                                typewriter.typeString(`Follow me on twitter`)
                                .callFunction(() => {
                                    console.log('String typed out!');
                                })
                                .pauseFor(2500)
                                .deleteAll()
                                .callFunction(() => {
                                    console.log('All strings were deleted');
                                })
                                .start();
                            }}
                            />
                            <a href="https://twitter.com/_ok_adrian">@_ok_adrian</a>
                        </Typography>
            </Stack>
        </Container>
    );

};

export default Information;