'use client'

import { useGetAllMonitoredWebsites, useGetLatestWebsiteHistory } from '@/hooks/monitoring'
import { SimpleGrid } from '@mantine/core'
import Card from './Card'
import EmptyCard from './EmptyCard'

export default function CardsManager() {
  const { data = [] } = useGetAllMonitoredWebsites()

  return (
    <div>
      <SimpleGrid cols={3}>
        {data.map((website) => (
          <Card key={website.id} website={website} />
        ))}

        <EmptyCard />
      </SimpleGrid>
    </div>
  )
}
