import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useAddTicketMutation } from '../../features/tickets/ticketsAPI';
import { RootState } from '../../app/store';
import { FaSpinner } from 'react-icons/fa'; 
import './Contact.scss';

const Contact = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Get the user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user ? user.user_id : null;
  const fullName = user ? `${user.first_name} ${user.last_name}` : '';

  const [createTicket, { isLoading, isError }] = useAddTicketMutation();
  if (isError) {
    toast.error('There was an error submitting your ticket. Please try again.', {
      position: 'top-center',
      autoClose: 3000,
      style: { backgroundColor: 'red', color: 'white' },
    });
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted"); // Debug log to check if form is submitted

    if (!userId) {
      toast.error('You must be logged in to submit a ticket', {
        position: 'top-center',
        autoClose: 3000,
        style: { backgroundColor: 'red', color: 'white' },
      });
      return;
    }

    // Create loading toast and capture the ID
    const toastId = toast.loading('Sending your message...', {
      position: 'top-center',
      autoClose: false, // Don't auto-close the loading toast
      style: { backgroundColor: 'orange', color: 'white' },
    });

    try {
      // Make the API call
      console.log('Creating ticket with data:', { user_id: userId, full_name: fullName, subject, description }); // Debug the ticket data

      const ticketData = await createTicket({
        user_id: userId,
        full_name: fullName,
        subject,
        description,
        status: 'opened',
      }).unwrap();

      console.log('Ticket Data:', ticketData); // Log the response data

      // Update the toast with success message
      toast.update(toastId, {
        render: 'Message sent successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000,
        style: { backgroundColor: 'green', color: 'white' },
      });

      // Reset the form fields
      setSubject('');
      setDescription('');
    } catch (error) {
      console.error('Failed to send message', error);

      // Update the toast with error message
      toast.update(toastId, {
        render: 'Failed to send message. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
        style: { backgroundColor: 'red', color: 'white' },
      });
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-heading">Contact Us</h1> {/* Added the heading */}
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <FaSpinner className="spinner" />
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
};

export default Contact;
