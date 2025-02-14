import db from "../drizzle/db";
import { contactsTable, TIContact, TSContact } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Create a new contact message
export const createContactService = async (contact: TIContact): Promise<string> => {
  await db.insert(contactsTable).values(contact);
  return "Contact message submitted successfully";
};

// Get all contact messages
export const getContactsService = async (): Promise<TSContact[]> => {
  return await db.query.contactsTable.findMany();
};

// Mark a message as resolved
export const resolveContactService = async (contact_id: number): Promise<string> => {
  await db.update(contactsTable)
    .set({ is_resolved: true })
    .where(eq(contactsTable.contact_id, contact_id))
    .execute();
  return "Contact message marked as resolved";
};
