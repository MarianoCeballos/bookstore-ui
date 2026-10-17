import { yupResolver } from '@hookform/resolvers/yup';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { PageStateCard } from '@/components/PageStateCard';
import {
  ALLOWED_PROFILE_PIC_TYPES,
  MAX_PROFILE_PIC_BYTES,
  ROUTES,
} from '@/constants';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { accountService } from '@/modules/account/services/account.service';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useOrders } from '@/modules/catalog/hooks/useCatalogQueries';
import { useUi } from '@/modules/ui/context/UiContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { formatDate, getUserInitials } from '@/utils/format';

interface ProfileFormValues {
  username: string;
  name: string;
  surname: string;
  email: string;
}

interface PasswordFormValues {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountPage() {
  const {
    user,
    updateProfile,
    uploadProfilePicture,
    removeProfilePicture,
    changePassword,
  } = useAuth();
  const { items: favorites } = useFavorites();
  const { items: cart } = useCart();
  const orders = useOrders();
  const { language } = useUi();
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileError, setProfileError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  const userReviewsQuery = useQuery({
    queryKey: ['user-reviews', user?.ID],
    queryFn: () => accountService.userReviews(user!.ID),
    enabled: Boolean(user?.ID),
  });

  const profileSchema = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .min(3, t('validationUsernameMin3'))
          .max(40),
        name: yup.string().trim().required(t('validationRequired')).max(100),
        surname: yup.string().trim().required(t('validationRequired')).max(100),
        email: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .email(t('validationEmail'))
          .max(255),
      }),
    [t],
  );

  const passwordSchema = useMemo(
    () =>
      yup.object({
        password: yup.string().required(t('validationRequired')).max(128),
        newPassword: yup
          .string()
          .required(t('validationRequired'))
          .min(12, t('validationPasswordMin12'))
          .max(128),
        confirmPassword: yup
          .string()
          .required(t('validationRequired'))
          .oneOf([yup.ref('newPassword')], t('validationPasswordsMatch')),
      }),
    [t],
  );

  const profileForm = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? '',
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username ?? '',
        name: user.name ?? '',
        surname: user.surname ?? '',
        email: user.email ?? '',
      });
    }
  }, [user, profileForm]);

  if (!user) return null;

  const fullName =
    [user.name, user.surname].filter(Boolean).join(' ').trim() || user.username;

  const handleFileTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';
    if (!selectedFile) return;

    setAvatarError('');
    const normalizedType = selectedFile.type.toLowerCase();
    if (
      !(ALLOWED_PROFILE_PIC_TYPES as readonly string[]).includes(normalizedType)
    ) {
      const msg = t('errorProfilePicFormat');
      setAvatarError(msg);
      toast.error(msg);
      return;
    }

    if (selectedFile.size > MAX_PROFILE_PIC_BYTES) {
      const msg = t('errorProfilePicSize');
      setAvatarError(msg);
      toast.error(msg);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await uploadProfilePicture(selectedFile);
      toast.success(t('toastProfilePicUpdated'));
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setAvatarError(message);
      toast.error(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user.profilePic) return;
    setAvatarError('');
    setIsRemovingAvatar(true);
    try {
      await removeProfilePicture();
      toast.success(t('toastProfilePicRemoved'));
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setAvatarError(message);
      toast.error(message);
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    setProfileError('');
    try {
      await updateProfile(values);
      toast.success(t('toastProfileSaved'), {
        description: `${values.name.trim()} ${values.surname.trim()}`.trim(),
      });
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setProfileError(message);
      toast.error(message);
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setPasswordError('');
    try {
      await changePassword({
        password: values.password,
        newPassword: values.newPassword,
      });
      passwordForm.reset({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success(t('toastPasswordUpdatedTitle'));
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setPasswordError(message);
      toast.error(message);
    }
  });

  const reviewsList = userReviewsQuery.data?.reviews ?? [];
  const ordersCount = orders.data?.length ?? 0;
  const avatarBusy = isUploadingAvatar || isRemovingAvatar;

  const quickStats = [
    {
      label: t('savedBooksCount'),
      value: favorites.length,
      icon: <FavoriteBorderRoundedIcon fontSize="small" color="primary" />,
      to: ROUTES.FAVORITES,
    },
    {
      label: t('booksInCartCount'),
      value: cart.length,
      icon: <ShoppingBagOutlinedIcon fontSize="small" color="primary" />,
      to: ROUTES.CART,
    },
    {
      label: t('completedOrdersCount'),
      value: ordersCount,
      icon: <ReceiptLongOutlinedIcon fontSize="small" color="primary" />,
      to: ROUTES.HISTORY,
    },
    {
      label: t('publishedReviewsCount'),
      value: reviewsList.length,
      icon: <RateReviewOutlinedIcon fontSize="small" color="primary" />,
      to: '#my-reviews-section',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.75 }}>
          {t('accountTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('accountSubtitle')}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Profile Header & Avatar Upload Card */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 2.5,
            background:
              'linear-gradient(135deg, rgba(221, 181, 119, 0.22) 0%, rgba(255, 250, 240, 0.96) 65%)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => void handleFileChange(event)}
            style={{ display: 'none' }}
            data-testid="profile-picture-input"
          />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2.5}
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Avatar
                  src={user.profilePic || undefined}
                  alt={fullName}
                  sx={{
                    width: 88,
                    height: 88,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 800,
                    fontSize: '1.75rem',
                    border: '3px solid #fffaf0',
                    boxShadow: '0 6px 18px rgba(30, 17, 11, 0.16)',
                  }}
                >
                  {getUserInitials(user)}
                </Avatar>
                <Tooltip
                  title={user.profilePic ? t('changePhoto') : t('uploadPhoto')}
                >
                  <span>
                    <IconButton
                      size="small"
                      aria-label={
                        user.profilePic ? t('changePhoto') : t('uploadPhoto')
                      }
                      disabled={avatarBusy}
                      onClick={handleFileTrigger}
                      sx={{
                        position: 'absolute',
                        right: -4,
                        bottom: -4,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        border: '2px solid #fffaf0',
                        '&:hover': { bgcolor: 'primary.dark' },
                      }}
                    >
                      {isUploadingAvatar ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <CameraAltOutlinedIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    rowGap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 800 }} noWrap>
                    {fullName}
                  </Typography>
                  <Chip
                    size="small"
                    icon={
                      user.admin ? (
                        <AdminPanelSettingsOutlinedIcon fontSize="small" />
                      ) : (
                        <PersonOutlineRoundedIcon fontSize="small" />
                      )
                    }
                    label={user.admin ? t('roleAdmin') : t('roleReader')}
                    color={user.admin ? 'primary' : 'default'}
                    variant={user.admin ? 'filled' : 'outlined'}
                  />
                  <Chip
                    size="small"
                    icon={<VerifiedUserOutlinedIcon fontSize="small" />}
                    label={user.enabled ? t('enabled') : t('suspended')}
                    color={user.enabled ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  @{user.username} · {t('accountId')}: #{user.ID}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {t('memberSince', {
                    date: formatDate(user.createdAt, language),
                  })}
                </Typography>
              </Box>
            </Stack>

            <Stack
              spacing={1}
              sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}
            >
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ flexWrap: 'wrap', rowGap: 1 }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFileTrigger}
                  disabled={avatarBusy}
                  startIcon={
                    isUploadingAvatar ? (
                      <CircularProgress size={15} color="inherit" />
                    ) : (
                      <CameraAltOutlinedIcon fontSize="small" />
                    )
                  }
                >
                  {isUploadingAvatar
                    ? t('uploadingPhoto')
                    : user.profilePic
                      ? t('changePhoto')
                      : t('uploadPhoto')}
                </Button>

                {user.profilePic && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => void handleRemoveAvatar()}
                    disabled={avatarBusy}
                    startIcon={
                      isRemovingAvatar ? (
                        <CircularProgress size={15} color="inherit" />
                      ) : (
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      )
                    }
                  >
                    {isRemovingAvatar ? t('removingPhoto') : t('removePhoto')}
                  </Button>
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {t('profilePicHint')}
              </Typography>
            </Stack>
          </Stack>

          {avatarError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {avatarError}
            </Alert>
          )}
        </Paper>

        {/* Quick Activity Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {quickStats.map((stat) => {
            const isHashLink = stat.to.startsWith('#');
            return (
              <Paper
                key={stat.label}
                component={isHashLink ? 'a' : Link}
                {...(isHashLink ? { href: stat.to } : { to: stat.to })}
                variant="outlined"
                sx={{
                  p: 2.25,
                  borderRadius: 2,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {stat.label}
                  </Typography>
                  {stat.icon}
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        {/* Two-column layout for Profile Details & Security */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* Profile Details Form */}
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', mb: 2 }}
            >
              <PersonOutlineRoundedIcon color="primary" />
              <Typography variant="h6">{t('profileDetails')}</Typography>
            </Stack>

            <Divider sx={{ mb: 2.5 }} />

            {profileError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {profileError}
              </Alert>
            )}

            <Stack
              component="form"
              onSubmit={(event) => void onProfileSubmit(event)}
              spacing={2}
              noValidate
            >
              <TextField
                fullWidth
                label={t('username')}
                {...profileForm.register('username')}
                error={Boolean(profileForm.formState.errors.username)}
                helperText={profileForm.formState.errors.username?.message}
                disabled={profileForm.formState.isSubmitting}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={t('firstName')}
                  {...profileForm.register('name')}
                  error={Boolean(profileForm.formState.errors.name)}
                  helperText={profileForm.formState.errors.name?.message}
                  disabled={profileForm.formState.isSubmitting}
                />
                <TextField
                  fullWidth
                  label={t('lastName')}
                  {...profileForm.register('surname')}
                  error={Boolean(profileForm.formState.errors.surname)}
                  helperText={profileForm.formState.errors.surname?.message}
                  disabled={profileForm.formState.isSubmitting}
                />
              </Stack>

              <TextField
                fullWidth
                label={t('email')}
                type="email"
                {...profileForm.register('email')}
                error={Boolean(profileForm.formState.errors.email)}
                helperText={profileForm.formState.errors.email?.message}
                disabled={profileForm.formState.isSubmitting}
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ pt: 1 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={profileForm.formState.isSubmitting}
                  startIcon={
                    profileForm.formState.isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                >
                  {profileForm.formState.isSubmitting
                    ? t('savingChanges')
                    : t('saveChanges')}
                </Button>

                {profileForm.formState.isDirty && (
                  <Button
                    type="button"
                    variant="outlined"
                    disabled={profileForm.formState.isSubmitting}
                    onClick={() => {
                      setProfileError('');
                      profileForm.reset({
                        username: user.username ?? '',
                        name: user.name ?? '',
                        surname: user.surname ?? '',
                        email: user.email ?? '',
                      });
                    }}
                  >
                    {t('resetChanges')}
                  </Button>
                )}

                <Button
                  component={Link}
                  to={ROUTES.HISTORY}
                  variant="outlined"
                  sx={{ ml: { sm: 'auto !important' } }}
                >
                  {t('viewHistory')}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Security / Password Change Card */}
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', mb: 0.75 }}
            >
              <LockOutlinedIcon color="primary" />
              <Typography variant="h6">{t('securitySectionTitle')}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('securitySectionDescription')}
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            <Stack
              component="form"
              onSubmit={(event) => void onPasswordSubmit(event)}
              spacing={2}
              noValidate
            >
              <TextField
                fullWidth
                type="password"
                label={t('currentPassword')}
                autoComplete="current-password"
                {...passwordForm.register('password')}
                error={Boolean(passwordForm.formState.errors.password)}
                helperText={passwordForm.formState.errors.password?.message}
                disabled={passwordForm.formState.isSubmitting}
              />

              <TextField
                fullWidth
                type="password"
                label={t('newPassword')}
                autoComplete="new-password"
                {...passwordForm.register('newPassword')}
                error={Boolean(passwordForm.formState.errors.newPassword)}
                helperText={passwordForm.formState.errors.newPassword?.message}
                disabled={passwordForm.formState.isSubmitting}
              />

              <TextField
                fullWidth
                type="password"
                label={t('confirmPassword')}
                autoComplete="new-password"
                {...passwordForm.register('confirmPassword')}
                error={Boolean(passwordForm.formState.errors.confirmPassword)}
                helperText={
                  passwordForm.formState.errors.confirmPassword?.message
                }
                disabled={passwordForm.formState.isSubmitting}
              />

              <Box sx={{ pt: 0.5 }}>
                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth
                  disabled={passwordForm.formState.isSubmitting}
                  startIcon={
                    passwordForm.formState.isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                >
                  {passwordForm.formState.isSubmitting
                    ? t('updatingPassword')
                    : t('updatePassword')}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* User Book Reviews Section */}
        <Paper
          id="my-reviews-section"
          variant="outlined"
          sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <RateReviewOutlinedIcon color="primary" />
              <Typography variant="h6">{t('myReviewsSectionTitle')}</Typography>
            </Stack>
            <Chip
              size="small"
              label={t('reviewsCount', { count: reviewsList.length })}
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ mb: 2.5 }} />

          {userReviewsQuery.isPending && (
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" height={84} />
              <Skeleton variant="rounded" height={84} />
            </Stack>
          )}

          {!userReviewsQuery.isPending && reviewsList.length === 0 && (
            <PageStateCard
              title={t('myReviewsEmptyTitle')}
              description={t('myReviewsEmptyDescription')}
              icon={<RateReviewOutlinedIcon fontSize="medium" />}
              actionLabel={t('browse')}
              actionTo={ROUTES.BOOKS}
            />
          )}

          {!userReviewsQuery.isPending && reviewsList.length > 0 && (
            <Stack spacing={2}>
              {reviewsList.map((review) => (
                <Paper
                  key={review.ID}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 250, 240, 0.5)',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      mb: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        component={Link}
                        to={ROUTES.BOOK_DETAIL(review.bookID)}
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.dark',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {review.book.title}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review.title}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt, language)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-line' }}
                  >
                    {review.review}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
