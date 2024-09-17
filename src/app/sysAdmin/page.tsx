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

export default function SystemAdminDashboard() {
  const businesses = useQuery(api.systemAdmin.sysAdmin.listBusinesses);

  return (
    <div className="w-full mx-auto">
      <TopNav text="System Admin"></TopNav>
      <Card>
        <CardHeader>
          <CardTitle>Existing Businesses</CardTitle>
          <CardDescription>List of all registered businesses</CardDescription>
        </CardHeader>
        <CardContent>
          {businesses ? (
            <Table>
              <TableCaption>A list of all registered businesses</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Business Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.bizzlist.map((business, i) => (
                  <TableRow key={business._id}>
                    <TableCell className="font-medium rounded-md h-10 w-10 bg-neutral-400">
                      <Image src="" alt="" fill className="object-fill w-full h-full"/>
                      {businesses.bizzOwners[i]?.url}
                    </TableCell>
                    <TableCell className="font-medium">
                      {business._id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {business.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {business.domain}
                    </TableCell>
                    <TableCell className="font-medium">
                      {businesses.bizzOwners[i]?.mail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-center text-neutral-500 animate-pulse">Loading businesses...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
