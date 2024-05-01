export type NavItem = {
  title: string
  adminOnly: boolean
  buyerOnly: boolean
  items: {
    name: string
    href: string
    icon: JSX.Element
    description: string
  }[]
}[]
