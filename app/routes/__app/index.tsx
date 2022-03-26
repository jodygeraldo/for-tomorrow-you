import ButtonGroup from '~/components/ButtonGroup'
import Card from '~/components/Card'

export default function Index() {
  return (
    <Card>
      <div className="flex flex-col gap-2 min-w-fit">
        <ButtonGroup />
        <p className="text-gray-11 text-sm self-end">END DATE</p>
      </div>
    </Card>
  )
}
