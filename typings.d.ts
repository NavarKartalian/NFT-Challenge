interface Image {
  asset: {
    _ref: string;
  };
}

export interface Creator {
  _id: string;
  name: string;
  address: string;
  slug: {
    current: string;
  };
  image: Image;
  bio: string;
}

export interface Collection {
  _id: string;
  title: string;
  address: string;
  slug: {
    current: string;
  };
  mainImage: Image;
  previewImage: Image;
  creator: Creator;
  nftCollectionName: string;
  description: string;
  bio: string;
}