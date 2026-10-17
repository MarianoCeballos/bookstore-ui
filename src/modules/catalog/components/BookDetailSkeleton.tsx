import { Box, Container, Divider, Paper, Skeleton, Stack } from '@mui/material';

export function BookDetailSkeleton() {
  return (
    <Container maxWidth="lg" aria-busy="true">
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 5 }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              width: { xs: '100%', sm: 260, md: 320 },
              height: { xs: 360, md: 440 },
              borderRadius: 2,
              flexShrink: 0,
              alignSelf: { xs: 'center', md: 'flex-start' },
            }}
          />
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={88} height={28} />
              <Skeleton variant="rounded" width={96} height={28} />
            </Stack>
            <Skeleton variant="text" width="75%" height={48} />
            <Skeleton variant="text" width="40%" height={28} />
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Skeleton variant="rounded" width={120} height={24} />
              <Skeleton variant="text" width={80} height={24} />
            </Stack>
            <Skeleton variant="text" width={120} height={44} />
            <Divider />
            <Box>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="96%" />
              <Skeleton variant="text" width="88%" />
              <Skeleton variant="text" width="65%" />
            </Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ pt: 1 }}
            >
              <Skeleton variant="rounded" width={180} height={42} />
              <Skeleton variant="rounded" width={180} height={42} />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" width={220} height={38} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={116} />
          <Skeleton variant="rounded" height={116} />
        </Stack>
      </Box>
    </Container>
  );
}
