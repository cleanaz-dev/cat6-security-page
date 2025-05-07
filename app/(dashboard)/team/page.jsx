import TeamPage from '@/components/page/team/TeamPage'
import TeamSchedule from '@/components/page/team/TeamSchedule'
import { getAllClerkUsers } from '@/lib/clerk' 

export default async function page() {
  const members = await getAllClerkUsers()

  return (
    <div>
      <TeamPage members={members} />
     
    </div>
  )
}

