'use client';
import React, { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners, useDroppable, useDraggable } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Archive } from 'lucide-react'
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Column = ({ title, recruits }) => {
  const {isOver, setNodeRef} = useDroppable({
    id: title,
  });
  const style = {
    color: isOver ? 'green' : undefined,
    borderStyle: isOver ? 'dashed': 'solid',
  };
  return (
  <Card className="w-72 bg-gray-100" ref={setNodeRef} style={style}>
    <CardContent className="p-2">
      <h3 className="font-bold mb-2">{title}</h3>
      <SortableContext items={recruits}>
        {recruits.map((recruit) => (
          <RecruitCard key={recruit.primaryKey} recruit={recruit} />
        ))}
      </SortableContext>
    </CardContent>
  </Card>
)
}

const RecruitCard = ({ recruit, onArchive }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [notes, setNotes] = useState(recruit.notes)

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: recruit.primaryKey,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleArchive = () => {
    onArchive(recruit.primaryKey)
    setIsDialogOpen(false)
  }

  return (<>
    <Card
      className="mb-2 cursor-move"
      ref={setNodeRef} style={style} {...listeners} {...attributes}
      >
      <CardContent className="p-2">
        <h4 className="font-semibold">{recruit.name}</h4>
        <p className="text-sm">Weight: {recruit.projectedWeightClass}</p>
        <p className="text-sm">Priority: {recruit.priority}</p>
        
      </CardContent>
    </Card>
    <Button onClick={() => setIsDialogOpen(true)}>View</Button>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{recruit.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h5 className="font-semibold">Projected Weight:</h5>
            <p>{recruit.projectedWeightClass}</p>
          </div>
          <div>
            <h5 className="font-semibold">Priority:</h5>
            <p>{recruit.priority}</p>
          </div>
          <div>
            <h5 className="font-semibold">High School Record:</h5>
            <p>{recruit.wins}-{recruit.losses}</p>
          </div>
          <div>
            <h5 className="font-semibold">State Placements:</h5>
            <p>{recruit.previousYearsStatePlacement}</p>
          </div>
          <div>
            <h5 className="font-semibold">Notes:</h5>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleArchive} variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>);
}

export function EnhancedWrestlingRecruitsBoard({initialRecruits}) {
  const [recruits, setRecruits] = useState(initialRecruits ?? [])
  const [activeRecruit, setActiveRecruit] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  const handleDragStart = (recruit) => {
    const activeRecruit = recruits.find(r => r.primaryKey === recruit.active.id)
    setActiveRecruit(activeRecruit);
    console.log('drag start', recruit)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!activeRecruit.status.includes(over.id)) {
      console.log('setting new recruits')
      

      const { error } = await supabase
    .from('athletes')
    .update({status: over.id})
    .eq('primary_key', activeRecruit.primaryKey)

    if (error) alert (error)

      setRecruits((recruits) => {
        
        const updatedRecruits = [...recruits.filter(r => r.primaryKey !== activeRecruit.primaryKey), {...activeRecruit, status: over.id }]
        console.log(updatedRecruits)
        return updatedRecruits
      })
    }

    setActiveRecruit(null)
  }

  const handleArchive = (primaryKey) => {
    setRecruits(recruits.map(recruit => 
      recruit.primaryKey === primaryKey ? { ...recruit, status: 'archived' } : recruit))
  }

  const filteredRecruits = recruits
    .filter((recruit) => {
      if (filterStatus === 'All') return true
      if (filterStatus === 'Active') return recruit.status !== 'archived'
      return recruit.status === 'archived'
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name?.localeCompare(b.name);
      if (sortBy === 'weight') return parseInt(a.projectedWeight) - parseInt(b.projectedWeight);
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return 0
    })

    console.log(filteredRecruits)

  const columns = ['prospect', 'contacted', 'applied', 'visited', 'committed']

  return (
    (<DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} onDragStart={handleDragStart}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Wrestling Recruits Board</h1>
        </div>
        <div className="flex gap-4 mb-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 mb-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column}
              title={column}
              recruits={filteredRecruits.filter((r) => r.status === column)}
               />
          ))}
        </div>
        <Card className="w-full bg-gray-100">
          <CardContent className="p-2">
            <h3 className="font-bold mb-2">Archived Recruits</h3>
            <ScrollArea className="h-40">
              <SortableContext items={filteredRecruits.filter((r) => r.status === 'Archived')}>
                {filteredRecruits
                  .filter((r) => r.status === 'Archived')
                  .map((recruit) => (
                    <RecruitCard
                      key={recruit.primaryKey}
                      recruit={recruit}
                      onArchive={handleArchive} />
                  ))}
              </SortableContext>
            </ScrollArea>
          </CardContent>
        </Card>
        <DragOverlay>
          {activeRecruit ? (
            <Card className="w-64">
              <CardContent className="p-2">
                <h4 className="font-semibold">{activeRecruit.name}</h4>
                <p className="text-sm">Weight: {activeRecruit.projectedWeightClass}</p>
                <p className="text-sm">Priority: {activeRecruit.priority}</p>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>)
  );
}