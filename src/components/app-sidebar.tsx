"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronsUpDown, Home, Layers, Users, BarChart, User } from 'lucide-react'

import { AddEventModal } from "@/components/add-event-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const teams = [
  { id: 1, name: "Tennis", logo: "T" },
  { id: 2, name: "Soccer", logo: "S" },
  { id: 3, name: "Basketball", logo: "B" },
  { id: 4, name: "Sprint", logo: "S" },
  { id: 5, name: "Swimming", logo: "S" },
]

const navigationItems = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Teams", icon: Layers, href: "/teams" },
  { name: "Athletes", icon: Users, href: "/athletes" },
  { name: "Profile", icon: User, href: "/profile" },
]

export function CustomizableSidebar() {
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0])

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{selectedTeam.logo}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTeam.name}</span>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                alignOffset={-5}
                className="w-[--radix-dropdown-menu-trigger-width]"
                forceMount
              >
                <DropdownMenuLabel>Switch Event</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onSelect={() => setSelectedTeam(team)}
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarFallback>{team.logo}</AvatarFallback>
                    </Avatar>
                    {team.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Navigation</div>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton className="px-4 font-semibold">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarMenu>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Admin</div>
          <SidebarMenuItem>
            <AddEventModal />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <AddStudentModal />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/result" passHref legacyBehavior>
              <SidebarMenuButton className="px-4 font-semibold">
                <BarChart className="mr-2 h-4 w-4" />
                Manage Results
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

