import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import { Outlet } from 'react-router-dom'
import Drawer from "./aside/Drawer"
import Container from "../../components/Container/Container"


const Dashboard = () => {
  return (
    <>
    <Navbar />
    <Container className='flex max-h-fit min-h-screen bg-gray-800 text-neutral-200' >
        <div className='min-w-fit bg-base-200 hidden md:block'>
          <Drawer />
        </div>
        <div className='flex flex-col min-w-[80%]'>
          {/* <Card className='h-fit'> */}
            <Outlet />
          {/* </Card> */}
        </div>
      </Container>
    <Footer />
    </>
  )
}

export default Dashboard