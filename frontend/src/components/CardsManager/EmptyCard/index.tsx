import { ActionIcon, Center, Card as MantineCard, rem } from '@mantine/core'
import { IconSquarePlus } from '@tabler/icons-react'

export default function EmptyCard() {
  return (
    <MantineCard withBorder padding='lg' radius='md'>
      <Center h='100%'>
        {/* <IconCopyPlus */}
        <ActionIcon
          size={80}
          color='gray'
          variant='light'
          radius='md'
        >
          <IconSquarePlus
            style={{
              width: rem(40),
              height: rem(40)
            }}
          />
        </ActionIcon>
      </Center>
    </MantineCard>
  )
}
