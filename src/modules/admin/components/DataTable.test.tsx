import { render, screen } from '@testing-library/react';
import {
  DataTable,
  type DataTableColumn,
} from '@/modules/admin/components/DataTable';

type Row = { name: string; score: number };

const columns: DataTableColumn<Row>[] = [
  { id: 'name', label: 'Name', sortValue: (row) => row.name },
  {
    id: 'score',
    label: 'Score',
    align: 'right',
    sortValue: (row) => row.score,
  },
];

const rows: Row[] = [{ name: 'Ada', score: 1 }];

describe('DataTable', () => {
  it('overlays a spinner on the placeholder rows while loading', () => {
    render(
      <DataTable
        loading
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.name}
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Loading data…' }),
    ).toBeInTheDocument();
  });

  it('renders the rows and hides the spinner once loading finishes', () => {
    render(
      <DataTable columns={columns} rows={rows} getRowKey={(row) => row.name} />,
    );

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows the empty message when there are no rows', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowKey={(row) => row.name}
        emptyMessage="Nothing here"
      />,
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
