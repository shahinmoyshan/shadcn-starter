import * as React from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import {
  useUsers,
  useCreateUsers,
  useUpdateUsers,
  useDeleteUsers,
} from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Bread from "@/components/bread";
import { headline } from "@/lib/utils";

import { UserFormData } from "@/types/api";
import type { Row } from "@tanstack/react-table";

// Type definitions for component props
interface PrivilegesBoxProps {
  formData: UserFormData;
  handleChange: (field: string, value: string | string[]) => void;
}

interface FormFieldsProps {
  formData: UserFormData;
  isEdit: boolean;
  handleChange: (field: string, value: string | string[]) => void;
  formErrors: Record<string, string[]>;
}

interface NameCellProps {
  row: Row<User>;
  onEdit: (user: User) => void;
}

interface EmailCellProps {
  email: string;
}

interface PrivilegesCellProps {
  privileges: string[];
}

interface ActionsCellProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  can: { edit: boolean; delete: boolean };
}

interface ColumnsCallbackParams {
  handleEdit: (user: User) => void;
  handleDelete: (id: number) => void;
  can: { edit: boolean; delete: boolean };
}

// Privileges Box Component
const PrivilegesBox = React.memo<PrivilegesBoxProps>(
  ({ formData, handleChange }) => {
    const handlePrivilegeToggle = (privilegeKey: string) => {
      const currentPrivileges = formData.privileges || [];
      const newPrivileges = currentPrivileges.includes(privilegeKey)
        ? currentPrivileges.filter((p: string) => p !== privilegeKey)
        : [...currentPrivileges, privilegeKey];
      handleChange("privileges", newPrivileges);
    };

    const handleGroupToggle = (groupKey: string) => {
      const groupPermissions = Object.keys(CONFIG.privileges[groupKey] || {});
      const currentPrivileges = formData.privileges || [];
      const allSelected = groupPermissions.every((p) =>
        currentPrivileges.includes(p)
      );

      const newPrivileges = allSelected
        ? currentPrivileges.filter((p: string) => !groupPermissions.includes(p))
        : [...new Set([...currentPrivileges, ...groupPermissions])];
      handleChange("privileges", newPrivileges);
    };

    return (
      <div className="space-y-4">
        <Label className="block mb-2">Privileges</Label>
        <div className="space-y-3">
          {Object.entries(CONFIG.privileges).map(([groupKey, permissions]) => {
            const groupPermissions = Object.keys(permissions);
            const currentPrivileges = formData.privileges || [];
            const allSelected = groupPermissions.every((p) =>
              currentPrivileges.includes(p)
            );
            const someSelected =
              groupPermissions.some((p) => currentPrivileges.includes(p)) &&
              !allSelected;

            return (
              <div
                key={groupKey}
                className="rounded-lg border bg-card text-card-foreground shadow-xs"
              >
                <div className="p-3 pb-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`group-${groupKey}`}
                      checked={allSelected}
                      onCheckedChange={() => handleGroupToggle(groupKey)}
                      className={
                        someSelected
                          ? "data-[state=checked]:bg-muted-foreground"
                          : ""
                      }
                    />
                    <Label
                      htmlFor={`group-${groupKey}`}
                      className="text-sm font-semibold cursor-pointer"
                    >
                      {headline(groupKey)}
                    </Label>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-0">
                  <div className="space-y-3 pl-5">
                    {Object.entries(permissions).map(
                      ([permissionKey, permissionLabel]) => (
                        <div
                          key={permissionKey}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={permissionKey}
                            checked={(formData.privileges || []).includes(
                              permissionKey
                            )}
                            onCheckedChange={() =>
                              handlePrivilegeToggle(permissionKey)
                            }
                          />
                          <Label
                            htmlFor={permissionKey}
                            className="text-[0.81rem] font-normal cursor-pointer"
                          >
                            {permissionLabel}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

const privilegeLabel = (key: string): string => {
  for (const group of Object.values(CONFIG.privileges)) {
    if (group[key]) {
      return group[key];
    }
  }
  return key;
};

// Memoized form fields component
const FormFields = React.memo<FormFieldsProps>(
  ({ formData, isEdit, handleChange, formErrors }) => (
    <div className="space-y-4 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="block mb-2">
            First Name
          </Label>
          <Input
            id="name"
            value={formData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="Enter first name"
            maxLength={100}
          />
          {formErrors.first_name && (
            <p className="text-xs text-destructive">
              {formErrors.first_name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="block mb-2">
            Last Name
          </Label>
          <Input
            id="name"
            value={formData.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="Enter last name"
            maxLength={100}
          />
          {formErrors.last_name && (
            <p className="text-xs text-destructive">
              {formErrors.last_name[0]}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username" className="block mb-2">
          Username <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="Enter username"
          maxLength={100}
          required
        />
        {formErrors.username && (
          <p className="text-xs text-destructive">{formErrors.username[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="block mb-2">
          Email <sup className="text-destructive">*</sup>
        </Label>
        <Input
          id="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email"
          maxLength={100}
          required
        />
        {formErrors.email && (
          <p className="text-xs text-destructive">{formErrors.email[0]}</p>
        )}
      </div>
      <div>
        {isEdit && (
          <h2 className="text-base font-medium mb-2 ">Change Password</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="block mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              maxLength={100}
            />
            {formErrors.password && (
              <p className="text-xs text-destructive">
                {formErrors.password[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="block mb-2">
              Confirm Password
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) =>
                handleChange("password_confirmation", e.target.value)
              }
              placeholder="Enter confirm password"
              maxLength={100}
            />
          </div>
        </div>
        {isEdit && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Leave blank to keep current password
          </p>
        )}
      </div>
      <PrivilegesBox formData={formData} handleChange={handleChange} />
    </div>
  )
);

// Memoized table cell components
const NameCell = React.memo<NameCellProps>(({ row, onEdit }) => (
  <Button
    variant="link"
    onClick={() => onEdit(row.original)}
    className="text-foreground w-fit px-0 text-left"
  >
    <img
      src={row.original.avatar_url || undefined}
      alt={row.original.display_name}
      className="inline-block w-6 h-6 rounded-full"
    />
    {row.original.display_name}
  </Button>
));

const EmailCell = React.memo<EmailCellProps>(({ email }) => (
  <Badge variant="secondary">{email}</Badge>
));

const PrivilegesCell = React.memo<PrivilegesCellProps>(({ privileges }) => {
  const count = privileges.length;
  const permissions = privileges.slice(0, 3).map((per: string) => (
    <Badge key={per} variant="outline" className="text-muted-foreground">
      {privilegeLabel(per)}
    </Badge>
  ));
  return (
    <div className="flex flex-wrap gap-1.5">
      {permissions}{" "}
      {count > 3 && (
        <Badge variant="outline" className="text-muted-foreground">
          +{` ${count - 3}`}
        </Badge>
      )}
    </div>
  );
});

const ActionsCell = React.memo<ActionsCellProps>(
  ({ user, onEdit, onDelete, can }) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {can.edit && (
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Pencil className="mr-1 size-4" />
              Edit
            </DropdownMenuItem>
          )}
          {can.edit && can.delete && <DropdownMenuSeparator />}
          {can.delete && (
            <DropdownMenuItem
              onClick={() => onDelete(user.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-1 size-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
);

export default () =>
  Bread({
    config: {
      title: "Users",
      name: "User",
      description: "Admin users who can access the system",
      defaultForm: {
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        privileges: [],
      },
      permissions: {
        browse: "users.browse",
        create: "users.create",
        delete: "users.delete",
        edit: "users.edit",
      },
      recordCallback: (user) => ({
        first_name: (user as unknown as User).first_name || "",
        last_name: (user as unknown as User).last_name || "",
        username: (user as unknown as User).username || "",
        email: (user as unknown as User).email || "",
        password: "",
        privileges: (user as unknown as User).privileges || [],
      }),
      submitCallback: (formData) => formData,
    },
    columnsCallback: (({
      handleEdit,
      handleDelete,
      can,
    }: ColumnsCallbackParams) => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: { row: Row<User> }) => (
          <NameCell
            row={row}
            onEdit={handleEdit as unknown as (user: User) => void}
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }: { row: Row<User> }) => (
          <EmailCell email={row.original.email} />
        ),
      },
      {
        accessorKey: "privileges",
        header: "Privileges",
        cell: ({ row }: { row: Row<User> }) => (
          <PrivilegesCell privileges={row.original.privileges || []} />
        ),
      },
      {
        accessorKey: "joined_at",
        header: "Joined At",
        cell: ({ row }: { row: Row<User> }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.joined_at}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }: { row: Row<User> }) =>
          (can.edit || can.delete) && (
            <ActionsCell
              user={row.original}
              onEdit={handleEdit as unknown as (user: User) => void}
              onDelete={handleDelete}
              can={can}
            />
          ),
      },
    ]) as any,
    FormFields: FormFields as unknown as React.ComponentType<{
      formData: Record<string, unknown>;
      formErrors: Record<string, string[]>;
      isEdit: boolean;
      handleChange: (field: string, value: unknown) => void;
    }>,
    fetchMutation: useUsers as any,
    createMutation: useCreateUsers() as any,
    updateMutation: useUpdateUsers() as any,
    deleteMutation: useDeleteUsers() as any,
  });
