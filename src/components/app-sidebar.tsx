"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronsUpDown, Home, Settings, Users } from 'lucide-react'

import { AddEventModal } from "@/components/add-event-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  SidebarFooter,
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
  { name: "Dashboard", icon: Home, href: "/Dashboard" },
  { name: "Atheletes", icon: Users, href: "/atheletes" },
  { name: "Settings", icon: Settings, href: "/Settings" },
]

export function CustomizableSidebar() {
  const [selectedTeam, setSelectedTeam] = React.useState(teams[0])
  const [user, setUser] = React.useState({
    name: "John Doe",
    email: "jxd123123@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
  })

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
                <SidebarMenuButton as="a">
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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
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
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left text-sm">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/#">
                  <DropdownMenuItem as="a">Log out</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}