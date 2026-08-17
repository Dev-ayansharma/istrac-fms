import { useState } from 'react'

import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Table,
} from '../components'

interface Row {
  id: number
  name: string
  status: string
}

const sampleData: Row[] = [
  {
    id: 1,
    name: 'Engineering',
    status: 'Active',
  },
  {
    id: 2,
    name: 'HR',
    status: 'Active',
  },
]

export function ComponentDemo() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-8 p-8 font-sans">
      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Buttons
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary">
            Primary
          </Button>

          <Button variant="secondary">
            Secondary
          </Button>

          <Button variant="outline">
            Outline
          </Button>

          <Button variant="danger">
            Danger
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Badges
        </h2>

        <div className="flex flex-wrap gap-2">
          <Badge variant="nominal">
            Active
          </Badge>

          <Badge variant="warning">
            Pending
          </Badge>

          <Badge variant="critical">
            Rejected
          </Badge>

          <Badge variant="special">
            Info
          </Badge>

          <Badge variant="neutral">
            Neutral
          </Badge>
        </div>
      </section>

      {/* Inputs */}
      <section className="max-w-sm space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Inputs
        </h2>

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@istrac.local"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          error="Password is too short"
        />
      </section>

      {/* Cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Cards
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card variant="default">
            <p className="text-sm text-text-primary">
              Default card
            </p>
          </Card>

          <Card variant="interactive">
            <p className="text-sm text-text-primary">
              Interactive card
            </p>
          </Card>
        </div>
      </section>

      {/* Table */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Table
        </h2>

        <Card>
          <Table
            columns={[
              {
                key: 'name',
                header: 'Department',
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <Badge variant="nominal">
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            data={sampleData}
          />
        </Card>
      </section>

      {/* Avatar */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Avatars
        </h2>

        <div className="flex items-center gap-4">
          <Avatar name="Ayan Sharma" />

          <Avatar
            name="Jane Doe"
            shape="square"
            size="lg"
          />
        </div>
      </section>

      {/* Modal */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-text-primary">
          Modal
        </h2>

        <Button onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Demo Modal"
        >
          <p className="text-sm text-text-secondary">
            Modal content goes here.
          </p>
        </Modal>
      </section>
    </div>
  )
}