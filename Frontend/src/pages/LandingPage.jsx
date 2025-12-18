import React from 'react';
import { 
  Box, Button, Typography, Container, Grid, Paper, Chip, Avatar, 
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  Phone, CheckCircle, Star, 
  LocalShipping, Assignment, AttachMoney, HeadsetMic, Map, Receipt, 
  TrendingUp, VerifiedUser, Speed, Groups, ArrowForward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- THEME COLORS ---
const COLORS = {
  navy: '#0f172a',       
  navyGradient: 'linear-gradient(135deg, #0f172a 0%, #172554 100%)', 
  orange: '#f97316',     
  orangeHover: '#ea580c',
  white: '#ffffff',
  lightGray: '#f8fafc',
  textDark: '#1e293b',
  textMuted: '#64748b'
};

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, x: 0, 
    transition: { duration: 0.7, ease: "easeOut" } 
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, x: 0, 
    transition: { duration: 0.7, ease: "easeOut" } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ fontFamily: '"Outfit", sans-serif', overflowX: 'hidden' }}>
      
      {/* Import Font */}
      <style>
      {`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}
      </style>

      {/* ==================== NAVBAR ==================== */}
      <Box 
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          bgcolor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box 
            component={motion.div} whileHover={{ scale: 1.05 }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            <Box sx={{ 
              p: 1, bgcolor: COLORS.orange, borderRadius: '10px', display: 'flex', color: 'white',
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.5)'
            }}>
              <LocalShipping fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight="800" color="white" letterSpacing="-0.5px">RoadRunner</Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5 }}>
            {['Services', 'About', 'Why Us', 'Testimonials', 'Contact'].map((link, i) => (
              <Typography 
                key={link} 
                component={motion.p}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                variant="body2" fontWeight="600" 
                sx={{ 
                  cursor: 'pointer', color: '#cbd5e1', transition: '0.2s', position: 'relative',
                  '&:hover': { color: COLORS.orange }
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>

          <Button 
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{ 
              bgcolor: COLORS.orange, borderRadius: '8px', px: 3, fontWeight: 'bold', textTransform: 'none',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
              '&:hover': { bgcolor: COLORS.orangeHover }
            }} 
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* ==================== HERO SECTION ==================== */}
      <Box sx={{ 
        position: 'relative', pt: { xs: 15, md: 22 }, pb: { xs: 10, md: 18 },
        overflow: 'hidden', color: 'white'
      }}>
        {/* Animated Background Image */}
        <Box 
          component={motion.div}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          sx={{ 
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'url("https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }} 
        />
        
        {/* Gradient Overlay */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #0f172a 0%, rgba(15, 23, 42, 0.85) 100%)', zIndex: 1 }} />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            
            <motion.div variants={fadeInUp}>
              <Chip 
                label="#1 Trusted Dispatch Service" 
                sx={{ 
                  bgcolor: 'rgba(249, 115, 22, 0.15)', color: COLORS.orange, 
                  fontWeight: 'bold', mb: 3, border: `1px solid ${COLORS.orange}`, 
                  backdropFilter: 'blur(5px)'
                }} 
              />
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Typography variant="h1" fontWeight="800" sx={{ fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.05, mb: 3, maxWidth: '800px', letterSpacing: '-1px' }}>
                Your Freight, <br />
                <span style={{ 
                  background: 'linear-gradient(to right, #f97316, #fbbf24)', 
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
                }}>
                  Our Priority.
                </span>
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, maxWidth: '600px', lineHeight: 1.6, fontSize: '1.2rem', fontWeight: 300 }}>
                RoadRunner Dispatch provides 24/7 professional trucking dispatch services. We handle the logistics so you can focus on driving and earning more.
              </Typography>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  component={motion.button}
                  animate={pulseAnimation}
                  variant="contained" size="large" onClick={() => navigate('/register')} 
                  endIcon={<ArrowForward />}
                  sx={{ 
                    bgcolor: COLORS.orange, px: 5, py: 2, fontSize: '1.1rem', borderRadius: '50px', 
                    fontWeight: 'bold', boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)',
                    '&:hover': { bgcolor: COLORS.orangeHover } 
                  }}
                >
                  Start Earning More
                </Button>
                <Button 
                  component={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  variant="outlined" size="large" startIcon={<Phone />} 
                  sx={{ 
                    color: 'white', borderColor: 'rgba(255,255,255,0.3)', px: 4, py: 2, fontSize: '1.1rem', 
                    borderRadius: '50px', fontWeight: 'bold', backdropFilter: 'blur(5px)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                  }}
                >
                  Call Now
                </Button>
              </Box>
            </motion.div>
          </motion.div>

          {/* Animated Stats Bar */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            sx={{ mt: 10, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: { xs: 4, md: 10 }, flexWrap: 'wrap' }}
          >
             {[
               { val: "500+", label: "Active Trucks" },
               { val: "98%", label: "Success Rate" },
               { val: "24/7", label: "Support" },
             ].map((stat, i) => (
               <Box key={i}>
                 <Typography variant="h3" fontWeight="800" color={COLORS.orange} sx={{ mb: 0.5 }}>{stat.val}</Typography>
                 <Typography variant="body1" color="#cbd5e1" fontWeight="600" letterSpacing={1}>{stat.label}</Typography>
               </Box>
             ))}
           </Box>
        </Container>
      </Box>

      {/* ==================== SERVICES SECTION ==================== */}
      <Box sx={{ py: 15, bgcolor: COLORS.lightGray }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }} component={motion.div} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Typography variant="caption" fontWeight="800" color={COLORS.orange} letterSpacing={2}>WHAT WE DO</Typography>
            <Typography variant="h2" fontWeight="800" color={COLORS.textDark} sx={{ mt: 1, mb: 2 }}>Complete Dispatch Services</Typography>
            <Typography color={COLORS.textMuted} sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.1rem' }}>
              From finding loads to getting you paid, we handle every aspect of trucking dispatch so you can maximize your time on the road.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { title: "Load Booking", desc: "We find and negotiate the best paying loads for your truck.", icon: <LocalShipping /> },
              { title: "Paperwork Management", desc: "Handle all documentation, rate confirmations, and carrier packets.", icon: <Assignment /> },
              { title: "Rate Negotiation", desc: "Our expert dispatchers negotiate top dollar rates with brokers.", icon: <AttachMoney /> },
              { title: "24/7 Support", desc: "Round-the-clock dispatch support whenever you need assistance.", icon: <HeadsetMic /> },
              { title: "Route Planning", desc: "Optimized route planning to reduce deadhead miles.", icon: <Map /> },
              { title: "Billing & Invoicing", desc: "We handle invoicing and follow up on payments to ensure you get paid.", icon: <Receipt /> },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 4, height: '100%', borderRadius: 4, bgcolor: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
                      border: '1px solid transparent',
                      transition: '0.3s', 
                      '&:hover': { 
                        borderColor: COLORS.orange,
                        boxShadow: '0 20px 40px rgba(249, 115, 22, 0.1)' 
                      } 
                    }}
                  >
                    <Box sx={{ width: 60, height: 60, bgcolor: 'rgba(249, 115, 22, 0.1)', color: COLORS.orange, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      {React.cloneElement(item.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography variant="h5" fontWeight="800" gutterBottom color={COLORS.textDark}>{item.title}</Typography>
                    <Typography color={COLORS.textMuted} lineHeight={1.6}>{item.desc}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ==================== WHY CHOOSE US ==================== */}
      <Box sx={{ py: 15, bgcolor: COLORS.white, overflow: 'hidden' }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            {/* Left: Text Content */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInLeft}>
                <Typography variant="caption" fontWeight="800" color={COLORS.orange} letterSpacing={2}>WHY CHOOSE US</Typography>
                <Typography variant="h2" fontWeight="800" color={COLORS.textDark} sx={{ mt: 1, mb: 3 }}>
                  Built for Owner-Operators <br /> Who Want More
                </Typography>
                <Typography color={COLORS.textMuted} sx={{ mb: 4, fontSize: '1.15rem', lineHeight: 1.7 }}>
                  We understand the trucking business because we've been in your shoes. RoadRunner was founded to give drivers the support they deserve.
                </Typography>
                
                <List>
                  {[
                    "No forced dispatch – you choose your loads",
                    "Transparent pricing – no hidden fees",
                    "Dedicated dispatcher assigned to you",
                    "Access to premium load boards",
                    "Weekly settlements available"
                  ].map((text, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + (i * 0.1) }}>
                      <ListItem sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CheckCircle sx={{ color: COLORS.orange }} />
                        </ListItemIcon>
                        <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 600, color: COLORS.textDark, fontSize: '1.05rem' }} />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            </Grid>

            {/* Right: Feature Cards */}
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <Grid container spacing={3}>
                  {[
                    { title: "Higher Earnings", val: "Earn 15-25% more", icon: <TrendingUp /> },
                    { title: "Reliable Partners", val: "Vetted brokers only", icon: <VerifiedUser /> },
                    { title: "Quick Setup", val: "Dispatched in 24h", icon: <Speed /> },
                    { title: "Growing Network", val: "500+ trusted drivers", icon: <Groups /> },
                  ].map((card, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <motion.div variants={slideInRight}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 4, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%',
                            transition: '0.3s', '&:hover': { transform: 'scale(1.03)', borderColor: COLORS.orange, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
                          }}
                        >
                          <Box sx={{ color: COLORS.orange, mb: 2 }}>{React.cloneElement(card.icon, { fontSize: 'large' })}</Box>
                          <Typography variant="h6" fontWeight="800" color={COLORS.textDark}>{card.title}</Typography>
                          <Typography variant="body2" color={COLORS.textMuted} sx={{ mt: 1 }}>{card.val}</Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ==================== TESTIMONIALS ==================== */}
      <Box sx={{ py: 15, bgcolor: COLORS.lightGray }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }} component={motion.div} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Typography variant="caption" fontWeight="800" color={COLORS.orange} letterSpacing={2}>TESTIMONIALS</Typography>
            <Typography variant="h2" fontWeight="800" color={COLORS.textDark} sx={{ mt: 1 }}>Trusted by Drivers Nationwide</Typography>
          </Box>
          
          <Grid container spacing={4}>
            {[
              { name: "Mike Rodriguez", role: "Owner-Operator, 8 years", text: "Switching to RoadRunner was the best decision. My revenue increased by 20% in the first month." },
              { name: "James Thompson", role: "Fleet Owner, 5 trucks", text: "Professional, reliable, and always available. Their dispatch team treats my drivers like family." },
              { name: "David Chen", role: "Owner-Operator, 3 years", text: "As a new owner-operator, I was overwhelmed. RoadRunner made it simple. Great rates, no hidden fees." }
            ].map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                >
                  <Paper sx={{ p: 5, height: '100%', borderRadius: 4, position: 'relative', bgcolor: 'white' }} elevation={0}>
                    <Box sx={{ display: 'flex', color: '#facc15', mb: 3 }}>{[...Array(5)].map((_, i) => <Star key={i} />)}</Box>
                    <Typography color={COLORS.textDark} sx={{ mb: 4, fontStyle: 'italic', lineHeight: 1.6, fontSize: '1.1rem' }}>"{t.text}"</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: COLORS.navy, width: 48, height: 48 }}>{t.name[0]}</Avatar>
                      <Box>
                        <Typography fontWeight="800" color={COLORS.textDark}>{t.name}</Typography>
                        <Typography variant="caption" color={COLORS.textMuted} fontWeight="600">{t.role}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ==================== CTA & FOOTER ==================== */}
      <Box sx={{ bgcolor: COLORS.navy, color: 'white' }}>
        {/* CTA Section */}
        <Box sx={{ 
          background: COLORS.navyGradient, 
          py: 15, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Container maxWidth="md">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <Typography variant="h2" fontWeight="900" gutterBottom>
                Ready to Grow Your <br /><span style={{ color: COLORS.orange }}>Trucking Business?</span>
              </Typography>
              <Typography sx={{ mb: 6, opacity: 0.8, fontSize: '1.25rem', fontWeight: 300 }}>
                Join hundreds of owner-operators who trust RoadRunner to maximize their earnings. 
                Get started today and experience the difference.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  component={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  variant="contained" size="large" 
                  onClick={() => navigate('/register')}
                  sx={{ bgcolor: COLORS.orange, px: 6, py: 2, borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: COLORS.orangeHover } }}
                >
                  Get Started Now
                </Button>
                <Button 
                  component={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  variant="outlined" size="large" 
                  sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', px: 6, py: 2, borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } }}
                >
                  Schedule a Call
                </Button>
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 4, opacity: 0.5, letterSpacing: 1 }}>
                NO CONTRACTS • NO HIDDEN FEES • CANCEL ANYTIME
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Footer Links */}
        <Container sx={{ py: 10 }}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 0.5, bgcolor: COLORS.orange, borderRadius: 1 }}>
                   <LocalShipping sx={{ color: 'white' }} fontSize="small" />
                </Box>
                <Typography variant="h5" fontWeight="800">RoadRunner</Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.7, mb: 4, lineHeight: 1.7 }}>
                Professional dispatch services for owner-operators and small fleets. We keep you moving.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, opacity: 0.9 }}>
                <Typography variant="h6" fontWeight="bold" color={COLORS.orange}>📞 1-800-123-4567</Typography>
              </Box>
            </Grid>
            {[
              { title: "Services", links: ["Load Booking", "Rate Negotiation", "Paperwork Management", "Billing Services"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] }
            ].map((col, i) => (
              <Grid item xs={6} md={2} key={i}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>{col.title}</Typography>
                {col.links.map(link => (
                  <Typography key={link} variant="body2" sx={{ mb: 1.5, opacity: 0.6, cursor: 'pointer', transition: '0.2s', '&:hover': { color: COLORS.orange, opacity: 1, paddingLeft: '5px' } }}>
                    {link}
                  </Typography>
                ))}
              </Grid>
            ))}
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 10, pt: 4, textAlign: 'center', opacity: 0.5 }}>
            <Typography variant="body2">© 2025 RoadRunner Dispatch. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;