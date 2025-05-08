import TeamPage from '@/components/page/team/TeamPage'
import OpenTickets from '@/components/page/team/tickets/OpenTickets'
import UpcomingInstalls from '@/components/page/team/UpcomingInstalls'

export default async function page() {
const openTickets = []

  return (
    <div>
      <TeamPage  />
     {/* <UpcomingInstalls /> */}
     <OpenTickets openTickets={openTickets} />
    </div>
  )
}

