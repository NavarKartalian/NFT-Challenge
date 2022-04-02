import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import Atropos from 'atropos/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '../../../sanity';
import { Collection } from '../../../typings';

interface NFTProps {
  collection: Collection;
}

export default function NFTDropPage({ collection }: NFTProps) {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <>
      <Head>
        <title>{collection.nftCollectionName}</title>
        <link rel="icon" href="/favicon.png" type='image/png' />
      </Head>
      
      <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        <div className='bg-gradient-to-br from-[#0d324d] to-[#380036] lg:col-span-4'>
          <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
            <h2 className='font-bold text-white'>Hover me!</h2>
            <Atropos
              activeOffset={40}
              shadowScale={1.05}
              className='rounded-xl'
              highlight={false}
            >
              <div 
                className='bg-gradient-to-br from-[#D834FF] to-[#0A84FF] p-2 rounded-xl'
              >
                <div className='w-44 h-44 lg:w-72 lg:h-96 relative'>
                  <div className='w-full h-full relative bg-[#e4e4a8]' data-atropos-offset="-5" />
                  <Image 
                    src={urlFor(collection.mainImage.asset._ref).url()}
                    alt="PAPAFAM Apes" 
                    priority
                    layout='fill'
                    className='object-cover rounded-xl relative'
                    data-atropos-offset="5"
                  />
                </div>
              </div>
            </Atropos>

            <div className='text-center p-5 space-y-2'>
              <h1 className='text-4xl font-bold text-white'>
                {collection.nftCollectionName}
              </h1>
              
              <h2 className='text-xl text-gray-300'>
                {collection.description}
              </h2>
            </div>
          </div>
        </div>
        
        <div className='flex flex-1 flex-col px-12 py-8 lg:col-span-6 bg-[#07071C]'>
          <header className='flex items-center justify-between text-white'>
            <Link href={'/'} passHref>
              <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
                The <span className='font-extrabold underline decoration-[#FF496A]'>
                  PAPAFAM
                </span> NFT Market Place
              </h1>
            </Link>

            <button 
              className={`rounded-full bg-[#4EE39D] text-[#07071C] font-medium
              px-4 py-2 lg:px-5 lg:py-3 hover:scale-110 transition-all ease-in-out duration-300`}
              onClick={() => address ? disconnect() : connectWithMetamask()}
            >
              {address ? 'Disconnect wallet' : 'Connect wallet'}
            </button>
          </header>

          <hr className='my-2 border' />

          {address && (
            <p className='text-center text-sm text-[#FF496A]'>
              You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}
            </p>
          )}

          <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center
            lg:justify-center'>
            <div className='w-80 h-80 relative pb-10 lg:h-40'>
              <Image
                src={urlFor(collection.previewImage.asset._ref).url()}
                layout='fill'
                alt=''
                priority 
                className='object-cover rounded-xl'
              />
            </div>

            <h1 className='text-xl font-bold lg:text-5xl lg:font-extrabold text-[#EBEBF5]'>
              {collection.title}
            </h1>

            <p className='pt-2 text-xl text-[#4EE39D]'>
              13 / 21 NFT'S claimed
            </p>
          </div>

          <button 
            className='h-16 w-full lg:bg-transparent lg:text-[#4EE39D] 
            rounded-full mt-10 font-bold lg:mt-0 lg:border lg:border-[#4EE39D]
            hover:bg-[#4EE39D] hover:text-[#07071C] transition-all
            ease-in-out duration-300 sticky bottom-8 lg:static lg:bottom-0
            border-0 bg-[#4EE39D] text-[#07071C]'
          >
            Mint NFT (0.01 ETH)
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const querry = `*[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    slug {
    current,
   },
    address,
    description,
    nftCollectionName,
    mainImage {
    asset
   },
    previewImage {
    asset  
    },
    creator -> {
    _id,  
    name,
    address,
    slug {
    current  
    },  
  },
  }`;

  const collection = await sanityClient.fetch(querry, { id: params?.id });

  if(Object.keys(collection).length === 0 || !collection) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      collection,
    }
  }
}