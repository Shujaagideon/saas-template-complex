"use client"

import { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import TopNav from '../../components/topNav';

export default function InviteUser() {
  const { Business } = useParams();
  const createInvitation = useMutation(api.Organisation.organisations.createOrgsUserInvitation);

  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createInvitation({...formData, organisationDomain: Business as unknown as string});
      setFormData({
        email: '',
        role: 'user',
      });
      toast.success('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div>
      <TopNav text="Invite staff" />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  type="email"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select name="role" value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Send Invitation</Button>
        </CardFooter>
      </Card>
    </div>
  );
}