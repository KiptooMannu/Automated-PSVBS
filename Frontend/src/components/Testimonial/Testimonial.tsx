import "./testimonial.scss";

const testimonials = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "John Doe",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Jane Doe",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Jim Beam",
    text: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Elisa Maza",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "William Smith",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 6,
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Emily Clarke",
    text: "Fusce placerat euismod velit, eget fermentum metus varius et. Integer posuere erat a ante venenatis.",
  },
  {
    id: 7,
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Michael Brown",
    text: "Maecenas sed diam eget risus varius blandit sit amet non magna. Nulla vitae elit libero, a pharetra augue.",
  },
  {
    id: 8,
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sophia Johnson",
    text: "Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla.",
  },
 
];

const Testimonial = () => {
  return (
    <>
      <h1 className="text-center font-bold">Our Testimonials</h1>
      <div className="testimonial-container">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="testimonial-img"
            />
            <h5>{testimonial.name}</h5>
            <p>{testimonial.text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Testimonial;
