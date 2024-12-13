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
import { createClient } from '@supabase/supabase-js';

import { snakeCaseKeys } from '@/utils/strings'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


// Who are you?
// - name

// Should we recruit you?
// - school
// - Classification
// - Win percentage
// - State placement
// - record from each year
// - Grade
// - Big tournament placement

// How do we value you as a recruit?
// - Technique
// - Hungry?

// How do we contact you?
// - Coach name
// - Coach email
// - Coach phone #
// - Personal phone #
// - Parent phone #

// Do you fit in the lineup?
// - projected weight

const RecruitForm = ({open, onOpenChange, activeProspect = {}, onSubmit}) => {
  const [newData, setNewData] = React.useState({})

  const handleAddRecruit = async () => {

    const prospect = snakeCaseKeys({...activeProspect, ...newData, status: 'prospect'});
    const { error } = await supabase
    .from('athletes')
    .update(prospect)
    .eq('primary_key', prospect.primary_key)
  
    onSubmit(prospect)
  }

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{activeProspect.name} ({activeProspect.weightClass})</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="projectedWeightClass" className="text-right">
          Projected Weight Class
        </Label>
          <Select
          id="projectedWeightClass"
          value={newData.projectedWeightClass || ''}
          onValueChange={(e) => setNewData({ ...newData, projectedWeightClass: e })}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Weight Class" />
          </SelectTrigger>
          <SelectContent>
            {['125', '133', '141', '149', '157', '165', '174', '184', '197', '285']
              .map((weightClass) => (
                <SelectItem key={weightClass} value={weightClass}>
                  {weightClass}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="priority" className="text-right">
          Priority
        </Label>
          <Select
          id="priority"
          value={newData.priority || ''}
          onValueChange={(e) => setNewData({ ...newData, priority: e })}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            {['high', 'medium', 'low']
              .map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
         Notes
        </Label>
        <Input
          id="notes"
          value={newData.notes || ''}
          onChange={(e) => setNewData({ ...newData, notes: e.target.value })}
          className="col-span-3" />
      </div>
    </div>

    <DialogFooter>
      <Button onClick={() => handleAddRecruit(activeProspect)}>Add as Recruit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
)
}


const ProspectForm = ({open, onOpenChange, activeProspect = {}, onSubmit, setActiveProspect}) => {

  const handleAddProspect = async (prospect) => {
    const snakeCasedObjectKeys = snakeCaseKeys(prospect);
    const { error } = await supabase
    .from('athletes')
    .insert(snakeCasedObjectKeys)
  
    onSubmit(prospect)
  }

  const handleEditProspect = async (prospect) => {
    const snakeCasedObjectKeys = snakeCaseKeys(prospect);

    delete snakeCasedObjectKeys.win_percentage
    console.log(snakeCasedObjectKeys)
    const { error } = await supabase
    .from('athletes')
    .update(snakeCasedObjectKeys)
    .eq('primary_key', prospect.primaryKey)

    onSubmit(prospect)
  }

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{activeProspect.primaryKey ? "Edit Prospect": "Add New Recruit"}</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={activeProspect.name || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, name: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="highSchool" className="text-right">
         High School
        </Label>
        <Input
          id="highSchool"
          value={activeProspect.highSchool || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, highSchool: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="state" className="text-right">
         State
        </Label>
        <Input
          id="state"
          value={activeProspect.state || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, state: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="wins" className="text-right">
         Wins
        </Label>
        <Input
          id="wins"
          value={activeProspect.wins || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, wins: e.target.value })}
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
          value={activeProspect.losses || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, losses: e.target.value })}
          className="col-span-3" 
          type="number"
          step={1}
          />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="previousYearsStatePlacement" className="text-right">
         Previous Year&apos;s State Placement
        </Label>
        <Input
          id="previousYearsStatePlacement"
          value={activeProspect.previousYearsStatePlacement || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, previousYearsStatePlacement: e.target.value })}
          className="col-span-3" 
          type="number"
          step={1}
          />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="weightClass" className="text-right">
         Weight Class
        </Label>
        <Input
          id="weightClass"
          value={activeProspect.weightClass || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, weightClass: e.target.value })}
          className="col-span-3" />
      </div>
        <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">
         Notes
        </Label>
        <Input
          id="notes"
          value={activeProspect.notes || ''}
          onChange={(e) => setActiveProspect({ ...activeProspect, notes: e.target.value })}
          className="col-span-3" 
          type="number"
          step={1}
          />
      </div>
      </div>
    <DialogFooter>
      <Button onClick={() => activeProspect.primaryKey ? handleEditProspect(activeProspect) : handleAddProspect(activeProspect)}>{activeProspect.primaryKey ? "Edit Prospect" : "Update Recruit"}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export function EnhancedWrestlerSpreadsheetComponent({athletes}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchColumn, setSearchColumn] = React.useState('name')

  const [tableData, setTableData] = React.useState(athletes);
  const [addingProspect, setAddingProspect] = React.useState(false);
  const [editingProspect, setEditingProspect] = React.useState(false);
  const [activeProspect, setActiveProspect] = React.useState({});
  const [showRecruitModal, setShowRecruitModal] = React.useState(false);

  const handleEditClick = (row) => {
    setActiveProspect(row.original); 
    setEditingProspect(true)
  }

  const handleAddRecruitClick = (row) => {
    // update the status property on athletes table to "prospect"

    // show a modal that has properties that prospects don't have but recruits do:
    // visit date
    // priority
    // projected weight
    setActiveProspect(row.original)
    setShowRecruitModal(true);
  }

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
      cell: ({ row }) => <div>{(((row.getValue('wins') / ((row.getValue('losses') + row.getValue('wins'))))) * 100).toFixed(2)}%</div>,
    }, 
    {
      accessorKey: 'edit',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost">Edit
          </Button>)
        );
      },
      cell: ({ row }) => <div><Button onClick={() => handleEditClick(row)}>Edit</Button></div>,
      enableSorting: false,
      enableColumnFilter: false,
    }, 
    {
      accessorKey: 'addAsRecruit',
      header: ({ column }) => {
        return (
          (<Button
            variant="ghost">Add as Recruit
          </Button>)
        );
      },
      cell: ({ row }) => <div><Button onClick={() => handleAddRecruitClick(row)}>Add as Recruit</Button></div>,
      enableSorting: false,
      enableColumnFilter: false,
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
    pagination: false
  })

  const handleAddProspect = (newProspect) => {
    setTableData((prev) => [...prev, newProspect]); 
    setAddingProspect(false);
  }

  const handleEditProspect = (updatedProspect) => {
    setTableData((prev) => [...prev.filter(i => i.primaryKey !== updatedProspect.primaryKey), updatedProspect]); 
    setEditingProspect(false);
    setActiveProspect({})
  }

  const handleAddProspectClick = () => {
    setActiveProspect({});
    setAddingProspect(true)
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
      <ProspectForm open={addingProspect} onOpenChange={setAddingProspect} activeProspect={activeProspect} setActiveProspect={setActiveProspect} onSubmit={handleAddProspect}/>
      <ProspectForm open={editingProspect} onOpenChange={setEditingProspect} activeProspect={activeProspect} setActiveProspect={setActiveProspect} onSubmit={handleEditProspect}/>
      <RecruitForm open={showRecruitModal} onOpenChange={setShowRecruitModal} activeProspect={activeProspect} onSubmit={() => {}}/>
    </div>)
  );
}