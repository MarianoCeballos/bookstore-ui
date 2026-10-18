import { Avatar, Button, Chip, Stack } from '@mui/material';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TableSearchField } from '@/components/TableSearchField';
import type { User } from '@/interfaces/models';
import { accountService } from '@/modules/account/services/account.service';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { useAuthenticatedUser } from '@/modules/auth/context/AuthenticatedUserContext';
import { useDebouncedValue } from '@/modules/catalog/hooks/useDebouncedValue';
import { getLocalizedErrorMessage } from '@/utils/error';

type UserStatusAction = 'enabled' | 'suspended' | 'admin' | 'banned';

interface PendingUserAction {
  user: User;
  status: UserStatusAction;
}

interface PendingActionCopy {
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor: 'primary' | 'error' | 'warning';
}

export function AdminUsersSection() {
  const { t } = useTranslation();
  const currentUser = useAuthenticatedUser();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingUserAction | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', debouncedQuery],
    queryFn: () => adminService.users(debouncedQuery || undefined),
    placeholderData: keepPreviousData,
  });

  const visibleUsers: User[] =
    usersQuery.data?.filter((item) => item.ID !== currentUser.ID) ?? [];

  const invalidateUsers = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
    ]);
  };

  const describePendingAction = (
    action: PendingUserAction,
  ): PendingActionCopy => {
    const username = action.user.username;
    switch (action.status) {
      case 'banned':
        return {
          title: t('confirmBanUserTitle'),
          description: t('confirmBanUserMessage', { username }),
          confirmLabel: t('ban'),
          confirmColor: 'error',
        };
      case 'suspended':
        return {
          title: t('confirmSuspendUserTitle'),
          description: t('confirmSuspendUserMessage', { username }),
          confirmLabel: t('suspend'),
          confirmColor: 'warning',
        };
      case 'enabled':
        return {
          title: t('confirmEnableUserTitle'),
          description: t('confirmEnableUserMessage', { username }),
          confirmLabel: t('enable'),
          confirmColor: 'primary',
        };
      case 'admin':
        return action.user.admin
          ? {
              title: t('confirmRevokeAdminTitle'),
              description: t('confirmRevokeAdminMessage', { username }),
              confirmLabel: t('toggleAdmin'),
              confirmColor: 'warning',
            }
          : {
              title: t('confirmGrantAdminTitle'),
              description: t('confirmGrantAdminMessage', { username }),
              confirmLabel: t('toggleAdmin'),
              confirmColor: 'primary',
            };
    }
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingAction || pendingAction.user.ID === currentUser.ID) return;
    const { user, status } = pendingAction;
    setIsSubmitting(true);
    try {
      if (status === 'banned') {
        await accountService.removeUser(user.ID);
        toast.success(t('toastUserBanned'), {
          description: `@${user.username}`,
        });
      } else {
        await accountService.setUserStatus(user.ID, status);
        toast.success(t('toastUserUpdated'), {
          description: `@${user.username}`,
        });
      }
      setPendingAction(null);
      await invalidateUsers();
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCopy = pendingAction
    ? describePendingAction(pendingAction)
    : null;

  return (
    <Stack spacing={2.5}>
      <TableSearchField
        value={query}
        onChange={setQuery}
        placeholder={t('filterUsername')}
      />

      <DataTable<User>
        loading={usersQuery.isPending}
        rows={visibleUsers}
        getRowKey={(item) => item.ID}
        columns={[
          {
            id: 'id',
            label: t('idColumn'),
            sortValue: (item) => item.ID,
          },
          {
            id: 'profilePic',
            label: '',
            render: (item) => (
              <Avatar
                src={item.profilePic}
                alt={item.username}
                sx={{ width: 32, height: 32 }}
              />
            ),
          },
          {
            id: 'username',
            label: t('username'),
            sortValue: (item) => item.username,
          },
          {
            id: 'email',
            label: t('email'),
            sortValue: (item) => item.email,
          },
          {
            id: 'role',
            label: t('roleColumn'),
            sortValue: (item) => (item.admin ? 1 : 0),
            render: (item) => (
              <Chip
                size="small"
                label={item.admin ? t('roleAdmin') : t('roleReader')}
                color={item.admin ? 'primary' : 'default'}
                variant={item.admin ? 'filled' : 'outlined'}
              />
            ),
          },
          {
            id: 'status',
            label: t('status'),
            sortValue: (item) => (item.banned ? 2 : item.enabled ? 0 : 1),
            render: (item) => (
              <Chip
                size="small"
                label={
                  item.banned
                    ? t('banned')
                    : item.enabled
                      ? t('enabled')
                      : t('suspended')
                }
                color={item.banned || !item.enabled ? 'error' : 'success'}
                variant="filled"
              />
            ),
          },
          {
            id: 'actions',
            label: t('actions'),
            align: 'right',
            render: (item) => (
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setPendingAction({
                      user: item,
                      status: item.enabled ? 'suspended' : 'enabled',
                    })
                  }
                >
                  {item.enabled ? t('suspend') : t('enable')}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setPendingAction({ user: item, status: 'admin' })
                  }
                >
                  {t('toggleAdmin')}
                </Button>
                {!item.banned && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() =>
                      setPendingAction({ user: item, status: 'banned' })
                    }
                  >
                    {t('ban')}
                  </Button>
                )}
              </Stack>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={pendingAction != null}
        title={pendingCopy?.title ?? ''}
        description={pendingCopy?.description ?? ''}
        confirmLabel={pendingCopy?.confirmLabel}
        confirmColor={pendingCopy?.confirmColor}
        isLoading={isSubmitting}
        onConfirm={() => void handleConfirmPendingAction()}
        onClose={() => setPendingAction(null)}
      />
    </Stack>
  );
}
