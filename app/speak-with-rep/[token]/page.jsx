// app/speak-with-rep/[token]/page.jsx

import { redirect } from 'next/navigation';
import SpeakWithRep from '@/components/page/SpeakWithRep';
import redis from '@/lib/redis';

export default async function Page({ params }) {
  const { token } = await params;
  
  // Server-side token validation
  const tokenData = await redis.get(`repToken:${token}`);
  if (!tokenData) redirect('/invalid-token');

  const { formData } = JSON.parse(tokenData);
  const { contact, project } = formData;

  return <SpeakWithRep contact={contact} project={project} />;
}