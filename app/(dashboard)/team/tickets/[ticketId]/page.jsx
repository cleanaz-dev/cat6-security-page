

export default async function page({ params }) {
  const { ticketId } = await params
  return (
    <div>Ticket ID: {ticketId}</div>
  )
}
