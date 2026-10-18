import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('sorts numbers numerically, toggles direction, and preserves caller data', async () => {
    const user = userEvent.setup();
    const input = [
      { name: 'Ten', score: 10 },
      { name: 'Two', score: 2 },
      { name: 'Three', score: 3 },
    ];
    render(
      <DataTable
        columns={columns}
        rows={input}
        getRowKey={(row) => row.name}
      />,
    );
    const visibleNames = () =>
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getAllByRole('cell')[0].textContent);
    expect(visibleNames()).toEqual(['Ten', 'Two', 'Three']);
    await user.click(screen.getByRole('button', { name: 'Sort by Score' }));
    expect(visibleNames()).toEqual(['Two', 'Three', 'Ten']);
    expect(screen.getByRole('columnheader', { name: /Score/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await user.click(screen.getByRole('button', { name: 'Sort by Score' }));
    expect(visibleNames()).toEqual(['Ten', 'Three', 'Two']);
    expect(input.map((row) => row.name)).toEqual(['Ten', 'Two', 'Three']);
    await user.click(screen.getByRole('button', { name: 'Sort by Name' }));
    expect(visibleNames()).toEqual(['Ten', 'Three', 'Two']);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('uses natural text sorting and respects a default descending order', () => {
    render(
      <DataTable
        columns={columns}
        rows={[
          { name: 'Book 2', score: 1 },
          { name: 'book 10', score: 1 },
          { name: 'Book 1', score: 1 },
        ]}
        getRowKey={(row) => row.name}
        defaultSort={{ columnId: 'name', direction: 'desc' }}
      />,
    );
    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getAllByRole('cell')[0].textContent),
    ).toEqual(['book 10', 'Book 2', 'Book 1']);
  });

  it('places missing values last in ascending order and preserves equal-value order', () => {
    const nullableColumns: DataTableColumn<{
      name: string;
      score?: number | null;
    }>[] = [
      { id: 'name', label: 'Name', render: (row) => row.name },
      { id: 'score', label: 'Score', sortValue: (row) => row.score },
    ];
    render(
      <DataTable
        columns={nullableColumns}
        rows={[
          { name: 'Missing', score: null },
          { name: 'First', score: 2 },
          { name: 'Second', score: 2 },
          { name: 'Undefined' },
        ]}
        getRowKey={(row) => row.name}
        defaultSort={{ columnId: 'score', direction: 'asc' }}
      />,
    );
    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => within(row).getAllByRole('cell')[0].textContent),
    ).toEqual(['First', 'Second', 'Missing', 'Undefined']);
    expect(
      screen.queryByRole('button', { name: 'Sort by Name' }),
    ).not.toBeInTheDocument();
  });

  it('hides stale rows and empty feedback while loading', () => {
    render(
      <DataTable
        loading
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.name}
        emptyMessage="No records"
      />,
    );
    expect(screen.queryByText('Ada')).not.toBeInTheDocument();
    expect(screen.queryByText('No records')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
