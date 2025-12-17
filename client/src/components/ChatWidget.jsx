import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, IconButton, TextField, Avatar, Fab, Badge 
} from '@mui/material';
import { Send, Close, Chat as ChatIcon, Minimize } from '@mui/icons-material';
import io from 'socket.io-client';
import API_URL from '../config';

// Keep socket instance outside to prevent reconnection loops
const socket = io(API_URL);

const ChatWidget = ({ userId, userName, targetName, role, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  // Define unique room name
  const roomName = `chat-${userId}`;

  useEffect(() => {
    // 1. Reset messages when switching drivers
    setMessages([]);

    // 2. Join the specific Room
    socket.emit('joinChat', roomName);
    console.log(`🔌 Joining Room: ${roomName}`);

    // 3. Define the listener
    const handleReceiveMessage = (data) => {
      // Security Check: Only accept messages meant for THIS room
      if (data.room === roomName) {
        setMessages((prev) => [...prev, data]);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    // 4. Attach Listener
    socket.on('receiveMessage', handleReceiveMessage);

    // 5. CLEANUP (Crucial!): Remove listener when component unmounts or user changes
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      console.log(`🔌 Leaving Room: ${roomName}`);
    };
  }, [userId, roomName]); // Re-run if userId changes

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      room: roomName,
      author: role === 'driver' ? userName : 'Dispatch',
      senderId: role, // 'driver' or 'admin'
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Send to Server
    socket.emit('sendMessage', msgData);
    setMessage('');
  };

  if (!isOpen) {
    return (
      <Fab color="primary" onClick={() => setIsOpen(true)} sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <Badge color="error" variant="dot"><ChatIcon /></Badge>
      </Fab>
    );
  }

  return (
    <Paper elevation={6} sx={{ 
        position: 'fixed', bottom: 20, right: 20, width: 320, height: 450, 
        zIndex: 1000, display: 'flex', flexDirection: 'column', borderRadius: 4 
      }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: '#1e293b', color: 'white', p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#6366f1' }}>{targetName?.[0]}</Avatar>
          <Typography variant="subtitle2" fontWeight="bold">{targetName}</Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}><Minimize /></IconButton>
          {onClose && <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>}
        </Box>
      </Box>

      {/* MESSAGES */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg, index) => {
          const isMe = (role === 'driver' && msg.senderId === 'driver') || (role === 'admin' && msg.senderId === 'admin');
          return (
            <Box key={index} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <Paper sx={{ p: 1, px: 2, borderRadius: 2, bgcolor: isMe ? '#6366f1' : 'white', color: isMe ? 'white' : 'black' }}>
                <Typography variant="body2">{msg.text}</Typography>
              </Paper>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: isMe ? 'right' : 'left', fontSize: '0.6rem' }}>{msg.time}</Typography>
            </Box>
          );
        })}
        <div ref={scrollRef} />
      </Box>

      {/* INPUT */}
      <Box component="form" onSubmit={handleSend} sx={{ p: 2, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
        <TextField fullWidth placeholder="Type..." size="small" value={message} onChange={(e) => setMessage(e.target.value)} />
        <IconButton type="submit" color="primary"><Send /></IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWidget;