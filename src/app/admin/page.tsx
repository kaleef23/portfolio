import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCollection, getCollections } from "./action";
import AdminHeader from "@/components/admin/admin-header";
import DeleteButton from "@/components/admin/delete-button";
import { Timestamp } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const collections = await getCollections();  

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Collections
            </h1>
            <Button asChild>
              <Link href="/admin/new">Add New Collection</Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Poster</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Image Count</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        {collection.posterImageCategory === "video" ? (
                          <video
                            src={collection.posterImageUrl}
                            controls
                            className="rounded object-cover aspect-square"
                            data-ai-hint="collection poster"
                          />
                        ) : (
                          <img
                            src={collection.posterImageUrl}
                            alt={collection.title}
                            className="rounded object-cover aspect-square"
                            data-ai-hint="collection poster"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {collection.title}
                      </TableCell>
                      <TableCell>{collection.images.length}</TableCell>
                      <TableCell>
                        {collection.createdAt
                          ? new Date(
                              collection.createdAt as string
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/edit/${collection.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" asChild>
                              <DeleteButton
                                id={collection.id}
                                action={deleteCollection}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500 py-10"
                    >
                      No collections found. Get started by adding one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
