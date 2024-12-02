"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditAthleteModal } from "@/components/ui/edit-athlete-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Athlete = {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  active: boolean;
  totalPoints: number;
};

const columns: ColumnDef<Athlete>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "team",
    header: "Team Name",
    cell: ({ row }) => {
      const team = row.getValue("team") as string;
      return (
        <div
          className={`font-medium ${
            team === "red"
              ? "text-red-600"
              : team === "blue"
              ? "text-blue-600"
              : team === "green"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {team.charAt(0).toUpperCase() + team.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "totalPoints",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("totalPoints")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const athlete = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("Edit", athlete)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("Delete", athlete)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [athletes, setAthletes] = React.useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string>("");
  const [editingAthlete, setEditingAthlete] = React.useState<Athlete | null>(null);
  const [deletingAthlete, setDeletingAthlete] = React.useState<Athlete | null>(null);

  // Fetch athletes data from the API
  React.useEffect(() => {
    const fetchAthletes = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const response = await fetch("/api/athletes");
        const data = await response.json();

        if (response.ok) {
          setAthletes(data);
        } else {
          setFetchError(data.error || "Failed to fetch athletes.");
          console.error("Failed to fetch athletes:", data.error);
        }
      } catch (err) {
        setFetchError("An unexpected error occurred while fetching athletes.");
        console.error("Error fetching athletes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  const table = useReactTable({
    data: athletes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Get unique teams from the data for potential filtering in the future
  const teams = React.useMemo(() => {
    const teamSet = new Set<string>();
    athletes.forEach((athlete) => {
      athlete.team && teamSet.add(athlete.team);
    });
    return Array.from(teamSet);
  }, [athletes]);

  const handleEditAthlete = (athlete: Athlete) => {
    setEditingAthlete(athlete);
  };

  const handleSaveAthlete = (updatedAthlete: Athlete) => {
    setAthletes(athletes.map(a => a.id === updatedAthlete.id ? updatedAthlete : a));
    setEditingAthlete(null);
  };

  
  const [formData, setFormData] = React.useState({});
  const handleDeleteAthlete = (athlete: Athlete) => {
    // Set the deleting athlete to trigger the confirmation dialog
    setDeletingAthlete(athlete);
  
    // Update the formData with the athlete's first and last name
    setFormData({
      firstName: athlete.firstName,
      lastName: athlete.lastName,
    });
  };
  
  const confirmDeleteAthlete = async () => {
    if (deletingAthlete) {
      try {
        // Perform the deletion on the server
        const response = await fetch('/api/delete-student', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: deletingAthlete.firstName,
            lastName: deletingAthlete.lastName,
          }),
        });
  
        if (response.ok) {
          // Remove the athlete from the state
          setAthletes((prevAthletes) =>
            prevAthletes.filter((athlete) => athlete.id !== deletingAthlete.id)
          );
  
          // Clear the formData
          setFormData({});
        } else {
          console.error('Failed to delete athlete:', await response.json());
        }
      } catch (error) {
        console.error('Error deleting athlete:', error);
      } finally {
        setDeletingAthlete(null);
      }
    }
  };
  


  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter first names..."
          value={(table.getColumn("firstName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("firstName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) =>
            table.getColumn("team")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team.charAt(0).toUpperCase() + team.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center">Loading athletes...</p>
      ) : fetchError ? (
        <p className="text-red-500 text-center">{fetchError}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === 'actions' ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditAthlete(row.original)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteAthlete(row.original) }>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <EditAthleteModal
        athlete={editingAthlete}
        isOpen={!!editingAthlete}
        onClose={() => setEditingAthlete(null)}
        onSave={handleSaveAthlete}
      />

      <ConfirmDialog
        isOpen={!!deletingAthlete}
        onClose={() => setDeletingAthlete(null)}
        onConfirm={confirmDeleteAthlete}
        title="Delete Athlete?"
        description={`Are you sure you want to delete ${deletingAthlete?.firstName} ${deletingAthlete?.lastName}? This action cannot be undone.`}
      />
    </div>
  );
}

export default function AthletesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Athletes</h1>
      <DataTableDemo />
    </div>
  );
}

