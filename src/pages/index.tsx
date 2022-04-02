import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';

interface HomeProps {
  collections: Collection[];
}

export default function Home({ collections }: HomeProps) {
  return (
    <>
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.png" type='image/png' />
      </Head>

      <div className='max-w-7xl mx-auto flex flex-col min-h-screen py-20 px-10'>
        <h1 className='mb-10 text-4xl font-extralight text-white'>
          The <span className='font-extrabold underline decoration-[#FF496A]'>
            PAPAFAM
          </span> NFT Market Place
        </h1>

        <main className='bg-[#0c0c2d]/80 p-10 shadow-xl shadow-[#4EE39D]/25 rounded-xl'>
          <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
            {collections.map(collection => (
              <Link href={`/nft/${collection.slug.current}`} key={collection._id}>
                <div className='flex flex-col items-center cursor-pointer
                  hover:scale-105 transition-all duration-200'>
                  <div className='relative w-40 h-64 sm:h-96 sm:w-60'>
                    <Image
                      src={urlFor(collection.previewImage.asset._ref).url()} 
                      className='object-cover rounded-2xl'
                      layout='fill'
                      alt={'NFT collection preview'}
                    />
                  </div>

                  <div className='text-white p-5'>
                    <h2 className='text-3xl'>{collection.title}</h2>
                    <p className='mt-2 text-sm text-gray-400'>{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const querry = `*[_type == "collection"]{
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

  const collections = await sanityClient.fetch(querry);

  return {
    props: {
      collections,
    },
  };
}