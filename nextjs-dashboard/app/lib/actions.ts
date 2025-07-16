'use server'; // mark all exported functions within the file as Server Actions that can be imported and used in Client and Server components
import {z} from 'zod'; // type validation library
import { revalidatePath} from "next/cache";// clear client-side cache & trigger a new request to the server
import { redirect} from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// use zod
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // set to coerce (change) from a string to a number while also validating its type.
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

// create a new async function that accepts formData
export async function createInvoice(formData: FormData){
    const {customerId, amount,status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount*100; // convert to cents for storage in the database
    // eliminate JavaScript floating-point errors and ensure greater accuracy

    // create a new date with formate "YYYY-MM-DD" for invoice's creation date
    const date = new Date().toISOString().split('T')[0];
    // create an SQL query to insert a new invoice into your database and pass in the variables
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date});
    `;

    revalidatePath('/dashboard/invoices'); // revalidate the path and fresh data will be fetched from the server
    redirect('/dashboard/invoices');// redirect user back to the invoices page

    // test it out
    // console.log(rawFormData);

    // Validate data from your form aligns with the expected types in your database
    // console.log(typeof rawFormData.amount);// returns 'string' but we want a number

    //use entries method with JavaScript's Object.fromEntries to convert FormData to a plain object if too many fields are present
}

export async function updateInvoice(id: string, formData: FormData){
    const {customerId, amount, status} = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount*100;
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id};
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string){
    await sql`
        DELETE FROM invoices where id = ${id}`;
    revalidatePath('/dashboard/invoices');//trigger a new server request to rerender the table with fresh data
    // no need to call redirect since the action is called in the path
}