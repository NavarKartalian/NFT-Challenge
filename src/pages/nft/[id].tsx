import { useAddress, useDisconnect, useMetamask, useNFTDrop } from '@thirdweb-dev/react';
import Atropos from 'atropos/react';
import { BigNumber } from 'ethers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sanityClient, urlFor } from '../../../sanity';
import { Collection } from '../../../typings';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../../components/Modal';

interface NFTProps {
  collection: Collection;
}

export default function NFTDropPage({ collection }: NFTProps) {
  const connectWithMetamask = useMetamask();
  const nftDrop = useNFTDrop(collection.address);
  const address = useAddress();
  const disconnect = useDisconnect();

  const [ claimedSupply, setClaimedSupply ] = useState(0);
  const [ totalSupply, setTotalSupply ] = useState<BigNumber>();
  const [ price, setPrice ] = useState('');
  const [ refetch, setRefetch ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ nftName, setNftName ] = useState('');
  const [ nftImage, setNftImage ] = useState('');

  useEffect(() => {
    if(!nftDrop) {
      return; 
    }

    async function fetchNFTData() {
      setLoading(true);
      const claimed = await nftDrop?.getAllClaimed();
      const total = await nftDrop?.totalSupply();
      const claimCondition = await nftDrop?.claimConditions.getAll();

      setClaimedSupply(claimed?.length!);
      setTotalSupply(total);
      setPrice(claimCondition?.[0].currencyMetadata.displayValue!);

      setLoading(false);
    }

    fetchNFTData();
  }, [nftDrop, refetch]);

  function mintNFT() {
    if(!nftDrop || !address) {
      return;
    }
    const quantity = 1;

    setLoading(true);

    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: '#4EE39D',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px'
      }
    })

    nftDrop?.claimTo(address, quantity).then(async (tx) => {
      const receipt = tx[0].receipt;
      const claimedTokenId = tx[0].id;
      const claimedNFT = tx[0].data();

      toast(`Minted ${(await claimedNFT).metadata.name}`, {
        duration: 8000,
        style: {
          background: '#4EE39D',
          color: '#07071C',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px'
        }
      });

      setNftName((await claimedNFT).metadata.name);
      setNftImage((await claimedNFT).metadata.image!);

      setModalOpen(true);
    }).catch((error) => {
      console.log(error);
      toast('Something went wrong!', {
        style: {
          background: '#FF496A',
          color: 'white',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px'
        }
      })
    }).finally(() => {
      setLoading(false);
      setRefetch(!refetch);
      toast.dismiss(notification);
    });
  }

  return (
    <>
      <Head>
        <title>{collection.nftCollectionName}</title>
        <link rel="icon" href="/favicon.png" type='image/png' />
      </Head>
      
      <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        <Toaster position='top-center' />

        <AnimatePresence>
          {modalOpen && (
            <Modal 
              handleClose={() => setModalOpen(false)} 
              name={nftName}
              image={nftImage}
            />
          )}
        </AnimatePresence>

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

            {loading ? (
              <p className='pt-2 text-xl text-[#4EE39D] animate-bounce'>
                Loading...
              </p>
            ) : (
              <p className='pt-2 text-xl text-[#4EE39D]'>
                {claimedSupply} / {totalSupply?.toString()} NFT'S claimed
              </p>
            )}
          </div>

          <button 
            className='h-16 w-full lg:bg-transparent lg:text-[#4EE39D] 
            rounded-full mt-10 font-bold lg:mt-0 lg:border lg:border-[#4EE39D]
            hover:bg-[#4EE39D] hover:text-[#07071C] transition-all
            ease-in-out duration-300 sticky bottom-8 lg:static lg:bottom-0
            border-0 bg-[#4EE39D] text-[#07071C] disabled:bg-slate-800
            disabled:text-white disabled:border-none'
            disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
            onClick={() => mintNFT()}
          >
            {!address ? 'Connect wallet to Mint' : 
              claimedSupply === totalSupply?.toNumber() ? 'All NFT\'s claimed' : 
              loading ? 'Loading...' : `Mint NFT (${price} ETH)`}
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