interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="container flex-1 items-start sm:grid sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {children}
    </div>
  )
}
