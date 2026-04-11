// ChatBox — Navy/saffron themed AI assistant
import { useState, useRef, useEffect } from 'react';
import API from '../api/axiosInstance.js';
import { FiSend } from 'react-icons/fi';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await API.post('/ai/api/groq', { content: inputMessage });
      const data = response.data;
      const aiMessage = { type: 'ai', content: data || 'I apologize, but I am unable to process your request at the moment.' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { type: 'ai', content: 'I apologize, but I encountered an error processing your request.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto card overflow-hidden">
      {/* Header */}
      <div className="bg-navy-700 text-white px-6 py-4">
        <h2 className="text-lg font-bold">AI Legal Assistant</h2>
        <p className="text-navy-200 text-sm">Get instant answers about the eFIR process</p>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <svg className="w-12 h-12 mx-auto mb-4 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm font-medium text-gray-500">Ask me anything about filing or tracking complaints.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-xl text-sm ${
              message.type === 'user'
                ? 'bg-navy-700 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
            }`}>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 p-4 rounded-xl rounded-bl-none shadow-sm border border-gray-100">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-3">
          <input
            type="text" value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button onClick={handleSubmit} disabled={isLoading || !inputMessage.trim()}
            className="btn-primary px-5 flex items-center gap-2">
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;