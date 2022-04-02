export default function Card({
  children,
  note,
}: {
  children: React.ReactNode
  note: string
}) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between gap-8 rounded-md border-2 border-gray-6 bg-gray-3 px-4 py-2">
        <p className="text-lg text-gray-12">{note}</p>

        {children}
      </div>
    </div>
  )
}
