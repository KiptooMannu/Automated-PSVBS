
import Footer from '../../../../components/Footer/Footer'
import BookingsPerMonth from './BookingsPerMonth'
import Overview from './Overview'

const Analytics = () => {
  return (
    <div className="bg-slate-200 h-full overflow-x-hidden">
      <h1 className="text-center text-2xl p-2 rounded-t-md text-webcolor font-bold border-b-2 border-slate-500">Analytics Dashboard</h1>
      <Overview />
      <BookingsPerMonth />
      <Footer />

    </div>
  )
}

export default Analytics