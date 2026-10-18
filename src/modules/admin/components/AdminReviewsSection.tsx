import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Button } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { accountService } from '@/modules/account/services/account.service';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { getLocalizedErrorMessage } from '@/utils/error';

export function AdminReviewsSection() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [reviewIdToDelete, setReviewIdToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const reviewsQuery = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: adminService.reviews,
  });

  const handleConfirmDelete = async () => {
    if (reviewIdToDelete == null) return;
    const targetReview = reviewsQuery.data?.find(
      (item) => item.ID === reviewIdToDelete,
    );
    setIsDeleting(true);
    try {
      await accountService.deleteReview(reviewIdToDelete);
      toast.success(t('toastReviewDeleted'), {
        description: targetReview?.title,
      });
      setReviewIdToDelete(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
        queryClient.invalidateQueries({ queryKey: ['books'] }),
      ]);
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DataTable
        loading={reviewsQuery.isPending}
        error={reviewsQuery.isError}
        onRetry={() => void reviewsQuery.refetch()}
        rows={reviewsQuery.data ?? []}
        getRowKey={(item) => item.ID}
        columns={[
          {
            id: 'id',
            label: t('idColumn'),
            sortValue: (item) => item.ID,
          },
          {
            id: 'title',
            label: t('reviewTitle'),
            sortValue: (item) => item.title,
          },
          {
            id: 'reader',
            label: t('readerColumn'),
            sortValue: (item) => item.user.username,
            render: (item) => `@${item.user.username}`,
          },
          {
            id: 'rating',
            label: t('rating'),
            align: 'right',
            sortValue: (item) => item.rating,
          },
          {
            id: 'reports',
            label: t('reports'),
            align: 'right',
            sortValue: (item) => item.reports.length,
          },
          {
            id: 'actions',
            label: t('actions'),
            align: 'right',
            render: (item) => (
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                onClick={() => setReviewIdToDelete(item.ID)}
              >
                {t('remove')}
              </Button>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={reviewIdToDelete != null}
        title={t('confirmDeleteReviewTitle')}
        description={t('confirmDeleteReviewMessage')}
        confirmLabel={t('remove')}
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setReviewIdToDelete(null)}
      />
    </>
  );
}
