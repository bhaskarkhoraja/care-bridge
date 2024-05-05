interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="container mt-8 flex-1 items-start">{children}</div>
}
