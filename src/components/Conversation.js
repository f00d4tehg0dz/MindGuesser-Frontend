import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, CssBaseline, TextField, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/system';
import Typewriter from 'typewriter-effect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiamond } from '@fortawesome/free-solid-svg-icons';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Conversation = () => {

    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    const [conversationId, setConversationId] = useState(generateUniqueId());
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [isFirstSubmission, setIsFirstSubmission] = useState(true);
    const [latestAiResponse, setLatestAiResponse] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedType) {
            alert('Please select a type');
            return;
        }
        const fullUserInput = `I'm ${selectedType}: ${userInput}`;
        try {
            const response = await axios.post('http://localhost:5890/continue-conversation', {
                conversationId,
                userInput: fullUserInput,
            });
            setConversation([...conversation, { role: 'user', content: fullUserInput }]);
            setUserInput('');
            setLatestAiResponse(response.data.message);
            setIsFirstSubmission(false);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request');
        }
    };

    return (
        <Container maxWidth="sm">
            <Stack spacing={4} sx={{ marginTop: 25 }}>
                {/* ... Select what you are? stack ... */}
                {!selectedType && (
                    <>
                        <Typography variant="p" textAlign="center">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter.typeString(`I'm a ...`)

                                .callFunction(() => {
                                    // console.log('String typed out!');
                                })
                                .start();
                            }}
                            />

                        </Typography>

                        <Stack direction="row" justifyContent="center" spacing={2}>
                        <Button variant={selectedType === 'a character from' ? 'contained' : 'outlined'} color="secondary" onClick={() => setSelectedType('a character')}>
                            Character
                        </Button>
                        <Button variant={selectedType === 'an object like' ? 'contained' : 'outlined'} color="secondary" onClick={() => setSelectedType('an object')}>
                            Object
                        </Button>
                        <Button variant={selectedType === 'an animal like' ? 'contained' : 'outlined'} color="secondary" onClick={() => setSelectedType('an animal')}>
                            Animal
                        </Button>

                    </Stack>
                    </>
                )}
                {selectedType && (
                    <>
                        <Typography variant="body1" color="info"
                        >
                            {/* <Typewriter
                            onInit={(typewriter) => {
                                typewriter.typeString(`${latestAiResponse}`)
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
                            /> */}
                            <strong></strong>{latestAiResponse}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    placeholder={`I'm ${selectedType}...`}
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="flex-grow border-2 border-gray-300 p-2 rounded-md"
                                />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-md">
                                    Send
                                </button>
                            </Stack>

                        </form>

                    </>
                )}
                {/* <Stack spacing={2}>
                    {conversation.map((msg, index) => (
                        <Typography key={index} variant="body1" color={msg.role === 'user' ? 'success' : 'info'}>
                            <strong>{msg.role.toUpperCase()}:</strong> {msg.content}
                        </Typography>
                    ))}
                </Stack> */}
                {/* <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} style={{
                    fontSize: '2.0em',
                    fontWeight: 'Bolder'
                }}>
                   <FontAwesomeIcon icon={faDiamond} />
                   <FontAwesomeIcon icon={faDiamond} />
                   <FontAwesomeIcon icon={faDiamond} />
                </Stack> */}
            </Stack>
        </Container>
    );

};

export default Conversation;