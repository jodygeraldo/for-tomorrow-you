export default function LoginContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-3 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-9 sm:text-4xl">
              Sign in
            </h1>
            <h2 className="mt-2 text-2xl leading-6 text-primary-12">
              For Tommorow You
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
