import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress, TextField, Stack } from '@mui/material';
import Typewriter from 'typewriter-effect';

const Conversation = () => {
    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const getOrCreateConversationId = () => {
        const storedId = localStorage.getItem('conversationId');
        if (storedId) {
            return storedId;
        } else {
            const newId = generateUniqueId();
            localStorage.setItem('conversationId', newId);
            return newId;
        }
    };

    const [conversationId, setConversationId] = useState(getOrCreateConversationId());
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [isFirstSubmission, setIsFirstSubmission] = useState(true);
    const [latestAiResponse, setLatestAiResponse] = useState('');
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setIsSendButtonDisabled(userInput.trim() === '');
    }, [userInput]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !isSendButtonDisabled) {
            handleSubmit(event);
        }
    };

    const handleTypeSelection = async (type) => {
        setSelectedType(type);
        setLatestAiResponse('');
        setGameOver(false);
        if (isFirstSubmission) {
            try {
                const response = await axios.post('https://mind-guesser-adrianchrysanth.replit.app/continue-conversation', {
                    conversationId,
                    userInput: `I'm ${type}`,
                });
                setLatestAiResponse(response.data.message);
                setIsFirstSubmission(false);
            } catch (error) {
                console.error(error);
                alert('An error occurred while processing your request');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedType) {
            alert('Please select a type');
            return;
        }
        const fullUserInput = `I'm ${selectedType}: ${userInput}`;
        setIsLoading(true);
        try {
            const response = await axios.post('https://mind-guesser-adrianchrysanth.replit.app/continue-conversation', {
                conversationId,
                userInput: fullUserInput,
            });
            setConversation([...conversation, { role: 'user', content: fullUserInput }]);
            setUserInput('');
            const aiMessage = response.data.message;
            setLatestAiResponse(aiMessage);
            setIsFirstSubmission(false);
            if (aiMessage.includes("You've stumped me") || aiMessage.includes("I guess it correctly")) {
                setGameOver(true);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request');
        }
        setIsLoading(false);
    };

    const handleResetConversation = () => {
        const newId = generateUniqueId();
        setConversationId(newId);
        localStorage.setItem('conversationId', newId);
        setConversation([]);
        setSelectedType('');
        setIsFirstSubmission(true);
        setLatestAiResponse('');
        setUserInput('');
        setGameOver(false);
    };

    return (
        <Container maxWidth="sm">
            <Stack spacing={4} sx={{ marginTop: 25 }}>
                {!selectedType && (
                    <>
                        <Typography variant="p" textAlign="center" sx={{ fontSize: '2.0em' }}>
                            <Typewriter
                                onInit={(typewriter) => {
                                    typewriter.typeString(`I'm a ...`).start();
                                }}
                            />
                        </Typography>

                        <Stack direction="row" justifyContent="center" spacing={2}>
                            <Button variant={selectedType === 'a character' ? 'contained' : 'outlined'} color="secondary" onClick={() => handleTypeSelection('a character')}>
                                Character
                            </Button>
                            <Button variant={selectedType === 'an object' ? 'contained' : 'outlined'} color="secondary" onClick={() => handleTypeSelection('an object')}>
                                Object
                            </Button>
                            <Button variant={selectedType === 'an animal' ? 'contained' : 'outlined'} color="secondary" onClick={() => handleTypeSelection('an animal')}>
                                Animal
                            </Button>
                        </Stack>
                    </>
                )}
                {selectedType && (
                    <>
                        <Typography variant="body1" color="info">
                            <strong></strong>{latestAiResponse}
                        </Typography>
                        {!gameOver && (
                            <form onSubmit={handleSubmit}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        placeholder={`I'm ${selectedType}...`}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="flex-grow border-2 border-gray-300 p-2 rounded-md"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSendButtonDisabled}
                                    >
                                        {isLoading ? <CircularProgress size={20} /> : 'Send'}
                                    </Button>
                                </Stack>
                            </form>
                        )}
                        {gameOver && (
                            <Button variant="contained" color="secondary" onClick={handleResetConversation}>
                                Reset Conversation
                            </Button>
                        )}
                    </>
                )}
                {conversation.length > 0 && !gameOver && (
                    <Button variant="contained" color="secondary" onClick={handleResetConversation}>
                        Reset Conversation
                    </Button>
                )}
            </Stack>
        </Container>
    );
};

export default Conversation;
