'use client'

import { useGetMonitorSettings, useUpdateMonitorSettings } from '@/hooks/monitoring'
import { Center, Group, Card as MantineCard, RangeSlider, Slider, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

export default function SamplingSettings() {
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
      <MantineCard withBorder padding='lg' radius='md' miw={500} mih={140} style={{ justifyContent: 'center' }}>
        <Stack gap={'xl'}>
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
