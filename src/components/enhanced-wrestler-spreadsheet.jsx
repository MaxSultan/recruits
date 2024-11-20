'use client';
import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label' 

export function EnhancedWrestlerSpreadsheetComponent({athletes}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchColumn, setSearchColumn] = React.useState('name')

  const [tableData, setTableData] = React.useState(athletes);
  const [addingProspect, setAddingProspect] = React.useState(false);
  const [newProspect, setNewProspect] = React.useState({})



  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all" />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row" />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'highSchool',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>High School
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('highSchool')}</div>,
    },
    {
      accessorKey: 'state',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>State
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div className="uppercase">{row.getValue('state')}</div>,
    },
    {
      accessorKey: 'wins',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Wins
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('wins')}</div>,
    },
    {
      accessorKey: 'losses',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Losses
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('losses')}</div>,
    },
    {
      accessorKey: 'grade',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Grade
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('grade')}</div>,
    },
    {
      accessorKey: 'weightClass',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Weight Class
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('weightClass')}</div>,
    },
    {
      accessorKey: 'previousYearStatePlacement',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Previous Year State Placement
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('previousYearStatePlacement')}</div>,
    },
    {
      accessorKey: 'winPercentage',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Win Percentage
                        <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>)
        );
      },
      cell: ({ row }) => <div>{row.getValue('winPercentage').toFixed(2)}%</div>,
    },
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleAddProspectClick = () => {
    setAddingProspect(true)
  }

  const handleAddProspect = () => {
    console.log('added')
  }

  return (
    (<div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Select
          value={searchColumn}
          onValueChange={(value) => {
            setSearchColumn(value)
            table.getColumn(value)?.setFilterValue('')
          }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select column to search" />
          </SelectTrigger>
          <SelectContent>
            {table.getAllColumns()
              .filter((column) => column.getCanFilter())
              .map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.id}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Input
          placeholder={`Filter ${searchColumn}...`}
          value={(table.getColumn(searchColumn)?.getFilterValue()) ?? ''}
          onChange={(event) =>
            table.getColumn(searchColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-4" />
        <Button onClick={handleAddProspectClick}>Add Prospect</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  (<DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>)
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>  
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    (<TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>)
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(table.getRowModel().rows ?? []).length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
      <Dialog open={addingProspect} onOpenChange={setAddingProspect}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recruit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProspect.name || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="highSchool" className="text-right">
                 High School
                </Label>
                <Input
                  id="highSchool"
                  value={newProspect.highSchool || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, highSchool: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                 State
                </Label>
                <Input
                  id="state"
                  value={newProspect.state || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, state: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="wins" className="text-right">
                 Wins
                </Label>
                <Input
                  id="wins"
                  value={newProspect.wins || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, wins: e.target.value })}
                  className="col-span-3" 
                  type="number"
                  step={1}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="losses" className="text-right">
                 Losses
                </Label>
                <Input
                  id="losses"
                  value={newProspect.losses || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, losses: e.target.value })}
                  className="col-span-3" 
                  type="number"
                  step={1}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="placement" className="text-right">
                 Previous Year&apos;s State Placement
                </Label>
                <Input
                  id="placement"
                  value={newProspect.placement || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, placement: e.target.value })}
                  className="col-span-3" 
                  type="number"
                  step={1}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                 Weight
                </Label>
                <Input
                  id="weight"
                  value={newProspect.weight || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, weight: e.target.value })}
                  className="col-span-3" />
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                 Notes
                </Label>
                <Input
                  id="notes"
                  value={newProspect.notes || ''}
                  onChange={(e) => setNewProspect({ ...newProspect, notes: e.target.value })}
                  className="col-span-3" 
                  type="number"
                  step={1}
                  />
              </div>
              </div>
            <DialogFooter>
              <Button onClick={handleAddProspect}>Add Recruit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>)
  );
}