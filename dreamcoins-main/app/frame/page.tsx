import { FrameMetadata } from '@coinbase/onchainkit/frame';

const URL = `${process.env.NEXT_PUBLIC_APP_URL}/terminal`

export default function FramePage() {
  return (
    <FrameMetadata
      buttons={[
        
        {
          action: 'link',
          label: 'Launch Dreamboy Terminal',
          target: `https://warpcast.com/~/composer-action?url=${encodeURIComponent(URL)}`
        },
      ]}
      image={{
       src: 'https://zizzamia.xyz/park-3.png',
       aspectRatio: '1:1'
      }}
    />
  );
}
