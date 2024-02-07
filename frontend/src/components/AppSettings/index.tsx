'use client'

import { useGetMonitorSettings, useUpdateMonitorSettings } from '@/hooks/monitoring'
import { useAppSettingsStore } from '@/store/zustand'
import { Center, Group, Card as MantineCard, RangeSlider, Select, Slider, Stack, Switch, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'

export default function AppSettings() {
  const { lessAnimations, latencyAggregateType, toggleLessAnimations, setLatencyAggregateType } = useAppSettingsStore()
  const { data: settings, isLoading } = useGetMonitorSettings()
  const { mutate } = useUpdateMonitorSettings()

  const [sliderValue, setSliderValue] = useState(0)
  const [[lowValue, highValue], setRangeSliderValue] = useState([0, 0])

  useEffect(() => {
    if (settings) {
      setSliderValue(settings.pingIntervalSec)
      setRangeSliderValue([settings.lowThresholdMs, settings.highThresholdMs])
    }
  }, [isLoading, settings])

  return (
    <Center w='100%'>
      <MantineCard withBorder padding='lg' radius='md' miw={500} style={{ justifyContent: 'center' }}>
        <Group>
          <Title size={30}>App Settings</Title>
        </Group>

        <Stack gap={'xl'} py='md'>
          <Group wrap='nowrap' gap='xs'>
            <Text size='sm' style={{ whiteSpace: 'nowrap' }}>
              Latency aggregate type
            </Text>
            <Select
              w='100%'
              data={[
                { value: 'latest', label: 'Latest' },
                { value: 'avg', label: 'Average' },
              ]}
              value={latencyAggregateType}
              onChange={(value) => setLatencyAggregateType(value as 'latest' | 'avg')}
              disabled={isLoading}
              placeholder='Select latency aggregate type'
            />
          </Group>

          <Switch
            checked={lessAnimations}
            onChange={toggleLessAnimations}
            label='Use less animations'
            color='red'
            labelPosition='left'
            disabled={isLoading}
          />

          <Group wrap='nowrap' gap='xs'>
            <Text size='sm' style={{ whiteSpace: 'nowrap' }}>
              Ping Interval
            </Text>
            <Slider
              w='100%'
              disabled={isLoading}
              label={v => `${v.toFixed(1)} sec`}
              value={isLoading ? 0 : sliderValue}
              min={0.5}
              max={60}
              step={0.1}
              onChange={setSliderValue}
              onChangeEnd={value => {
                mutate({ pingIntervalSec: value })
              }}
            />
          </Group>

          <Group wrap='nowrap' gap='xs'>
            <Text size='sm' style={{ whiteSpace: 'nowrap' }}>
              Latency Threshold
            </Text>
            <RangeSlider
              inverted
              w='100%'
              disabled={isLoading}
              onChange={setRangeSliderValue}
              onChangeEnd={([low, high]) => {
                mutate({
                  lowThresholdMs: low,
                  highThresholdMs: high,
                })
              }}
              min={1}
              max={200}
              label={value => `${value} ms`}
              value={isLoading ? [0, 200] : [lowValue, highValue] as [number, number]}
            />
          </Group>
        </Stack>
      </MantineCard>
    </Center>
  )
}
