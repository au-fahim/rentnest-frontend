"use client";

import { useDeferredValue, useState } from "react";

import { UserStatusAction } from "@/components/admin/user-status-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters/date";
import type { User } from "@/types/domain";

type AdminUsersTableProps = {
  users: User[];
};

const pageSize = 20;

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filteredUsers = users.filter((user) => {
    const searchable = `${user.name} ${user.email} ${user.role} ${user.isBanned ? "banned" : "active"}`;
    return searchable.toLowerCase().includes(deferredQuery);
  });
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const visibleUsers = filteredUsers.slice(safePageIndex * pageSize, safePageIndex * pageSize + pageSize);

  return (
    <div className="space-y-4">
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPageIndex(0);
        }}
        placeholder="Search users by name, email, role, or status"
        aria-label="Search users"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">User</th>
              <th className="py-3 pr-4 font-medium">Role</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Joined</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </td>
                <td className="py-4 pr-4">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="py-4 pr-4">
                  <Badge variant={user.isBanned ? "destructive" : "success"}>
                    {user.isBanned ? "Banned" : "Active"}
                  </Badge>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                <td className="py-4 pr-4">
                  <UserStatusAction
                    userId={user.id}
                    isBanned={user.isBanned}
                    disabled={user.role === "ADMIN"}
                  />
                </td>
              </tr>
            ))}
            {visibleUsers.length === 0 ? (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                  No users match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {safePageIndex + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((current) => Math.max(current - 1, 0))}
            disabled={safePageIndex === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPageIndex((current) => Math.min(current + 1, pageCount - 1))}
            disabled={safePageIndex >= pageCount - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
