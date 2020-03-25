import React from 'react'
import styled from 'styled-components'
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table'
import { ColumnInstance} from 'react-table'
// A great library for fuzzy filtering/sorting items
import matchSorter from 'match-sorter'

import makeData, { IPerson } from './makeData'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

type Renderer = (x: any) => React.ReactNode;

interface ISimpleColumn {
  Header: string | Renderer,
  Footer?: string | Renderer,
  accessor: string
}

interface IGroupColumn {
  Header: string | Renderer,
  Footer?: string | Renderer,
  columns: Array<ISimpleColumn>
}

type IColumn = ISimpleColumn | IGroupColumn;

interface ITableArgument {
  columns: Array<IColumn>,
  data: Array<IPerson>
}

function Table({ columns, data }: ITableArgument) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
      },
      useSortBy
    )
  
    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows.slice(0, 20)
  
    return (
      <>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(/*column.getSortByToggleProps()*/)}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {firstPageRows.map(
              (row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                )}
            )}
          </tbody>
        </table>
        <br />
        <div>Showing the first 20 results of {rows.length} rows</div>
      </>
    )
  }


function App() {
  const columns : Array<IColumn>= React.useMemo(
      () => [
        {
          Header: 'Name',
          Footer: 'Name',
          columns: [
            {
              Header: 'First Name',
              accessor: 'firstName',
              Footer: 'First Name',
            },
            {
              Header: 'Last Name',
              accessor: 'lastName',
              Footer: 'Last Name',
            },
          ],
        },
        {
          Header: 'Info',
          Footer: 'Info',
          columns: [
            {
              Header: 'Age',
              accessor: 'age',
              Footer: 'Age',
            },
            {
              Header: 'Visits',
              accessor: 'visits',
              Footer: info => {
                // Only calculate total visits if rows change
                const total = React.useMemo(
                  () =>
                    info.rows.reduce((sum, row) => row.values.visits + sum, 0),
                  [info.rows]
                )
  
                return <>Total: {total}</>
              },
            },
            {
              Header: 'Status',
              accessor: 'status',
              Footer: 'Status',
            },
            {
              Header: 'Profile Progress',
              accessor: 'progress',
              Footer: 'Profile Progress',
            },
          ],
        },
      ],
    []
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App