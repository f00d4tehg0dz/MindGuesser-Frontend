import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WatercolorAnimation from '../components/WatercolorAnimation';
import ProgressBar from '../components/ProgressBar';

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
    const [gameStarted, setGameStarted] = useState(false);
    const [tries, setTries] = useState(0);
    const [showTyping, setShowTyping] = useState(false);

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
        //const fullUserInput = `I'm ${selectedType}: ${userInput}`;
        const fullUserInput = `${userInput}`;
        setIsLoading(true);
        setShowTyping(true);
        try {
            const response = await axios.post('https://mind-guesser-adrianchrysanth.replit.app/continue-conversation', {
                conversationId,
                userInput: fullUserInput,
            });
            setConversation([...conversation, { role: 'user', content: fullUserInput }]);
            setUserInput('');
            setTimeout(() => {
                setLatestAiResponse(response.data.message);
                setShowTyping(false);
                setIsFirstSubmission(false);
                setTries(tries + 1);
                if (tries >= 19 || response.data.message.includes("You've stumped me") || response.data.message.includes("You've stumped me, let's try again!") || response.data.message.includes("I guess it correctly")) {
                    setGameOver(true);
                }
            }, 1000);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request');
            setShowTyping(false);
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
        setGameStarted(false);
        setTries(0);
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    };

    const handleStartGame = () => {
        setGameStarted(true);
    };

    return (
        <div className="flex flex-col justify-center mx-auto w-full max-w-[480px]">
            {!gameStarted && (
                    <>
                    <div className="absolute inset-0 w-full h-full rgba(222,126,59,0.64) backdrop-blur-3xl"></div>
                    <div className="absolute top-0 right-0 z-[-999] rounded-full bg-[linear-gradient(180deg,rgba(171,66,30,0.1)_0%,rgba(222,126,59,0.23)_100%)] h-[300px] w-[300px]"></div>
               </>
            )}
            <div className="relative flex flex-col justify-center w-full">
                {!gameStarted && (
                    <div className="flex flex-col items-center justify-center mt-10">
                        <div className="text-5xl font-medium text-center text-zinc-100">
                            Hello, I’m MindGuesser
                        </div>
                        <div className="mt-4 py-4 text-xl text-center text-zinc-300">
                            Think about a real or fictional character. Or an object or animal. I will try to guess who it is.
                        </div>
                        <div className="flex flex-col justify-center self-center p-7 mt-28 max-w-full text-xl font-bold whitespace-nowrap w-[175px]">
                            <div className="px-7 w-full bg-indigo-500 start-button rounded-full h-[120px] flex items-center justify-center cursor-pointer" onClick={handleStartGame}>
                                START
                            </div>
                        </div>
                    </div>
                )}
                {gameStarted && !selectedType && (
                    <>
                        <div><ProgressBar progress={tries} /></div>
                        <div className="flex flex-col items-center mt-10">
                            <WatercolorAnimation />
                            <div className="text-4xl font-medium text-center p-7 text-zinc-100">
                                I'm thinking of a ...
                            </div>
                            <div className="flex flex-row justify-center space-x-4">
                                <button className="px-6 py-4 bg-indigo-500 rounded-full text-white" onClick={() => handleTypeSelection('a character')}>
                                    Character
                                </button>
                                <button className="px-6 py-4 bg-indigo-500 rounded-full text-white" onClick={() => handleTypeSelection('an object')}>
                                    Object
                                </button>
                                <button className="px-6 py-4 bg-indigo-500 rounded-full text-white" onClick={() => handleTypeSelection('an animal')}>
                                    Animal
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {selectedType && (
                    <div className="flex flex-col mt-10 w-full">
                        <ProgressBar progress={tries} />
                        <div className="flex flex-col items-start items-center pt-4 pb-20 mx-auto w-full max-w-[480px]">
                            <WatercolorAnimation />
                            <div className="mt-10 text-xl font-medium tracking-wider leading-6 text-zinc-100">
                                {showTyping ? (
                                    <div className="dot-typing">
                                        <span>.</span><span>.</span><span>.</span>
                                    </div>
                                ) : (
                                    latestAiResponse
                                )}
                            </div>
                            {!gameOver && !latestAiResponse.toLowerCase().includes('play again') && (
                                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center mt-4 p-7">
                                    <div className="flex gap-2 items-start p-3 w-full text-sm tracking-wide leading-5 rounded-lg bg-neutral-700 max-w-[343px] text-white-600">
                                        <div className="w-full">
                                            <input
                                                type="text"
                                                placeholder="Reply here"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                className="w-full px-4 py-2 border-0 bg-neutral-700 border-gray-0 rounded-md mb-4"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSendButtonDisabled}
                                        className="flex justify-center items-center px-16 py-3.5 mt-10 w-full text-base font-bold tracking-wider leading-5 whitespace-nowrap bg-indigo-500 max-w-[343px] rounded-[39.5px] text-zinc-100"
                                    >
                                        <div className="flex gap-1">
                                            <div>Next</div>
                                            {isLoading ? <div className="loader" /> : <img
                                                loading="lazy"
                                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fe5a8b765fc3524d04107757497d09638757efa8cee0173e84ceec301f147d3e?"
                                                className="shrink-0 my-auto w-4 aspect-square"
                                                alt="right arrow"
                                            />}
                                        </div>
                                    </button>
                                    <button onClick={handleResetConversation} className="flex justify-center items-center px-16 py-3.5 mt-10 w-full text-base font-bold tracking-wider leading-5 whitespace-nowrap bg-indigo-500 max-w-[343px] rounded-[39.5px] text-zinc-100">
                                  Restart Game
                              </button>
                                </form>
                            )}
                              {(gameOver || latestAiResponse.toLowerCase().includes('play again')) && (
                                  <button onClick={handleResetConversation} className="flex justify-center items-center px-16 py-3.5 mt-10 w-full text-base font-bold tracking-wider leading-5 whitespace-nowrap bg-indigo-500 max-w-[343px] rounded-[39.5px] text-zinc-100">
                                  Restart Game
                              </button>
                             )}
                            
                        </div>
                    </div>
                )}
                <div className="flex gap-3 px-4 pt-4 pb-5 mt-28 text-xs text-center text-zinc-300">
                    <a className="flex flex-1 gap-1 justify-center p-3 rounded-lg bg-zinc-800" href="https://twitter.com/_ok_adrian">
                        <div className="flex flex-1 gap-1 justify-center p-3 rounded-lg bg-zinc-800">
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70ffa0b0d35d294f9e8f41fcfda2becb7add0cf327b743f773077d8b4b884873?"
                                className="shrink-0 w-4 aspect-square"
                                alt="chat with moderator"
                            />
                            <div>Message me on X</div>
                        </div>
                    </a>
                    <a className="flex flex-1 gap-1 justify-center p-3 rounded-lg bg-zinc-800" href="https://twitter.com/_ok_adrian">
                        <div className="flex flex-1 gap-1 justify-center p-3 rounded-lg bg-zinc-800">
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/692dda66028706408c6aade3951416c62696c36d5f921b04d2d505d269939487?"
                                className="shrink-0 w-4 aspect-square"
                                alt="chat with group"
                            />
                            <div>Discuss on Discord</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Conversation;