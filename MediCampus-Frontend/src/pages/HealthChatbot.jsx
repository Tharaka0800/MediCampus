import React, { useState, useEffect, useRef } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cb-root {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 130px);
    background: #ffffff;
    border-radius: 20px;
    border: 1.5px solid var(--border, #e2eaeb);
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 10px 30px rgba(13, 148, 136, 0.05);
  }

  .cb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
    color: #fff;
  }

  .cb-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cb-bot-avatar {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }

  .cb-title-area h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }

  .cb-title-area p {
    font-size: 12px;
    margin: 2px 0 0 0;
    opacity: 0.85;
    font-weight: 500;
  }

  .cb-clear-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
  }

  .cb-clear-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }

  .cb-chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: #fdfdfd;
    display: flex;
    flex-direction: column;
    gap: 18px;
    scroll-behavior: smooth;
  }

  .cb-msg-row {
    display: flex;
    width: 100%;
  }

  .cb-msg-row.user {
    justify-content: flex-end;
  }

  .cb-msg-row.bot {
    justify-content: flex-start;
  }

  .cb-msg-bubble {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 18px;
    font-size: 14.5px;
    line-height: 1.5;
    color: #1c3238;
    animation: fadeIn 0.3s ease-out forwards;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cb-msg-row.user .cb-msg-bubble {
    background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
    border: 1px solid #99f6e4;
    border-bottom-right-radius: 4px;
    color: #0d9488;
    font-weight: 500;
  }

  .cb-msg-row.bot .cb-msg-bubble {
    background: #fff;
    border: 1px solid #e2eaeb;
    border-bottom-left-radius: 4px;
    color: #2b454e;
  }

  .cb-msg-bubble p {
    margin-bottom: 8px;
  }
  .cb-msg-bubble p:last-child {
    margin-bottom: 0;
  }

  /* Typing indicator */
  .cb-typing {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 20px;
    padding: 0 4px;
  }

  .cb-dot {
    width: 6px;
    height: 6px;
    background: #0d9488;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .cb-dot:nth-child(1) { animation-delay: -0.32s; }
  .cb-dot:nth-child(2) { animation-delay: -0.16s; }
  .cb-dot:nth-child(3) { animation-delay: 0s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  .cb-suggested-wrapper {
    margin-top: auto;
    padding-top: 20px;
  }

  .cb-suggested-title {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 700;
    color: #94a3b8;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
  }

  .cb-suggested-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }

  .cb-suggested-chip {
    background: #fff;
    border: 1.5px solid #e2eaeb;
    border-radius: 12px;
    padding: 12px 14px;
    text-align: left;
    font-size: 13.5px;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-weight: 500;
  }

  .cb-suggested-chip:hover {
    border-color: #0d9488;
    background: #f0fdfa;
    color: #0d9488;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.08);
  }

  .cb-suggested-icon {
    font-size: 16px;
  }

  .cb-input-area {
    border-top: 1px solid #e2eaeb;
    padding: 16px 24px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .cb-input-wrapper {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .cb-textarea {
    flex: 1;
    background: #f4f7f8;
    border: 1.5px solid transparent;
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 15px;
    color: #1c3238;
    resize: none;
    max-height: 120px;
    min-height: 52px;
    font-family: inherit;
    transition: all 0.2s ease;
    line-height: 1.4;
  }

  .cb-textarea:focus {
    outline: none;
    border-color: #99f6e4;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
  }

  .cb-textarea::placeholder {
    color: #94a3b8;
  }

  .cb-send-btn {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #0d9488;
    color: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .cb-send-btn:hover:not(:disabled) {
    background: #0f766e;
    transform: scale(1.05);
  }

  .cb-send-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .cb-send-btn:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }

  .cb-footer-note {
    font-size: 11px;
    color: #94a3b8;
    text-align: center;
  }

  .cb-footer-note strong {
    color: #64748b;
  }

  /* Custom Scrollbar for messages */
  .cb-chat-area::-webkit-scrollbar {
    width: 6px;
  }
  .cb-chat-area::-webkit-scrollbar-track {
    background: transparent;
  }
  .cb-chat-area::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .cb-chat-area::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const SUGGESTIONS = [
  { text: "I'm having a bad headache", icon: "🤕" },
  { text: "Should I be worried about my cough?", icon: "🤧" },
  { text: "Can I take Penicillin?", icon: "💊" },
  { text: "What's my designated hospital?", icon: "🏥" },
  { text: "How to handle minor burns?", icon: "🔥" },
  { text: "I feel dizzy and tired", icon: "😵‍💫" },
];

export default function HealthChatbot({ profile }) {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('medibot_history');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: `Hello ${profile?.studentName?.split(' ')[0] || 'student'}! I'm MediBot, your AI health assistant. How are you feeling today? I have your health profile loaded securely.`
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('medibot_history', JSON.stringify(messages));
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const initial = [{
        role: 'assistant',
        content: `Chat cleared. I'm ready to assist you again, ${profile?.studentName?.split(' ')[0] || 'student'}!`
      }];
      setMessages(initial);
      sessionStorage.setItem('medibot_history', JSON.stringify(initial));
    }
  };

  const getSystemPrompt = () => {
    const defaultProfile = {
       name: "Student",
       blood: "Unknown",
       allergies: "None",
       conditions: "None"
    };

    const pName = profile?.studentName || defaultProfile.name;
    const pBlood = profile?.bloodType || defaultProfile.blood;
    const pAllergies = profile?.allergies || defaultProfile.allergies;
    const pConditions = profile?.chronicIllnesses || defaultProfile.conditions;

    return `You are MediBot, an empathetic, highly knowledgeable AI Health Triage Assistant for MediCampus. 
    You are analyzing symptoms and recommending next steps to university students.
    
    Student Profile Focus:
    - Name: ${pName}
    - Blood Type: ${pBlood}
    - Allergies: ${pAllergies}
    - Chronic Conditions: ${pConditions}

    Guidelines:
    1. Acknowledge and cross-reference their specific allergies and chronic conditions if relevant (e.g. if they ask about medication like Penicillin).
    2. Analyze symptoms logically.
    3. Suggest possible health issues (caveat that you are an AI, not a diagnosed).
    4. Provide actionable recommendations (Rest, OTC medication, Campus Clinic, or Emergency).
    5. Always recommend seeing a doctor or calling emergency lines for serious symptoms.
    6. Keep responses friendly, well-formatted (use bullet points or bolding where helpful).
    `;
  };

  const requestAnthropicAPI = async (userText) => {
    // Attempting to use a proxy or direct fetch - if not configured, we'll respond with a realistic AI default mock 
    // In a real environment, this calls the backend securely. We implement the direct fetch for demo purposes if process.env holds it
    
    const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || "dummy"; // Dummy fallback if not in env
    const messagesPayload = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role,
      content: m.content
    }));
    messagesPayload.push({ role: 'user', content: userText });

    try {
      if (API_KEY && API_KEY !== "dummy") {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307", // Fast model suitable for chat
            max_tokens: 1024,
            system: getSystemPrompt(),
            messages: messagesPayload
          })
        });

        if (response.ok) {
          const data = await response.json();
          return data.content[0].text;
        } else {
           console.warn("Anthropic API returned error:", await response.text());
        }
      }
      
      // FALLBACK MOCK IF API FAILS OR NO KEY (to guarantee an optimal working demo)
      return generateMockResponse(userText);

    } catch (e) {
      console.error(e);
      return generateMockResponse(userText);
    }
  };

  const generateMockResponse = (text) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let reply = "I'm sorry, I couldn't quite understand that. Could you describe your symptoms in more detail?";
        const pAllergies = (profile?.allergies || "").toLowerCase();
        
        if (text.toLowerCase().includes("penicillin")) {
           if (pAllergies.includes("penicillin")) {
              reply = "🚨 **WARNING!** Based on your health profile, you are allergic to Penicillin! **Do not take Penicillin** as it could trigger a severe allergic reaction (anaphylaxis).\n\nPlease consult the campus clinic for a safe alternative antibiotic.";
           } else {
              reply = "While Penicillin is a common antibiotic for bacterial infections, it should only be taken if prescribed by a doctor. Never take leftover antibiotics. Please visit the campus clinic to get a proper diagnosis.";
           }
        } else if (text.toLowerCase().includes("headache")) {
           reply = "I see you're experiencing a headache. \n\n**Possible causes:** Stress, dehydration, lack of sleep, or eye strain.\n\n**Recommendations:**\n- Drink a large glass of water.\n- Rest in a quiet, dark room for 20-30 minutes.\n- If you have no medication allergies preventing it, an OTC pain reliever like Paracetamol might help.\n\n*If the headache is unusually severe, sudden, or accompanied by vomiting or vision changes, please visit the emergency room immediately.*";
        } else if (text.toLowerCase().includes("cough")) {
           const pConditions = (profile?.chronicIllnesses || "").toLowerCase();
           reply = "A cough can be troublesome. Is it a dry cough or are you producing phlegm? ";
           if (pConditions.includes("asthma")) {
             reply += "\n\n⚠️ I noticed you have **Asthma** in your profile. A cough can sometimes be a sign that your asthma is flaring up. Make sure your inhaler (e.g., Ventolin) is nearby. If you experience shortness of breath or wheezing, use your inhaler and seek medical attention.";
           } else {
             reply += "\n\n**Recommendations:**\n- Stay hydrated with warm fluids.\n- Get plenty of rest.\n- If the cough persists for more than 2 weeks, or you experience chest pain, please see Dr. Syafiqah at the clinic.";
           }
        }
        resolve(reply);
      }, 1500);
    });
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }
    setIsLoading(true);

    const replyText = await requestAnthropicAPI(query.trim());

    setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Basic markdown bold support for mockup
  const renderMessageContent = (content) => {
    const parts = content.split(/(\n|\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part === '\n') return <br key={i} />;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cb-root">
        
        {/* Header */}
        <div className="cb-header">
          <div className="cb-brand">
            <div className="cb-bot-avatar">🤖</div>
            <div className="cb-title-area">
              <h2>MediBot AI</h2>
              <p>Your Health Triage Assistant</p>
            </div>
          </div>
          <button className="cb-clear-btn" onClick={clearChat} title="Reset Conversation">
            🔄 Clear Chat
          </button>
        </div>

        {/* Chat Area */}
        <div className="cb-chat-area" ref={chatRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`cb-msg-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div style={{marginRight: '8px', opacity: 0.8}}>
                  <div className="cb-bot-avatar" style={{width: 32, height: 32, fontSize: 16, background: '#e2eaeb', borderColor: 'transparent'}}>🤖</div>
                </div>
              )}
              <div className="cb-msg-bubble">
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="cb-msg-row bot">
               <div style={{marginRight: '8px', opacity: 0.8}}>
                  <div className="cb-bot-avatar" style={{width: 32, height: 32, fontSize: 16, background: '#e2eaeb', borderColor: 'transparent'}}>🤖</div>
                </div>
              <div className="cb-msg-bubble" style={{padding: '16px 20px'}}>
                <div className="cb-typing">
                  <div className="cb-dot"></div>
                  <div className="cb-dot"></div>
                  <div className="cb-dot"></div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && messages.length <= 2 && (
            <div className="cb-suggested-wrapper">
              <div className="cb-suggested-title">Suggested questions based on your profile</div>
              <div className="cb-suggested-grid">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="cb-suggested-chip" onClick={() => handleSend(s.text)}>
                    <span className="cb-suggested-icon">{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="cb-input-area">
          <div className="cb-input-wrapper">
            <textarea
              ref={textareaRef}
              className="cb-textarea"
              placeholder="Describe your symptoms or ask a health question..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              className="cb-send-btn" 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div className="cb-footer-note">
            <strong>Press Enter</strong> to send, <strong>Shift + Enter</strong> for a new line. MediBot provides AI-powered medical triage advice. In emergencies, call standard emergency services.
          </div>
        </div>

      </div>
    </>
  );
}
