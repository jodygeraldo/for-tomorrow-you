import radixSvg from '~/radix.svg'

export type IconIdType = 'check' | 'cross'

interface Props {
  id: IconIdType
}

export default function Icon({
  id,
  ...props
}: Props & React.HTMLAttributes<SVGElement>) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <use href={`${radixSvg}#${id}`} />
    </svg>
  )
}
