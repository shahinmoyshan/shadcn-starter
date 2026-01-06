import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth";
import PermissionDenied from "@/components/denied";

// Memoized Bread Drawer Component
const BreadDrawer = React.memo(
  ({
    isOpen,
    onClose,
    record,
    createMutation,
    updateMutation,
    FormFields,
    config,
    cannot,
  }) => {
    const isMobile = useIsMobile();
    const [formData, setFormData] = React.useState(config.defaultForm);
    const isSubmitting =
      (createMutation && createMutation.isPending) ||
      (updateMutation && updateMutation.isPending);

    React.useEffect(() => {
      if (isOpen) {
        if (record) {
          setFormData(config.recordCallback(record));
        } else {
          setFormData({ ...config.defaultForm });
        }
      }
    }, [record, isOpen]);

    const handleChange = React.useCallback((field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = React.useCallback(
      async (e) => {
        e.preventDefault();

        try {
          // Combine country code and phone number
          const submitData = config.submitCallback(formData);

          if (record?.id) {
            await updateMutation.mutateAsync({
              id: record.id,
              data: submitData,
            });
          } else {
            await createMutation.mutateAsync(submitData);
          }
          onClose();
        } catch (error) {
          // Error handling is done in the mutation hooks
          console.error("Form submission error:", error);
        }
      },
      [formData, record?.id, onClose, createMutation, updateMutation, config]
    );

    // permission create and edit check
    if (
      (!record &&
        config.permissions &&
        config.permissions.create &&
        cannot(config.permissions.create)) ||
      (record &&
        config.permissions &&
        config.permissions.edit &&
        cannot(config.permissions.edit))
    ) {
      return; // return nothing if no permission
    }

    const formContent = (
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="overflow-y-auto px-4 flex-1">
          <FormFields
            formData={formData}
            isEdit={!!record}
            handleChange={handleChange}
          />
        </div>

        <div className="px-4 py-4 border-t mt-auto shrink-0">
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : record ? "Update" : "Create"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    );

    return (
      <Drawer
        open={isOpen}
        direction={isMobile ? "bottom" : "right"}
        onOpenChange={onClose}
      >
        <DrawerContent className="data-[vaul-drawer-direction=right]:md:max-w-md">
          <DrawerHeader>
            <DrawerTitle>
              {record ? `Edit ${config.name}` : `Create ${config.name}`}
            </DrawerTitle>
            <DrawerDescription>
              {record
                ? `Update the ${config.name.toLowerCase()} details below`
                : `Add a new ${config.name.toLowerCase()} using the form below`}
            </DrawerDescription>
          </DrawerHeader>
          <div className="h-full flex flex-col gap-4 overflow-y-auto">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default function Bread({
  config,
  columnsCallback,
  FormFields,
  fetchMutation,
  deleteMutation,
  createMutation,
  updateMutation,
}) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [recordToDelete, setRecordToDelete] = React.useState(null);

  const { can, cannot } = useAuth();

  // Debounce search query with use-debounce library
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Build query params
  const queryParams = React.useMemo(() => {
    const params = {
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
    };

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }

    return params;
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearchQuery]);

  // Use TanStack Query for data fetching
  const { data: response, isLoading, error } = fetchMutation(queryParams);

  // permission check
  if (
    config.permissions &&
    config.permissions.browse &&
    cannot(config.permissions.browse)
  ) {
    return <PermissionDenied />;
  }

  // Extract data from response
  const data = response?.data || [];
  const totalPages = response?.pages || 0;
  const totalItems = response?.total || 0;

  const handleDelete = React.useCallback((id) => {
    setRecordToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!recordToDelete) return;

    try {
      await deleteMutation.mutateAsync(recordToDelete);
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Delete error:", error);
    } finally {
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  }, [recordToDelete, deleteMutation]);

  const handleEdit = React.useCallback((record) => {
    setSelectedRecord(record);
    setDrawerOpen(true);
  }, []);

  const handleCreate = React.useCallback(() => {
    setSelectedRecord(null);
    setDrawerOpen(true);
  }, []);

  const handleSearchChange = React.useCallback((e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePageSizeChange = React.useCallback((value) => {
    setPagination({
      pageIndex: 0,
      pageSize: Number(value),
    });
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setDrawerOpen(false);
    setSelectedRecord(null);
  }, []);

  // Memoize columns with stable references
  const columns = React.useMemo(
    () =>
      columnsCallback({
        handleEdit,
        handleDelete,
        handleCreate,
        can: {
          delete: !config.permissions?.delete || can(config.permissions.delete),
          edit: !config.permissions?.edit || can(config.permissions.edit),
          create: !config.permissions?.create || can(config.permissions.create),
        },
      }),
    [handleEdit, handleDelete, handleCreate, columnsCallback, can]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      pagination,
    },
  });

  const canGoPrevious = pagination.pageIndex > 0;
  const canGoNext = pagination.pageIndex < totalPages - 1;
  const startItem =
    data.length > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endItem = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    totalItems
  );

  return (
    <>
      <div className="px-4 lg:px-6 space-y-4">
        {(config.title || config.description) && (
          <div>
            {config.title && (
              <h1 className="text-2xl font-bold tracking-tight">
                {config.title}
              </h1>
            )}
            {config.description && (
              <p className="text-muted-foreground">{config.description}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 justify-between">
          {!config.disabled?.includes("search") && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${config.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          )}
          {!config.disabled?.includes("add_record") &&
            (!config.permissions ||
              !config.permissions.create ||
              can(config.permissions.create)) && (
              <Button onClick={handleCreate}>
                <Plus className="size-4" />
                {config.translations?.add_record || `Add ${config.name}`}
              </Button>
            )}
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/85 hover:bg-muted/85"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader2 className="mx-auto animate-spin opacity-50" />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center opacity-75"
                  >
                    No {config.name.toLowerCase()} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="hidden lg:block text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalItems}{" "}
            {config.name.toLowerCase()}s
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="hidden lg:flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-17.5">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center text-sm font-medium min-w-25">
              Page {pagination.pageIndex + 1} of {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }
                disabled={!canGoPrevious}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex - 1,
                  }))
                }
                disabled={!canGoPrevious}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: prev.pageIndex + 1,
                  }))
                }
                disabled={!canGoNext}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: totalPages - 1,
                  }))
                }
                disabled={!canGoNext}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {FormFields && (createMutation || updateMutation) && (
        <BreadDrawer
          isOpen={drawerOpen}
          onClose={handleCloseDrawer}
          record={selectedRecord}
          createMutation={createMutation}
          updateMutation={updateMutation}
          FormFields={FormFields}
          config={config}
          cannot={cannot}
        />
      )}

      {deleteMutation &&
        (!config.permissions ||
          !config.permissions.delete ||
          can(config.permissions.delete)) && (
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {config?.translations?.delete || "Are you absolutely sure?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {config?.translations?.delete_description ||
                    `This action cannot be undone. This will permanently delete the ${config.name.toLowerCase()} and remove it from our servers.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {config?.translations?.delete_no || "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>
                  {config?.translations?.delete_yes || "Yes, Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
    </>
  );
}
