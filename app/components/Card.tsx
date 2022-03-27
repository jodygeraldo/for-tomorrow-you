export default function Card({
  children,
  note,
}: {
  children: React.ReactNode
  note: string
}) {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between bg-gray-3 border-2 border-gray-6 rounded-md px-4 py-2 gap-8">
        <p className="text-gray-12 text-lg">{note}</p>

        {children}
      </div>
    </div>
  )
}
