import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AddNewContactSchema } from "@/lib/schemas";
import { useContact } from '@/lib/context/ContactProvider';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AddContactDialog() {
  const { handleAddNewContact, loading } = useContact();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddNewContactSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phone: "",
      email:"",
    }
  });

  const onSubmit = async (data) => {
    console.log("Data", data)
    const { error, message } = await handleAddNewContact(data);
    
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
      reset();
    }
  };

  return (
    <Dialog  onOpenChange={() => reset()}>
      <DialogTrigger asChild>
        <Button variant="outline">+ New Contact</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className='space-y-2'>
            <Label>First Name</Label>
            <Input
              {...register("firstname")}
              placeholder='John'
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm">{errors.firstname.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>Last Name</Label>
            <Input
              {...register("lastname")}
              placeholder="Doe"
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm">{errors.lastname.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>Phone</Label>
            <Input
              {...register("phone")}
              placeholder="555-123-4567"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div className='space-y-2'>
              <Label>Email</Label>
              <Input 
                {...register("email")}
                placeholder="@"
              />
               {errors.phone && (
              <p className="text-rose-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Contact"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}