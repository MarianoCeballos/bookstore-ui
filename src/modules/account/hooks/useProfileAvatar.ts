import { type ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ALLOWED_PROFILE_PIC_TYPES, MAX_PROFILE_PIC_BYTES } from '@/constants';
import { useAuthenticatedUser } from '@/modules/auth/context/AuthenticatedUserContext';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { getLocalizedErrorMessage } from '@/utils/error';

/**
 * Owns the profile picture file input, upload/remove lifecycle, busy flags and
 * localized validation/error feedback for the account page.
 */
export function useProfileAvatar() {
  const { t } = useTranslation();
  const user = useAuthenticatedUser();
  const { uploadProfilePicture, removeProfilePicture } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const openFilePicker = () => {
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
      const message = t('errorProfilePicFormat');
      setAvatarError(message);
      toast.error(message);
      return;
    }

    if (selectedFile.size > MAX_PROFILE_PIC_BYTES) {
      const message = t('errorProfilePicSize');
      setAvatarError(message);
      toast.error(message);
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

  const performRemoveAvatar = async () => {
    if (!user?.profilePic) return;
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

  const handleConfirmRemove = async () => {
    setConfirmRemove(false);
    await performRemoveAvatar();
  };

  const openRemoveConfirm = () => {
    setConfirmRemove(true);
  };

  const closeRemoveConfirm = () => {
    setConfirmRemove(false);
  };

  return {
    fileInputRef,
    avatarError,
    isUploadingAvatar,
    isRemovingAvatar,
    isAvatarBusy: isUploadingAvatar || isRemovingAvatar,
    openFilePicker,
    handleFileChange,
    openRemoveConfirm,
    closeRemoveConfirm,
    confirmRemove,
    handleConfirmRemove,
  };
}
