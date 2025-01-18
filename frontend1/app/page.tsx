"use client";
import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot?: boolean }[]>([]);

  const formatResponse = (response: string) => response?.replace(prompt, '') || '';

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('http://localhost:8000/generate', { prompt });
      setMessages(prev => [...prev, { text: formatResponse(data.text), isBot: true }]);
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
      setMessages(prev => [...prev, { text: prompt }]);
      sendMessage();
      setPrompt('');
    }
  };

  return (
    <div>
      <h1>LLM Chatbot</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index} className={message.isBot ? 'bot-message' : 'user-message'}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={prompt} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default Home;