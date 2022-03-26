import { Form, useActionData, useTransition } from 'remix'
import LoginContainer from '~/components/LoginContainer'

export default function LoginPage() {
  const actionData = useActionData() as any
  const transition = useTransition()

  const busy = transition.state === 'submitting'

  if (actionData?.success) {
    return (
      <LoginContainer>
        <div className="mt-6 text-center">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 mx-auto text-green-600"
          >
            <path
              d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="text-gray-11 mt-1">Magic Link has been sent</p>
        </div>
      </LoginContainer>
    )
  }

  return (
    <LoginContainer>
      <Form method="post" className="mt-8">
        <fieldset disabled={busy} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Your email address"
                className="appearance-none block w-full px-3 py-2 border border-gray-7 rounded-md shadow-sm placeholder-gray-11 focus:outline-none focus:ring-primary-8 focus:border-primary-8 sm:text-sm bg-gray-2 text-gray-12 disabled:bg-gray-7 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-12 bg-primary-9 hover:bg-primary-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-7 focus:ring-offset-gray-3 disabled:bg-primary-7 disabled:cursor-not-allowed disabled:text-gray-11"
            >
              {busy ? 'Sending magic link...' : 'Get a magic link'}
            </button>
          </div>
        </fieldset>
      </Form>
    </LoginContainer>
  )
}
