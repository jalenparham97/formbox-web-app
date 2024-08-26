"use client";

import * as React from "react";
import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button, DefaultButton } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/tailwind-helpers";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { Affix } from "./affix";

// import { DataTablePagination } from "../components/data-table-pagination";
// import { DataTableToolbar } from "../components/data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelectedIds: (ids: string[]) => void;
  selectedIds: string[];
  onDelete: () => Promise<void>;
  isLoading?: boolean;
  deleteModalTitle?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setSelectedIds,
  selectedIds,
  onDelete,
  isLoading,
  deleteModalTitle,
}: DataTableProps<TData, TValue>) {
  const [openDeleteModal, openDeleteModalHandlers] = useDialog();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const selectedRowData = table
    .getSelectedRowModel()
    .flatRows.map((row: any) => row.original.id as string);

  React.useEffect(() => {
    setSelectedIds(selectedRowData);
  }, [rowSelection]);

  async function deleteData() {
    await onDelete();
    setRowSelection({});
  }

  function closeActions() {
    setSelectedIds([]);
    setRowSelection({});
  }

  return (
    <div className="space-y-4">
      {/* <DataTableToolbar table={table} /> */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className=""
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className=""
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <DataTablePagination table={table} /> */}

      {selectedIds.length > 0 && (
        <Affix className="-bottom-3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex w-[300px] items-center justify-between lg:w-[400px]">
            <div>
              <Button
                size="sm"
                leftIcon={<IconTrash size={16} />}
                variant="destructive"
                onClick={openDeleteModalHandlers.open}
              >
                Delete
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-gray-500">
                {selectedIds.length} item{selectedIds.length > 1 && "s"}{" "}
                selected
              </p>
              <Button size="sm" variant="secondary" onClick={closeActions}>
                Cancel
              </Button>
            </div>
          </div>
        </Affix>
      )}

      <DeleteDialog
        title={deleteModalTitle}
        open={openDeleteModal}
        onClose={openDeleteModalHandlers.close}
        onDelete={deleteData}
        loading={isLoading}
      />
    </div>
  );
}

const loadingData = new Array(5).fill("");

export function DataTableLoadingSkeleton() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
            >
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead
              scope="col"
              className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
            >
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              <Skeleton className="h-4 w-[100px]" />
            </TableHead>
            <TableHead
              scope="col"
              className="relative py-3.5 pl-3 pr-4 sm:pr-0"
            >
              <Skeleton className="h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingData.map((_, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <Skeleton className="h-4 w-[100px]" />
              </TableCell>
              <TableCell className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <Skeleton className="h-4 w-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  setValues: React.Dispatch<React.SetStateAction<Set<any>>>;
  values: string[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  setValues,
  values = [],
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [selectedValues, setSelectedValues] = React.useState(new Set(values));
  const facets = column?.getFacetedUniqueValues();

  React.useEffect(() => {
    setSelectedValues(new Set(values));
  }, [values]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <DefaultButton variant="outline" className="border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          <div>{title}</div>
          {selectedValues?.size > 0 && (
            <>
              <Divider orientation="vertical" className="mx-2.5 h-4" />
              <Badge
                variant="gray"
                className="rounded-sm font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="gray" className="rounded-sm font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="gray"
                        key={option.value}
                        className="rounded-sm font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </DefaultButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      setSelectedValues(
                        filterValues.length
                          ? new Set(filterValues)
                          : new Set([] as string[]),
                      );
                      setValues(
                        filterValues.length
                          ? new Set(filterValues)
                          : new Set([] as string[]),
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-400",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <IconCheck className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues(new Set([] as string[]));
                      setValues(new Set([] as string[]));
                    }}
                    className="cursor-pointer justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
