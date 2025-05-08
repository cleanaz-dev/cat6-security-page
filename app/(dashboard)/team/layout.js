import { getAllClerkUsers } from '@/lib/clerk';
import TeamProvider from '@/lib/context/TeamProvider'
import { getAllContacts } from '@/lib/hubspot';
import redis, { getAllInstalls, getAllQuotes } from '@/lib/redis';


export default async function TeamLayout({ children }) {
         // Fetch data in parallel to reduce loading time
    const [contacts, team, quotes, installs] = await Promise.all([
      getAllContacts(),
      getAllClerkUsers(),
      getAllQuotes(),
      getAllInstalls()
    ]);

    const members = team.map(user => ({
      id:user.id,
      fullName: user.fullName || user.firstName,
      email: user.emailAddresses?.[0]?.emailAddress,
      role: user.publicMetadata.role,
      imageUrl: user.imageUrl
    }))


   
  return (
    <div>
      <TeamProvider data={{ contacts, members, quotes, installs }}>
        {children}
      </TeamProvider>
    </div>
  )
}
