"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TopNav from "./components/topNav";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function SystemAdminDashboard() {
  const organisations = useQuery(api.systemAdmin.sysAdmin.listBusinesses);

  return (
    <div className="w-full mx-auto">
      <TopNav text="System Admin"></TopNav>
      <Card>
        <CardHeader>
          <CardTitle>Existing Organisation</CardTitle>
          <CardDescription>List of all registered organisation</CardDescription>
        </CardHeader>
        <CardContent>
          {organisations ? (
            <Table>
              <TableCaption>A list of all registered Organisation</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-transparent">Logo</TableHead>
                  <TableHead>organisation Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organisations.bizzlist.map((organisation, i) => (
                  <TableRow key={organisation._id} className="p-1">
                    <TableCell className="h-6 w-6 relative overflow-hidden">
                      {/* <Image src={organisations.bizzOwners[i]?.url as string} alt="" fill className="w-full rounded-sm p-1 h-full"/> */}
                    </TableCell>
                    <TableCell className="font-medium">
                      {organisation._id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {organisation.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {organisation.domain}
                    </TableCell>
                    <TableCell className="font-medium">
                      {organisations.bizzOwners[i]?.mail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-center text-neutral-500 animate-pulse">Loading organisation...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
