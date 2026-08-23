"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CardMedia,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  ShoppingCart,
  LocalFlorist
} from '@mui/icons-material';
import AuthGuard from "@/components/auth/auth-guard";
import { useSnackbar } from '@/app/providers';

export default function RedeemShop() {
  const { showSuccess, showError } = useSnackbar();
  const [ecoTokens, setEcoTokens] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [redeemingId, setRedeemingId] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem("token");
      const [dashboardRes, rewardsRes] = await Promise.all([
        fetch("/api/volunteer/dashboard", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/volunteer/rewards", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!dashboardRes.ok || !rewardsRes.ok) {
        throw new Error('Failed to load the redeem shop');
      }

      const dashboardData = await dashboardRes.json();
      const rewardsData = await rewardsRes.json();
      setEcoTokens(dashboardData.ecoTokens ?? 0);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error loading redeem shop:', error);
      setFetchError('Could not load the redeem shop. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRedeem = async (reward) => {
    setRedeemingId(reward.id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('/api/volunteer/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        showError(data.message || 'Redemption failed');
        return;
      }

      setEcoTokens(data.ecoTokens);
      setRewards((prev) =>
        prev
          .map((r) => (r.id === reward.id && r.stock != null ? { ...r, stock: r.stock - 1 } : r))
          .filter((r) => r.stock == null || r.stock > 0)
      );
      showSuccess(data.message || `Redeemed ${reward.name}!`);
    } catch (error) {
      console.error('Error redeeming reward:', error);
      showError('Redemption failed. Please try again.');
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <AuthGuard requiredRole="VOLUNTEER">
        <Box sx={{
          minHeight: '100vh',
          bgcolor: 'white'
        }}>
          <Container maxWidth="lg" sx={{ pt: 12, pb: 6 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  background: 'linear-gradient(45deg, #00bfa5, #4caf50)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700
                }}
              >
                EcoToken Redeem Shop
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                Exchange your EcoTokens for eco-friendly rewards!
              </Typography>
              <Chip
                icon={<LocalFlorist />}
                label={isLoading ? 'Loading…' : `${ecoTokens} EcoTokens Available`}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontSize: '1.1rem',
                  px: 2,
                  py: 1,
                  '& .MuiChip-icon': { color: 'white' }
                }}
                size="large"
              />
            </Box>

            {fetchError && (
              <Alert
                severity="error"
                sx={{ borderRadius: '12px', mb: 4 }}
                action={
                  <Button color="inherit" size="small" onClick={loadData}>
                    Retry
                  </Button>
                }
              >
                {fetchError}
              </Alert>
            )}

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
              </Box>
            ) : !fetchError && rewards.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No rewards available right now — check back soon!
                </Typography>
              </Box>
            ) : (
              /* Rewards Grid */
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {rewards.map(reward => (
                  <Grid item xs={12} sm={6} md={4} key={reward.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      {reward.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={reward.imageUrl}
                          alt={reward.name}
                          sx={{ objectFit: 'contain', p: 2 }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {reward.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {reward.description}
                        </Typography>
                        <Chip
                          icon={<LocalFlorist />}
                          label={`${reward.cost} EcoTokens`}
                          sx={{
                            backgroundColor: 'secondary.main',
                            color: 'white',
                            mb: 2,
                            '& .MuiChip-icon': { color: 'white' }
                          }}
                        />
                        <Box>
                          <Button
                            variant="contained"
                            disabled={ecoTokens < reward.cost || redeemingId === reward.id}
                            startIcon={
                              redeemingId === reward.id
                                ? <CircularProgress size={18} sx={{ color: 'grey.500' }} />
                                : <ShoppingCart />
                            }
                            onClick={() => handleRedeem(reward)}
                            sx={{
                              width: '100%',
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 600,
                              ...(ecoTokens < reward.cost && {
                                backgroundColor: 'grey.300',
                                color: 'grey.500',
                              })
                            }}
                          >
                            {redeemingId === reward.id
                              ? 'Redeeming…'
                              : ecoTokens >= reward.cost ? "Redeem Now" : "Insufficient Tokens"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Back to Dashboard */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={Link}
                href="/volunteer/dashboard"
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Container>
        </Box>
    </AuthGuard>
  );
}
