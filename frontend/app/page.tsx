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
    <div className="flex flex-col gap-2 relative h-[100vh]">
      <h1 className="text-3xl font-bold text-left">Chat with Llama</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index} className={message.isBot ? 'bot-message' : 'user-message'}>
            <div className="chat chat-start chat-top">
              {message.isBot ? (
                <>
                  <div className="chat-header">
                  Llama AI
                  </div>
                  <div className="chat-image avatar">
                    <div className="w-20 rounded-full">
                      <img
                        alt="Llama AI"
                        src="https://img-cdn.inc.com/image/upload/f_webp,c_fit,w_1920,q_auto/images/panoramic/meta-llama3-inc_539927_dhgoal.jpg" />
                    </div>
                  </div>
                  <div className="chat-bubble"> {message.text}.</div>
                </>
              ) : (
                <>
                  <div className="chat-header">
                  User
                  </div>
                  <div className="chat-image avatar">
                    <div className="w-20 rounded-full">
                      <img
                        alt="User"
                        src="https://media.istockphoto.com/id/157030584/vector/thumb-up-emoticon.jpg?s=612x612&w=0&k=20&c=GGl4NM_6_BzvJxLSl7uCDF4Vlo_zHGZVmmqOBIewgKg=" />
                    </div>
                  </div>
                  <div className="chat-bubble"> {message.text}.</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

<div className="join">
<form onSubmit={handleSubmit}>
<div>
    <input
      type="text"
      value={prompt}
      onChange={handleInputChange}
      placeholder="Type here"
      className="input input-bordered input-accent w-full max-w-xs" />
  </div>
  <div>  
    <button className="btn btn-outline btn-primary" type="submit" disabled={isLoading}>Send</button>
  </div>
</form>
</div>
</div>
  );
};

export default Home;

Date.now()