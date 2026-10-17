import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import type { User } from '@/interfaces/models';
import { getUserInitials } from '@/utils/format';

interface UserAccountMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserAccountMenu({ user, onLogout }: UserAccountMenuProps) {
  const { t } = useTranslation();
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null,
  );

  const fullName =
    [user.name, user.surname].filter(Boolean).join(' ').trim() || user.username;
  const initials = getUserInitials(user);

  const handleClose = () => setUserMenuAnchor(null);

  const handleLogoutClick = () => {
    handleClose();
    onLogout();
  };

  return (
    <>
      <Button
        aria-label={t('account')}
        aria-controls={userMenuAnchor ? 'user-account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(userMenuAnchor)}
        onClick={(event) => setUserMenuAnchor(event.currentTarget)}
        color="inherit"
        sx={{
          p: 0.5,
          pl: 0.75,
          pr: 1,
          minWidth: 'auto',
          borderRadius: 999,
          gap: 0.75,
          border: '1px solid rgba(30, 17, 11, 0.2)',
          bgcolor: 'rgba(255, 250, 240, 0.45)',
          '&:hover': {
            bgcolor: 'rgba(255, 250, 240, 0.75)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#674533',
            color: '#fffaf0',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>
        <KeyboardArrowDownIcon
          fontSize="small"
          sx={{
            transition: 'transform 0.2s',
            transform: userMenuAnchor ? 'rotate(180deg)' : 'none',
          }}
        />
      </Button>

      <Menu
        id="user-account-menu"
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1,
              minWidth: 230,
              borderRadius: 2,
              bgcolor: '#fffaf0',
              border: '1px solid rgba(103, 69, 51, 0.2)',
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#674533',
              color: '#fffaf0',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
              {fullName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
              noWrap
            >
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <MenuItem component={Link} to={ROUTES.ACCOUNT} onClick={handleClose}>
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {t('account')}
        </MenuItem>

        <MenuItem component={Link} to={ROUTES.HISTORY} onClick={handleClose}>
          <ListItemIcon>
            <ReceiptLongOutlinedIcon fontSize="small" />
          </ListItemIcon>
          {t('purchaseHistory')}
        </MenuItem>

        {user.admin && (
          <MenuItem component={Link} to={ROUTES.ADMIN} onClick={handleClose}>
            <ListItemIcon>
              <AdminPanelSettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            {t('adminDashboard')}
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
}
