import { NavItem } from "@web/src/types/nav"
import {
  Activity,
  Archive,
  DollarSign,
  HandCoins,
  Mail,
  MailCheck,
  MailWarning,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  ScissorsLineDashed,
  TrendingUp,
  UserRoundCog,
  UserRoundPlus,
  UsersRound,
  Wallet,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"

export const navConfig: NavItem = [
  {
    title: "Family",
    adminOnly: false,
    buyerOnly: true,
    sellerOnly: false,
    items: [
      {
        name: "Family Member",
        href: "/user/family-member",
        icon: <UsersRound />,
        description: "All your beloved family members",
      },
      {
        name: "Add Member",
        href: `/user/family-member/${uuidv4()}`,
        icon: <UserRoundPlus />,
        description: "Add members to Care Bridge.",
      },
    ],
  },
  {
    title: "Request",
    adminOnly: false,
    buyerOnly: true,
    sellerOnly: false,
    items: [
      {
        name: "Active",
        href: "/user/request",
        icon: <Activity />,
        description: "All your active requests.",
      },
      {
        name: "Draft",
        href: "/user/request/draft",
        icon: <ScissorsLineDashed />,
        description: "Requests which are not public.",
      },
      {
        name: "Archived",
        href: "/user/request/archived",
        icon: <Archive />,
        description: "Requests that has been fulfilled.",
      },
    ],
  },
  {
    title: "Request",
    adminOnly: false,
    buyerOnly: false,
    sellerOnly: true,
    items: [
      {
        name: "All Request",
        href: "/user/request",
        icon: <PackageSearch />,
        description: "All available request you can apply to.",
      },
      {
        name: "Applied",
        href: "/user/request/applied",
        icon: <PackageOpen />,
        description: "Requests you have applied to.",
      },
      {
        name: "Accepted",
        href: "/user/request/accepted",
        icon: <PackageCheck />,
        description: "Requests that was accepted.",
      },
    ],
  },
  {
    title: "Message",
    adminOnly: false,
    buyerOnly: false,
    sellerOnly: false,
    items: [
      {
        name: "Inbox",
        href: "/user/message/inbox",
        icon: <Mail />,
        description: "All your messages in one place.",
      },
      {
        name: "archive",
        href: "/user/message/archive",
        icon: <MailCheck />,
        description: "Messages that you have archived.",
      },
      {
        name: "Spam",
        href: "/user/message/spam",
        icon: <MailWarning />,
        description: "Messages marked as spam.",
      },
    ],
  },
  {
    title: "Billing",
    adminOnly: false,
    buyerOnly: false,
    sellerOnly: false,
    items: [
      {
        name: "Dashboard",
        href: "/billing/dashboard",
        icon: <Wallet />,
        description: "View your billing dashboard.",
      },
      {
        name: "Paid",
        href: "/billing/paid",
        icon: <DollarSign />,
        description: "View all paid invoices.",
      },
      {
        name: "Recieved",
        href: "/billing/recieved",
        icon: <HandCoins />,
        description: "View all recieved invoices.",
      },
    ],
  },

  {
    title: "Admin",
    adminOnly: true,
    buyerOnly: false,
    sellerOnly: false,
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: <TrendingUp />,
        description: "View all your data in one place.",
      },
      {
        name: "Document Approval",
        href: "/admin/approval",
        icon: <UserRoundCog />,
        description: "Approve new members's document.",
      },
    ],
  },
]
