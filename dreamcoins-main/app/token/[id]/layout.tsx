// layout.tsx - Stays as Server Component

import { Metadata } from 'next'
 
type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dream/${params.id}`)

  const dream = await res.json()

  if (!dream) {
    return {}
  }

  return {
    title: `$${dream.ticker} - ${dream.name}`,
    description: `$${dream.ticker} is a Dreamcoin created on Dreamcoins.fun`,
    openGraph: {
      title: `$${dream.ticker} - ${dream.name}`,
      description: `$${dream.ticker} is a Dreamcoin created on Dreamcoins.fun`,
      images: [dream.imageUrl],
      siteName: "Dreamcoins",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/token/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `$${dream.ticker} - ${dream.name}`,
      description: `$${dream.ticker} is a Dreamcoin created on Dreamcoins.fun`,
      images: [dream.imageUrl],
    },
  }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Do what you need to do
    <>
      {children}
    </>
  )
}
