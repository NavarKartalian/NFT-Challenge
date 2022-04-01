import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.png" type='image/png' />
      </Head>

      <div className='w-screen h-screen bg-[#07071C] flex justify-center items-center'>
        <Link passHref href={'/nft/papafam'}>
          <a className='text-white animate-bounce text-2xl lg:text-8xl cursor-pointer font-extrabold'>
            WORK IN PROGRESS...
          </a>
        </Link>
      </div>
    </>
  );
}