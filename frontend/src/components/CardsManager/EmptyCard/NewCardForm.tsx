import { useCreateMonitoredWebsite } from '@/hooks/monitoring'
import type { MonitoredWebsiteCreate } from '@/types'
import { Button, Group, Input, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'


export default function NewCardForm() {
  const { mutate } = useCreateMonitoredWebsite()
  const form = useForm({
    initialValues: {
      url: '',
      friendlyName: '',
      isActive: true,
    },

    validate: {
      url: (value: string) => {
        if (!value) {
          return 'URL is required'
        }
      },
      friendlyName: (value: string) => {
        if (!value) {
          return 'Friendly name is required'
        }
      },
    },
  })

  const handleSubmit = (values: MonitoredWebsiteCreate) => {
    mutate(values)
    modals.closeAll()
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Input
          placeholder='URL'
          {...form.getInputProps('url')}
        />
        <Input
          placeholder='Friendly Name'
          {...form.getInputProps('friendlyName')}
        />
        <Group justify='flex-end' mt='md'>
          <Button variant='default' onClick={() => modals.closeAll()}>Cancel</Button>
          <Button type='submit'>Submit</Button>
        </Group>
      </Stack>
    </form>
  )
}
