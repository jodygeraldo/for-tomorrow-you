export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between bg-gray-3 border-2 border-gray-6 rounded-md px-4 py-2 gap-8">
        <p className="text-gray-12 text-lg">
          Lorem ipsum Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Temporibus earum non voluptas quod. Nihil nobis eaque aperiam labore
          mollitia aliquam in pariatur natus, reprehenderit ratione tempora rem
          laudantium assumenda eum?
        </p>

        {children}
      </div>
    </div>
  )
}
