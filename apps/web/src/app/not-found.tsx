import BackButton from "../components/layout/back-button"

export default async function NotFound() {
  return (
    <main className="container relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="container absolute top-8">
        <BackButton />
      </div>
      <h1 className="text-5xl font-black md:text-7xl">404</h1>
      <p className="text-sm md:text-lg">Page not found</p>
    </main>
  )
}
