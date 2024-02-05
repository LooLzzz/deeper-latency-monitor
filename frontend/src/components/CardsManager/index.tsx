import { SimpleGrid } from '@mantine/core'
import Card from './Card'


export default function CardsManager() {
  return (
    <SimpleGrid cols={2}>
      <Card />
      <Card />
      <Card />
    </SimpleGrid>
  )
}
