'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

const Home = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isBot?: boolean }[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const formatResponse = (response: string) => {
        const emojiMapping: { [key: string]: string } = {
            '<think>': '🤔',  // Thinking emoji
            '</think>': '💭',  // Thought bubble emoji
            // Add more mappings here as needed
        };

        // Replace each key in the mapping with its corresponding emoji
        return Object.keys(emojiMapping).reduce((formattedResponse, key) => {
            return formattedResponse.replace(new RegExp(key, 'g'), emojiMapping[key]);
        }, response?.replace(prompt, '') || '');
    };

    const sendMessage = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:8000/generate', { prompt });
            setMessages((prev) => [...prev, { text: formatResponse(data.text), isBot: true }]);
            setIsTyping(false);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (prompt) {
            setMessages((prev) => [...prev, { text: prompt }]);
            setPrompt('');
            setIsTyping(true);
            sendMessage();
        }
    };

    return (
        <div className='main-layout'>
            <div className="chat-container">
                <h1 className='text-3xl font-bold'>Chat with DeepSeek</h1>
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={message.isBot ? 'bot-message' : 'user-message'}>
                            <div className='chat chat-start chat-top'>
                                {message.isBot ? (
                                    <>
                                        <div className='chat-header'>DeepSeek AI</div>
                                        <div className='chat-image avatar'>
                                            <div className='w-20 rounded-full'>
                                                <img
                                                    alt='Deepseek AI'
                                                    src='/deepseek-logo.png'
                                                />
                                            </div>
                                        </div>
                                        <div className='chat-bubble'> {message.text}.</div>
                                    </>
                                ) : (
                                    <>
                                        <div className='chat-header'>User</div>
                                        <div className='chat-image avatar'>
                                            <div className='w-20 rounded-full'>
                                                <img
                                                    alt='User'
                                                    src='/grogu.png'
                                                />
                                            </div>
                                        </div>
                                        <div className='chat-bubble'> {message.text}.</div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    )}
                </div>

                {/* Sample prompts label and buttons */}
                <div className="prompt-buttons">
                    <h2 className="text-lg font-semibold">Sample Prompts for the Chatbot:</h2>
                    <div className="button-grid">
                        <button onClick={() => setPrompt("What were the main factors that led to the fall of Rome?")}>
                            What were the main factors that led to the fall of Rome?
                        </button>
                        <button onClick={() => setPrompt("How did the fall of Constantinople change the course of history?")}>
                            How did the fall of Constantinople change the course of history?
                        </button>
                        <button onClick={() => setPrompt("What contributed to the decline of Venice as a major maritime power?")}>
                            What contributed to the decline of Venice as a major maritime power?
                        </button>
                        <button onClick={() => setPrompt("How did the Renaissance influence art and culture in Europe?")}>
                            How did the Renaissance influence art and culture in Europe?
                        </button>
                    </div>
                </div>

                <div className='join'>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type='text'
                                value={prompt}
                                onChange={handleInputChange}
                                placeholder='Type your message...'
                            />
                            <button
                                className='btn btn-outline btn-primary'
                                type='submit'
                                disabled={isLoading}
                            >
                                <FaPaperPlane className="mr-2" /> Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
