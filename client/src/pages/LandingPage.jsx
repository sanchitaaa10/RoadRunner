import React from 'react';
import { 
  Box, Button, Typography, Container, Grid, Paper, Chip, Avatar, 
  InputBase, Card, CardContent, CardMedia, IconButton, Divider 
} from '@mui/material';
import { 
  ArrowForward, PlayArrow, Search, Star, CheckCircle, 
  LocalShipping, Map, Security 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', overflowX: 'hidden' }}>
      
      {/* --- NAVBAR (Sticky Glass) --- */}
      <Box sx={{ 
        py: 2, px: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box sx={{ width: 35, height: 35, bgcolor: '#6366f1', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <LocalShipping fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="bold" color="#1e293b">RoadRunner</Typography>
        </Box>
        
        {/* Desktop Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
          {['Platform', 'Solutions', 'Resources', 'Company'].map(link => (
            <Typography key={link} variant="body2" fontWeight="500" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: '#6366f1' } }}>
              {link}
            </Typography>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button sx={{ color: '#1e293b', fontWeight: 'bold' }} onClick={() => navigate('/login')}>
            Log In
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#1e293b', borderRadius: 2 }} onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </Box>
      </Box>

      {/* --- 1. HERO SECTION --- */}
      <Container maxWidth="xl" sx={{ pt: 8, pb: 10 }}>
        {/* The Grid container automatically handles responsive layout */}
        <Grid container spacing={6} alignItems="center">
          
          {/* LEFT: Copy (Takes 12 columns on small screens, 6 on medium+) */}
          <Grid item xs={12} md={6}>
            <Chip label="New: AI Route Optimization 🚀" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold', mb: 3 }} />
            <Typography variant="h2" fontWeight="800" sx={{ color: '#1e293b', lineHeight: 1.1, mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Delivery Intelligence <br /> <span style={{ color: '#6366f1' }}>Redefined.</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Orchestrate your entire last-mile logistics with our AI-powered platform. 
              Gain complete visibility, reduce costs, and delight customers.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" size="large" 
                onClick={() => navigate('/register')}
                sx={{ bgcolor: '#6366f1', px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2, boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outlined" size="large" startIcon={<PlayArrow />}
                sx={{ borderColor: '#cbd5e1', color: '#1e293b', px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
              >
                Watch Demo
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex' }}>
                {[1,2,3,4].map(i => (
                  <Avatar key={i} src={`https://i.pravatar.cc/150?img=${i+10}`} sx={{ width: 32, height: 32, border: '2px solid white', ml: -1 }} />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                Trusted by <b>500+</b> logistics teams worldwide.
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT: Dashboard Mockup (Takes 12 columns on small screens, 6 on medium+) */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {/* Blur Blob */}
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 400, height: 400, bgcolor: '#e0e7ff', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} />
              
              {/* Main Image */}
              <Paper elevation={10} sx={{ position: 'relative', zIndex: 1, borderRadius: 4, overflow: 'hidden', border: '4px solid rgba(255,255,255,0.5)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop" 
                  alt="Dashboard Preview" 
                  style={{ width: '100%', display: 'block' }} 
                />
                
                {/* Floating Notification Card */}
                <Paper sx={{ 
                  position: 'absolute', bottom: 30, left: -30, p: 2, borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: { xs: 'none', md: 'block' }
                }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box sx={{ p: 1, bgcolor: '#dcfce7', borderRadius: '50%', color: '#166534' }}><CheckCircle fontSize="small" /></Box>
                     <Box>
                       <Typography variant="subtitle2" fontWeight="bold">Delivery Complete</Typography>
                       <Typography variant="caption" color="text.secondary">Order #9921 • Just now</Typography>
                     </Box>
                   </Box>
                </Paper>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- 2. LOGO STRIP --- */}
      <Box sx={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', bgcolor: 'white', py: 5 }}>
        <Container>
          <Typography variant="caption" display="block" textAlign="center" color="text.secondary" fontWeight="bold" letterSpacing={1} mb={4}>
            POWERING NEXT-GEN LOGISTICS LEADERS
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 4, md: 8 }, opacity: 0.5 }}>
            {['LOGISTIC_CO', 'FAST_FLEET', 'AMAZING_DELIVERY', 'SHIP_IT', 'CARGO_PRO'].map(logo => (
              <Typography key={logo} variant="h6" fontWeight="900" color="#94a3b8">{logo}</Typography>
            ))}
          </Box>
        </Container>
      </Box>

      {/* --- 3. FEATURES GRID --- */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {[
            { title: "Live Tracking", desc: "Real-time visibility into every vehicle with sub-second latency.", icon: <Map fontSize="large" />, rating: "4.9" },
            { title: "Smart Dispatch", desc: "Auto-assign jobs to the nearest driver using AI algorithms.", icon: <LocalShipping fontSize="large" />, rating: "4.8" },
            { title: "Secure Platform", desc: "Enterprise-grade security compliant with SOC2 standards.", icon: <Security fontSize="large" />, rating: "5.0" }
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Paper sx={{ 
                p: 4, height: '100%', borderRadius: 4, border: '1px solid #f1f5f9',
                transition: 'all 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
              }} elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                   <Box sx={{ color: '#6366f1' }}>{item.icon}</Box>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#fffbeb', px: 1, borderRadius: 1 }}>
                     <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                     <Typography variant="caption" fontWeight="bold" color="#b45309">{item.rating}/5</Typography>
                   </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>{item.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>{item.desc}</Typography>
                <Button endIcon={<ArrowForward />} sx={{ color: '#6366f1', fontWeight: 'bold', p: 0 }}>Learn more</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- 4. MAP COVERAGE SECTION --- */}
      <Box sx={{ 
        bgcolor: '#0f172a', color: 'white', py: 12, position: 'relative', overflow: 'hidden',
        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg")', 
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'soft-light'
      }}>
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography variant="overline" color="#6366f1" fontWeight="bold" letterSpacing={2}>
            NATIONWIDE NETWORK
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 4, mt: 1 }}>
            Dispatch Delivers in Cities <br /> Across The Country
          </Typography>
          
          {/* Mock Search Bar */}
          <Paper sx={{ 
            p: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', maxWidth: 500, mx: 'auto',
            borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <InputBase
              sx={{ ml: 2, flex: 1, color: 'white' }}
              placeholder="Find your city..."
              inputProps={{ 'aria-label': 'search city' }}
            />
            <IconButton type="button" sx={{ p: '10px', color: '#6366f1' }}>
              <Search />
            </IconButton>
          </Paper>

          {/* Animated Dots Layer */}
          <Box sx={{ position: 'relative', height: 300, mt: 5, opacity: 0.8 }}>
             {[...Array(15)].map((_, i) => (
               <Box key={i} sx={{
                 position: 'absolute',
                 top: `${Math.random() * 80 + 10}%`,
                 left: `${Math.random() * 80 + 10}%`,
                 width: 8, height: 8, bgcolor: '#6366f1', borderRadius: '50%',
                 boxShadow: '0 0 10px #6366f1',
                 animation: `pulse ${2 + i%3}s infinite`
               }} />
             ))}
             <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, right: 10, opacity: 0.5 }}>
               * Representative coverage map
             </Typography>
          </Box>
          <style>{`@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }`}</style>
        </Container>
      </Box>

      {/* --- 5. RESOURCES / BLOG --- */}
      <Container sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
           <Typography variant="h4" fontWeight="bold" gutterBottom>Latest Insights</Typography>
           <Typography color="text.secondary">Discover trends in last-mile delivery.</Typography>
        </Box>
        <Grid container spacing={4}>
          {[
            { title: "The Future of AI in Logistics", tag: "TECHNOLOGY", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=60" },
            { title: "Scaling Your Fleet Operations", tag: "GROWTH", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=60" },
            { title: "Driver Retention Strategies", tag: "MANAGEMENT", img: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=500&q=60" }
          ].map((blog, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardMedia component="img" height="180" image={blog.img} />
                <CardContent>
                  <Typography variant="caption" color="primary" fontWeight="bold">{blog.tag}</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 1, lineHeight: 1.3 }}>{blog.title}</Typography>
                  <Button size="small" sx={{ color: '#1e293b', p: 0, textTransform: 'none', mt: 1 }} endIcon={<ArrowForward fontSize="small" />}>
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- FOOTER --- */}
      <Box sx={{ bgcolor: 'white', borderTop: '1px solid #e2e8f0', py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>RoadRunner</Typography>
          <Typography variant="body2" color="text.secondary">© 2025 RoadRunner Logistics. All rights reserved.</Typography>
        </Container>
      </Box>

    </Box>
  );
};

export default LandingPage;