'use client'

import { useGetAllMonitoredWebsites } from '@/hooks/monitoring'
import { SimpleGrid, rem } from '@mantine/core'
import Card from './Card'
import EmptyCard from './EmptyCard'

export default function CardsManager() {
  const { data = [], isLoading } = useGetAllMonitoredWebsites()

  return (
    <div>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {
          data.map((website) => (
            <Card
              key={website.id}
              website={website}
              miw={rem(300)}
              mih={rem(145)}
            />
          ))
        }

        <EmptyCard
          loading={isLoading}
          miw={rem(300)}
          mih={rem(145)}
        />
      </SimpleGrid>
    </div>
  )
}
