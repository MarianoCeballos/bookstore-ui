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
    setIsDeleting(true);
    try {
      await accountService.deleteReview(reviewIdToDelete);
      toast.success(t('toastReviewDeleted'));
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
        headers={[
          t('idColumn'),
          t('reviewTitle'),
          t('readerColumn'),
          t('rating'),
          t('reports'),
          t('actions'),
        ]}
        rows={
          reviewsQuery.data?.map((item) => [
            item.ID,
            item.title,
            `@${item.user.username}`,
            item.rating,
            item.reports.length,
            <Button
              key="remove"
              size="small"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
              onClick={() => setReviewIdToDelete(item.ID)}
            >
              {t('remove')}
            </Button>,
          ]) ?? []
        }
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
