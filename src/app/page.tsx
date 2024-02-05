import { BenchmarkSettings, CardsManager, SamplingSettings } from '@/components'
import { Center, Group, Stack } from '@mantine/core'

export default function Home() {

  return (
    <Center>
      <Stack>
        <Group>
          <SamplingSettings />
          <BenchmarkSettings />
        </Group>
        <CardsManager />
      </Stack>
    </Center>
  )
}
