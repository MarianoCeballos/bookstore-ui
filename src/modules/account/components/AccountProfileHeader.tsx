import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { User } from '@/interfaces/models';
import { useProfileAvatar } from '@/modules/account/hooks/useProfileAvatar';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatDate, getUserInitials } from '@/utils/format';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface AccountProfileHeaderProps {
  user: User;
}

export function AccountProfileHeader({ user }: AccountProfileHeaderProps) {
  const { t } = useTranslation();
  const { language } = useUi();
  const {
    fileInputRef,
    avatarError,
    isUploadingAvatar,
    isRemovingAvatar,
    isAvatarBusy,
    openFilePicker,
    handleFileChange,
    openRemoveConfirm,
    closeRemoveConfirm,
    confirmRemove,
    handleConfirmRemove,
  } = useProfileAvatar();

  const fullName =
    [user.name, user.surname].filter(Boolean).join(' ').trim() || user.username;

  return (
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
                  disabled={isAvatarBusy}
                  onClick={openFilePicker}
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

            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
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
              onClick={openFilePicker}
              disabled={isAvatarBusy}
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
                onClick={openRemoveConfirm}
                disabled={isAvatarBusy}
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
      <ConfirmDialog
        open={confirmRemove}
        title={t('confirmRemoveProfilePictureTitle')}
        description={t('confirmRemoveProfilePictureMessage')}
        confirmLabel={t('remove')}
        isLoading={isRemovingAvatar}
        onConfirm={() => void handleConfirmRemove()}
        onClose={closeRemoveConfirm}
      />
    </Paper>
  );
}
