import { useState } from 'react'
import { Button, Badge, Input, Modal, Card, Table, Avatar } from '../components'

interface Row {
  id: number
  name: string
  status: string
}

const sampleData: Row[] = [
  { id: 1, name: 'Engineering', status: 'Active' },
  { id: 2, name: 'HR', status: 'Active' },
]

export function ComponentDemo() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-8 space-y-8 font-sans">
      <section className="space-x-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
      </section>

      <section className="space-x-2">
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="danger">Rejected</Badge>
        <Badge variant="info">Info</Badge>
      </section>

      <section className="max-w-sm space-y-3">
        <Input label="Email" placeholder="you@istrac.local" />
        <Input label="Password" type="password" error="Password is too short" />
      </section>

      <section className="flex gap-4">
        <Card variant="default">Default card</Card>
        <Card variant="bordered">Bordered card</Card>
      </section>

      <section>
        <Table columns={[{ key: 'name', header: 'Department' }, { key: 'status', header: 'Status' }]} data={sampleData} variant="striped" />
      </section>

      <section className="space-x-2 flex items-center">
        <Avatar name="Ayan Sharma" />
        <Avatar name="Jane Doe" shape="square" size="lg" />
      </section>

      <section>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Demo Modal">
          <p className="text-slate-500">Modal content goes here.</p>
        </Modal>
      </section>
    </div>
  )
}