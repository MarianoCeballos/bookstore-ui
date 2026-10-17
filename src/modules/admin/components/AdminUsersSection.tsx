import { Button, Chip, Stack, TextField } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { User } from '@/interfaces/models';
import { accountService } from '@/modules/account/services/account.service';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { getLocalizedErrorMessage } from '@/utils/error';

export function AdminUsersSection() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [mutatingUserId, setMutatingUserId] = useState<number | null>(null);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [isBanning, setIsBanning] = useState(false);

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => adminService.users(query.trim() || undefined),
  });

  const visibleUsers =
    usersQuery.data?.filter((item) => item.ID !== currentUser?.ID) ?? [];

  const invalidateUsers = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    ]);
  };

  const handleStatusChange = async (
    userId: number,
    status: 'enabled' | 'suspended' | 'admin',
  ) => {
    if (currentUser && userId === currentUser.ID) return;
    const targetUser = usersQuery.data?.find((item) => item.ID === userId);
    setMutatingUserId(userId);
    try {
      await accountService.setUserStatus(userId, status);
      toast.success(t('toastUserUpdated'), {
        description: targetUser ? `@${targetUser.username}` : undefined,
      });
      await invalidateUsers();
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setMutatingUserId(null);
    }
  };

  const handleConfirmBan = async () => {
    if (!userToBan || (currentUser && userToBan.ID === currentUser.ID)) return;
    const bannedUsername = userToBan.username;
    setIsBanning(true);
    try {
      await accountService.removeUser(userToBan.ID);
      toast.success(t('toastUserBanned'), {
        description: `@${bannedUsername}`,
      });
      setUserToBan(null);
      await invalidateUsers();
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setIsBanning(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <TextField
        label={t('filterUsername')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ maxWidth: 400, bgcolor: 'background.paper' }}
        size="small"
      />

      <DataTable
        loading={usersQuery.isPending}
        headers={[
          t('idColumn'),
          t('username'),
          t('email'),
          t('roleColumn'),
          t('status'),
          t('actions'),
        ]}
        rows={
          visibleUsers.map((item) => {
            const isMutating = mutatingUserId === item.ID;
            return [
              item.ID,
              item.username,
              item.email,
              <Chip
                key="role"
                size="small"
                label={item.admin ? t('roleAdmin') : t('roleReader')}
                color={item.admin ? 'primary' : 'default'}
                variant={item.admin ? 'filled' : 'outlined'}
              />,
              <Chip
                key="status"
                size="small"
                label={
                  item.banned
                    ? t('banned')
                    : item.enabled
                      ? t('enabled')
                      : t('suspended')
                }
                color={
                  item.banned ? 'error' : item.enabled ? 'success' : 'warning'
                }
                variant="outlined"
              />,
              <Stack
                direction="row"
                spacing={1}
                key="actions"
                sx={{ flexWrap: 'wrap' }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  disabled={isMutating}
                  onClick={() =>
                    void handleStatusChange(
                      item.ID,
                      item.enabled ? 'suspended' : 'enabled',
                    )
                  }
                >
                  {item.enabled ? t('suspend') : t('enable')}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  disabled={isMutating}
                  onClick={() => void handleStatusChange(item.ID, 'admin')}
                >
                  {t('toggleAdmin')}
                </Button>
                {!item.banned && (
                  <Button
                    size="small"
                    color="error"
                    disabled={isMutating}
                    onClick={() => setUserToBan(item)}
                  >
                    {t('ban')}
                  </Button>
                )}
              </Stack>,
            ];
          }) ?? []
        }
      />

      <ConfirmDialog
        open={userToBan != null}
        title={t('confirmBanUserTitle')}
        description={t('confirmBanUserMessage', {
          username: userToBan?.username ?? '',
        })}
        confirmLabel={t('ban')}
        isLoading={isBanning}
        onConfirm={() => void handleConfirmBan()}
        onClose={() => setUserToBan(null)}
      />
    </Stack>
  );
}
