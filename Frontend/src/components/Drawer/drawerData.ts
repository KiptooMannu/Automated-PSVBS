import { LayoutDashboard,BarChart, Book, User, Car, CreditCard, Ticket, TicketCheck, LogOut, Menu } from "lucide-react";

export type DrawerData = {
    id: number;
    name: string;
    icon?: undefined | any;
    link: string;
    adminOnly: boolean;
}
// adminOnly false - show to all users
// adminOnly true - show only to admins 
export const drawerData: DrawerData[] = [
    {
        id: 0,
        name: 'Analytics',
        icon: BarChart,
        link: 'analytics',
        adminOnly: false
    },
    {
        id: 1,
        name: 'All Bookings',
        icon: Book,
        link: 'view_all_bookings',
        adminOnly: false
    },
    {
        id: 2,
        name: 'Booking Now',
        icon: Book,
        link: 'booking_form',
        adminOnly: false
    },
    {
        id: 3,
        name: 'My Bookings',
        icon: Book,
        link: 'my_bookings',
        adminOnly: false
    },
    {
        id: 4,
        name: 'Profile',
        icon: User,
        link: 'profile',
        adminOnly: false
    },
    {
        id: 5,
        name: 'Manage Vehicles',
        icon: Car,
        link: 'vehicles',
        adminOnly: true
    },
    // {
    //     id: 6,
    //     name: 'Payments',
    //     icon: CreditCard,
    //     link: 'payments',
    //     adminOnly: true
    // },
    {
        id: 7,
        name: 'Tickets',
        icon: Ticket,
        link: 'tickets',
        adminOnly: false
    },
    {
        id: 8,
        name: 'All Ticket Check',
        icon: TicketCheck,
        link: 'all_tickets',
        adminOnly: true
    },
    {
        id: 9,
        name: 'log Out',
        icon: LogOut,
        link: '',
        adminOnly: false
    },
]