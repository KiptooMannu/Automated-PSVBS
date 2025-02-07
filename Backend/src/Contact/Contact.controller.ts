import { Context } from "hono";
import { createContactService, getContactsService, resolveContactService } from "./contact.service";

// Create a new contact message
export const createContactController = async (c: Context) => {
  try {
    const contact = await c.req.json();
    const result = await createContactService(contact);
    return c.json({ message: result }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Get all contact messages
export const getContactsController = async (c: Context) => {
  try {
    const contacts = await getContactsService();
    return c.json(contacts, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Mark a contact message as resolved
export const resolveContactController = async (c: Context) => {
  try {
    const contact_id = parseInt(c.req.param("id"));
    if (isNaN(contact_id)) return c.text("Invalid ID", 400);
    const result = await resolveContactService(contact_id);
    return c.json({ message: result }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
