import  {z} from "zod";

const password = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");    
const username = z.string().min(3,"Username must be at least 3 characters long").max(20,"Username must be at most 20 characters long").regex(/^[a-zA-Z0-9_]+$/,"Username can only contain letters, numbers, and underscores.");
export const registerschema = z.object({
    password:password,
    username:username
})
export type RegisterSchema = z.infer<typeof registerschema>;
