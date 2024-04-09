"use client"

import BackButton from "../components/layout/back-button"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <html>
      <body>
        <main className="container relative flex h-screen w-screen flex-col items-center justify-center">
          <div className="container absolute top-8">
            <BackButton />
          </div>
          <h1 className="text-5xl font-black md:text-7xl">OOPS!</h1>
          <p className="text-sm md:text-lg">Something went wrong</p>
          {error.digest ? (
            <p className="md:text-md mt-5 text-xs">digest: {error.digest}</p>
          ) : null}
        </main>
      </body>
    </html>
  )
}
