// app/book-zoom/[token]/page.jsx

import { redirect } from 'next/navigation';

import redis from '@/lib/redis';
import BookZoom from '@/components/page/BookZoom';

export default async function Page({ params }) {
  const { token } = await params;
  
  // Server-side token validation
  const tokenData = await redis.get(`zoomToken:${token}`);
  if (!tokenData) redirect('/invalid-token');

  const { formData } = JSON.parse(tokenData);
  const { contact, project } = formData;

  return <BookZoom contact={contact} project={project} />;
}