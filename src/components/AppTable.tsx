"use client";

import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const AppTable = (
  {
    table,
    onRowClick,
    excludeFromRowClick = [],
  }: {
    table?: ReactTable<any>;
    onRowClick?: (param: any) => void;
    excludeFromRowClick?: string[];
  }
) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className="w-full border-separate border-spacing-y-3">
        {/* Table Header */}
        <thead>
          {table?.getHeaderGroups().map((headerGroup, index) => (
            <tr key={index}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 select-none cursor-pointer group"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="text-gray-300 group-hover:text-blue-600 transition-colors">
                      {{
                        asc: <ChevronUp size={14} strokeWidth={3} />,
                        desc: <ChevronDown size={14} strokeWidth={3} />,
                      }[header.column.getIsSorted() as string] ??
                        (header.column.getCanSort() && <ChevronsUpDown size={14} strokeWidth={2} />)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody className="before:block before:h-2">
          {table?.getRowModel().rows.map((row, index) => (
            <tr
              key={index}
              className={`
                group bg-white transition-all duration-200 shadow-sm border border-gray-100
                ${onRowClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-0.5' : ''}
              `}
              onClick={() => onRowClick && onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={i}
                  className={`
                    px-6 py-6 text-sm font-medium text-gray-600 border-y border-gray-50 first:border-l first:rounded-l-[1.5rem] last:border-r last:rounded-r-[1.5rem]
                    ${i === 0 ? 'text-gray-900 font-bold' : ''}
                  `}
                  onClick={(e) => {
                    if (
                      cell.column.id === "select" ||
                      cell.column.id === "action" ||
                      excludeFromRowClick.includes(cell.column.id)
                    ) {
                      e.stopPropagation();
                    }
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table?.getRowModel().rows.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[2rem] border border-gray-100 border-dashed">
          <p className="text-gray-400 font-bold">No data available in this view.</p>
        </div>
      )}
    </div>
  );
};

export default AppTable;