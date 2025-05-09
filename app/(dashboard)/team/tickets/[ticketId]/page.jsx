import SingleTicketsPage from "@/components/page/team/tickets/SingleTicketsPage"
import { getNotesByTicketId, getTicketById } from "@/lib/redis"


export default async function page({ params }) {
  const { ticketId } = await params
  const ticket = await getTicketById(ticketId)
  const notes = await getNotesByTicketId(ticketId)

  return (
    <div><SingleTicketsPage ticket={ticket} notes={notes}/></div>
  )
}
