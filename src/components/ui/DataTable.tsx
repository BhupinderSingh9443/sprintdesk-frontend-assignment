import type {
  Key,
  ReactNode,
} from 'react';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (
    row: T,
  ) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns:
    DataTableColumn<T>[];

  rows: T[];

  getRowKey: (
    row: T,
  ) => Key;

  caption?: string;

  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  emptyMessage =
    'No data available.',
}: DataTableProps<T>) {
  return (
    <div
      className="
        overflow-x-auto
        rounded-xl
        border
        border-slate-200
        dark:border-slate-800
      "
    >
      <table
        className="
          min-w-full
          divide-y
          divide-slate-200
          dark:divide-slate-800
        "
      >
        {caption && (
          <caption
            className="sr-only"
          >
            {caption}
          </caption>
        )}

        <thead
          className="
            bg-slate-50
            dark:bg-slate-900
          "
        >
          <tr>
            {columns.map(
              (column) => (
                <th
                  key={
                    column.id
                  }
                  scope="col"
                  className={`
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                    dark:text-slate-400

                    ${
                      column.className ??
                      ''
                    }
                  `}
                >
                  {column.header}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody
          className="
            divide-y
            divide-slate-100
            bg-white
            dark:divide-slate-800
            dark:bg-slate-950
          "
        >
          {rows.map(
            (row) => (
              <tr
                key={
                  getRowKey(
                    row,
                  )
                }
                className="
                  hover:bg-slate-50
                  dark:hover:bg-slate-900
                "
              >
                {columns.map(
                  (column) => (
                    <td
                      key={
                        column.id
                      }
                      className={`
                        whitespace-nowrap
                        px-4
                        py-3
                        text-sm
                        text-slate-700
                        dark:text-slate-300

                        ${
                          column.className ??
                          ''
                        }
                      `}
                    >
                      {
                        column.cell(
                          row,
                        )
                      }
                    </td>
                  ),
                )}
              </tr>
            ),
          )}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={
                  columns.length
                }
                className="
                  px-4
                  py-10
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                {
                  emptyMessage
                }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}