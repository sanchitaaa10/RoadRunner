import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, IconButton, TextField, Avatar, Fab, Badge, Tooltip, Fade, Grow 
} from '@mui/material';
import { Send, Close, Chat as ChatIcon, Minimize, Wifi, WifiOff } from '@mui/icons-material';
import io from 'socket.io-client';
import API_URL from '../config';

// --- THEME ---
const COLORS = {
  bg: '#1e293b',        // Dark Card Background
  header: '#0f172a',    // Darker Header
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  orange: '#f97316',    // Primary Accent
  green: '#10b981',
  messageMe: '#f97316', // Orange for my messages
  messageThem: '#334155', // Dark Grey for others
  border: 'rgba(255,255,255,0.1)'
};

// Global Socket Instance
const socket = io(API_URL, {
  reconnection: true,
  autoConnect: true,
});

const ChatWidget = ({ userId, userName, targetName, role, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  const scrollRef = useRef(null);
  
  // Create a UNIQUE Room ID based on the Driver's ID
  const roomName = `chat-${userId}`;

  useEffect(() => {
    // 1. Setup Connection Listeners
    const onConnect = () => {
      setIsConnected(true);
      console.log("泙 Connected to Server. Joining:", roomName);
      socket.emit('joinChat', roomName);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("閥 Disconnected.");
    };

    const onReceiveMessage = (data) => {
      console.log("陶 Message Received:", data);
      if (data.room === roomName) {
        setMessages((prev) => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receiveMessage', onReceiveMessage);

    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receiveMessage', onReceiveMessage);
      console.log("伯 Unmounting Chat Widget");
    };
  }, [roomName]); 

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      id: Date.now() + Math.random(),
      room: roomName,
      author: role === 'driver' ? userName : 'Dispatch',
      senderId: role, 
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    console.log("豆 Sending:", msgData);

    setMessages((prev) => [...prev, msgData]);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    socket.emit('sendMessage', msgData);
    setMessage('');
  };

  // Minimized State (Bubble)
  if (!isOpen) {
    return (
      <Grow in>
        <Fab 
          onClick={() => setIsOpen(true)} 
          sx={{ 
            position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
            bgcolor: COLORS.orange, color: 'white',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
            '&:hover': { bgcolor: '#ea580c', transform: 'scale(1.1)' },
            transition: 'all 0.3s'
          }}
        >
          <Badge 
            color={isConnected ? "success" : "error"} 
            variant="dot" 
            sx={{ '& .MuiBadge-badge': { border: `2px solid ${COLORS.orange}` } }}
          >
            <ChatIcon />
          </Badge>
        </Fab>
      </Grow>
    );
  }

  // Expanded State (Chat Window)
  return (
    <Fade in timeout={300}>
      <Paper elevation={24} sx={{ 
        position: 'fixed', bottom: 30, right: 30, width: 360, height: 550, 
        zIndex: 9999, display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden',
        bgcolor: COLORS.bg, border: `1px solid ${COLORS.border}`,
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)'
      }}>
        
        {/* HEADER */}
        <Box sx={{ bgcolor: COLORS.header, color: 'white', p: 2, borderBottom: `1px solid ${COLORS.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: COLORS.orange, width: 36, height: 36, fontSize: 16, fontWeight: 'bold' }}>{targetName?.[0]}</Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">{targetName}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isConnected ? <Wifi sx={{ fontSize: 12, color: COLORS.green }} /> : <WifiOff sx={{ fontSize: 12, color: COLORS.red }} />}
                  <Typography variant="caption" sx={{ opacity: 0.7, color: COLORS.textMuted }}>
                    {isConnected ? "Connected" : "Reconnecting..."}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: COLORS.textMuted, '&:hover': { color: 'white' } }}><Minimize /></IconButton>
              {onClose && <IconButton size="small" onClick={onClose} sx={{ color: COLORS.textMuted, '&:hover': { color: 'white' } }}><Close /></IconButton>}
            </Box>
          </Box>
          
          {/* DEBUG INFO */}
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: COLORS.textMuted, fontSize: '0.6rem', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 1, py: 0.5 }}>
            Room: {roomName}
          </Typography>
        </Box>

        {/* MESSAGES AREA */}
        <Box sx={{ 
          flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'rgba(0,0,0,0.2)', 
          display: 'flex', flexDirection: 'column', gap: 1.5,
          backgroundImage: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%)'
        }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
              <ChatIcon sx={{ fontSize: 40, color: COLORS.textMuted, mb: 1 }} />
              <Typography variant="caption" display="block" color={COLORS.textMuted}>
                Start the conversation...
              </Typography>
            </Box>
          )}
          
          {messages.map((msg, i) => {
            const isMe = msg.senderId === role;
            return (
              <Box key={i} sx={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <Paper sx={{ 
                  p: 1.5, px: 2, 
                  borderRadius: isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  bgcolor: isMe ? COLORS.messageMe : COLORS.messageThem, 
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{msg.text}</Typography>
                </Paper>
                <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', mt: 0.5, textAlign: isMe ? 'right' : 'left', color: COLORS.textMuted }}>
                  {msg.time}
                </Typography>
              </Box>
            );
          })}
          <div ref={scrollRef} />
        </Box>

        {/* INPUT AREA */}
        <Box component="form" onSubmit={handleSend} sx={{ p: 2, bgcolor: COLORS.header, borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: 1 }}>
          <TextField 
            fullWidth 
            placeholder={isConnected ? "Type a message..." : "Waiting..."} 
            disabled={!isConnected}
            size="small" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', color: 'white',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: COLORS.orange }
              },
              '& input::placeholder': { color: COLORS.textMuted }
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!message.trim() || !isConnected} 
            sx={{ 
              bgcolor: COLORS.orange, color: 'white', 
              '&:hover': { bgcolor: '#ea580c' },
              '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: COLORS.textMuted }
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ChatWidget;