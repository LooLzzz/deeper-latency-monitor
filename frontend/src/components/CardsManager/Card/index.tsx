'use client'

import { useGetLatestWebsiteHistory, useUpdateMonitoredWebsite } from '@/hooks/monitoring'
import type { MonitoredWebsite } from '@/types'
import { Group, Card as MantineCard, Progress, Stack, Switch, Text } from '@mantine/core'
import { IconArrowsExchange, IconCheck, IconCloudNetwork, IconUpload, IconX } from '@tabler/icons-react'
import { useCallback } from 'react'
import TrafficLightIcon from './TrafficLightIcon'

interface CardProps {
  website: MonitoredWebsite
}

export default function Card({
  website: {
    isActive,
    id: websiteId,
    url,
    redThresholdMs,
    greenThresholdMs,
    orangeThresholdMs,
    frequencySec
  }
}: CardProps) {
  const { mutate } = useUpdateMonitoredWebsite()
  const { data: { latencyMs, createdAt } = {}, isLoading } = useGetLatestWebsiteHistory(
    websiteId,
    {
      enabled: isActive,
      refetchInterval: frequencySec * 1000,
    }
  )

  const handleSwitchChange = useCallback(() => {
    mutate({ id: websiteId, isActive: !isActive })
  }, [mutate, isActive])

  if (isLoading) {
    return (
      <MantineCard withBorder padding='lg' radius='md'>
        <Text fz='lg' fw={500} mt='md'>
          Loading...
        </Text>
      </MantineCard>
    )
  }

  return (
    <MantineCard withBorder padding='lg' radius='md'>
      <Stack gap={5}>
        <Group justify='space-between'>
          <Group gap='xs'>
            <Text>
              {url}
            </Text>
            <TrafficLightIcon
              value={latencyMs ?? -1}
              thresholds={{ red: redThresholdMs, orange: orangeThresholdMs, green: greenThresholdMs }}
            />
          </Group>

          <Switch
            checked={isActive}
            size='md'
            onChange={handleSwitchChange}
            // label='Enabled'
            thumbIcon={
              isActive
                ? <IconCheck
                  color='teal'
                  size={16}
                  stroke={2.5}
                />
                : <IconX
                  color='red'
                  size={16}
                  stroke={2.5}
                />
            }
          />
        </Group>

        <Progress value={(23 / 36) * 100} mt={5} />

        <Group>
          <IconUpload
            color='gray'
            size={16}
            stroke={2.5}
          />
          <Text>
            {frequencySec} seconds
          </Text>
        </Group>

        <Group>
          <IconArrowsExchange
            color='gray'
            size={16}
            stroke={2.5}
          />
          <Group mt={5} justify='space-between'>
            <Text>
              {latencyMs ?? 'N/A'} ms
            </Text>
            <Text>
              {(createdAt as Date).toLocaleString()}
            </Text>
          </Group>
        </Group>

        <Group>
          <IconCloudNetwork
            color='gray'
            size={16}
            stroke={2.5}
          />
          <Text>
            {redThresholdMs} ms / {orangeThresholdMs} ms
          </Text>
        </Group>
      </Stack>
    </MantineCard>
  )
}
