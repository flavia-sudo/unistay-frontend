import { LayoutDashboard } from "lucide-react";
import { FiUsers } from "react-icons/fi";
import { Building2, Calendar, CreditCard, Toolbox, PenLine } from "lucide-react";
import type React from "react";

export type DrawerData = {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  link: string;
};

export const adminDrawerData: DrawerData[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "dashboard",
  },
  {
    id: "users",
    name: "Users",
    icon: FiUsers,
    link: "users",
  },
  {
    id: "hostels",
    name: "Hostels",
    icon: Building2,
    link: "hostels",
  },
  {
    id: "bookings",
    name: "Bookings",
    icon: Calendar,
    link: "bookings",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    link: "payments",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    icon: Toolbox,
    link: "maintenance",
  },
  {
    id: "review",
    name: "Review",
    icon: PenLine,
    link: "review",
  }
];