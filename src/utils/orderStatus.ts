import type { TFunction } from 'i18next';

/**
 * Order statuses come from the API as the raw enum values
 * (`pending`, `approved`, `rejected`, `cancelled`). Map the ones we know to
 * translation keys and fall back to the raw value for anything new.
 */
const ORDER_STATUS_KEYS: Record<string, string> = {
  pending: 'orderStatusPending',
  approved: 'orderStatusApproved',
  rejected: 'orderStatusRejected',
  cancelled: 'orderStatusCancelled',
};

export function getOrderStatusLabel(status: string, t: TFunction): string {
  const key = ORDER_STATUS_KEYS[status.trim().toLowerCase()];
  return key ? t(key) : status;
}
