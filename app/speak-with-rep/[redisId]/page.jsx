// app/speak-with-rep/[token]/page.jsx

import { redirect } from 'next/navigation';
import SpeakWithRep from '@/components/page/SpeakWithRep';
import redis from '@/lib/redis';

export default async function Page({ params }) {
  const { redisId } = await params;
  
  // Server-side token validation
  const redisData = await redis.get(`redisId:${redisId}`);
  // const redisIdData   = await redis.get(`redisId:${redisId}`);
  if (!redisData) redirect('/invalid-token');



  const { formData } = JSON.parse(redisData);
  const { contact, project } = formData;

  return <SpeakWithRep contact={contact} project={project} redisId={redisId}/>;
}