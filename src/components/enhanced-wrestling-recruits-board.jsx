'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
          <RecruitCard key={recruit.id} recruit={recruit} />
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
    id: recruit.name,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleArchive = () => {
    onArchive(recruit.id)
    setIsDialogOpen(false)
  }

  return (<>
    <Card
      className="mb-2 cursor-move"
      onClick={() => setIsDialogOpen(true)}
      ref={setNodeRef} style={style} {...listeners} {...attributes}
      >
      <CardContent className="p-2">
        <h4 className="font-semibold">{recruit.name}</h4>
        <p className="text-sm">Weight: {recruit.projectedWeight}</p>
        <p className="text-sm">Priority: {recruit.priority}</p>
      </CardContent>
    </Card>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{recruit.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <h5 className="font-semibold">Projected Weight:</h5>
            <p>{recruit.projectedWeight}</p>
          </div>
          <div>
            <h5 className="font-semibold">Priority:</h5>
            <p>{recruit.priority}</p>
          </div>
          <div>
            <h5 className="font-semibold">High School Record:</h5>
            <p>{recruit.highSchoolRecord}</p>
          </div>
          <div>
            <h5 className="font-semibold">State Placements:</h5>
            <p>{recruit.statePlacements}</p>
          </div>
          <div>
            <h5 className="font-semibold">Other Notable Placements:</h5>
            <p>{recruit.otherPlacements}</p>
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

export function EnhancedWrestlingRecruitsBoard() {
  const [recruits, setRecruits] = useState([])
  const [activeRecruit, setActiveRecruit] = useState(null)
  const [isAddRecruitOpen, setIsAddRecruitOpen] = useState(false)
  const [newRecruit, setNewRecruit] = useState({})
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [user, setUser] = useState(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  useEffect(() => {
    const storedRecruits = localStorage.getItem('recruits')
    if (storedRecruits) {
      setRecruits(JSON.parse(storedRecruits))
    }
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('recruits', JSON.stringify(recruits))
  }, [recruits])

  const handleDragStart = (recruit) => {
    const activeRecruit = recruits.find(r => r.id === recruit.active.id)
    setActiveRecruit(activeRecruit);
    console.log('drag start', recruit)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!activeRecruit.id.includes(over.id)) {
      console.log('setting new recruits')
      setRecruits((recruits) => {
        
        const updatedRecruits = [ ...recruits.filter(r => r.id !== activeRecruit.id), {...activeRecruit, status: over.id }]
        console.log(updatedRecruits)
        return updatedRecruits
      })
    }

    setActiveRecruit(null)
  }

  const handleAddRecruit = () => {
    if (newRecruit.name && newRecruit.projectedWeight && newRecruit.priority) {
      setRecruits([...recruits, {
        ...newRecruit,
        id: newRecruit.name,
        status: 'Prospect'
      }])
      setIsAddRecruitOpen(false)
      setNewRecruit({})
    }
  }

  const handleLogin = () => {
    // In a real application, you would validate credentials against a backend
    if (loginEmail === 'admin@example.com' && loginPassword === 'password') {
      const user = { email: loginEmail, password: loginPassword }
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
      setIsLoginOpen(false)
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const handleArchive = (id) => {
    setRecruits(recruits.map(recruit => 
      recruit.id === id ? { ...recruit, status: 'Archived' } : recruit))
  }

  const filteredRecruits = recruits
    .filter((recruit) => {
      if (filterStatus === 'All') return true
      if (filterStatus === 'Active') return recruit.status !== 'Archived'
      return recruit.status === 'Archived'
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

  const columns = ['Prospect', 'Contacted', 'Applied', 'Visited', 'Committed']

  if (!user) {
    return (
      (<div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Wrestling Recruits Board</h1>
            <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleLogin}>Login</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>)
    );
  }

  return (
    (<DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} onDragStart={handleDragStart}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Wrestling Recruits Board</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddRecruitOpen(true)}>Add Recruit</Button>
            <Link href="/team-roster">
              <Button variant="outline">View Team Roster</Button>
            </Link>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
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
                      key={recruit.id}
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
                <p className="text-sm">Weight: {activeRecruit.projectedWeight}</p>
                <p className="text-sm">Priority: {activeRecruit.priority}</p>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
        <Dialog open={isAddRecruitOpen} onOpenChange={setIsAddRecruitOpen}>
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
                  value={newRecruit.name || ''}
                  onChange={(e) => setNewRecruit({ ...newRecruit, name: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                  Projected Weight
                </Label>
                <Input
                  id="weight"
                  value={newRecruit.projectedWeight || ''}
                  onChange={(e) => setNewRecruit({ ...newRecruit, projectedWeight: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newRecruit.priority}
                  onValueChange={(value) => setNewRecruit({ ...newRecruit, priority: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddRecruit}>Add Recruit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>)
  );
}