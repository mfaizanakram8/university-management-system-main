import moment from 'moment';
import React from 'react';
import TableLayout from './TableLayout';

export default function RegisterCourseTable({
  styles,
  headers,
  data,
  dataAttributes,
  handleAction,
}) {
  return (
    <TableLayout>
      <table className={'table table-sm ' + styles}>
        <thead className='bg-light text-secondary'>
          <tr>
            {headers?.map((header, index) => {
              return <th key={index}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((item, index) => {
              return (
                <tr key={index}>
                  {dataAttributes.map((attribute, index) => {
                    return (
                      <td key={index}>
                        {attribute !== 'action' ? (
                          attribute === 'createdAt' ? (
                            moment(item[attribute]).format('LL')
                          ) : (
                            item[attribute]
                          )
                        ) : (
                          <button
                            onClick={() => handleAction(item)}
                            className='btn btn-sm btn-secondary'
                          >
                            Register
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td className='text-center' colSpan={headers?.length}>
                No record found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </TableLayout>
  );
}
