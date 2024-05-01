interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return <div className="container mt-8 flex-1 items-start">{children}</div>
}
