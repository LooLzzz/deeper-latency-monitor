import { CardsManager, SamplingSettings } from '@/components'
import { Center, Group, Stack } from '@mantine/core'

export default function Home() {
  return (
    <Center>
      <Stack>
        <Group>
          <SamplingSettings />
        </Group>
        <CardsManager />
      </Stack>
    </Center>
  )
}
