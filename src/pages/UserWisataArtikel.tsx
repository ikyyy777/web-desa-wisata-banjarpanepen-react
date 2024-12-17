import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import HtmlToReact from 'html-to-react';

interface ArtikelWisata {
  id: number;
  wisata_id: number;
  konten: string;
  jam_operasional: string;
  lokasi: string;
  peta_lokasi: string;
}

interface Wisata {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  rating: string;
  kategori: string;
  slug: string;
}

declare module 'html-to-react' {
  export class Parser {
    parse: (html: string) => JSX.Element;
  }
}


export default function WisataArtikel() {
  const { slug: slug } = useParams();
  const [artikel, setArtikel] = useState<ArtikelWisata | null>(null);
  const [, setWisata] = useState<Wisata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const wisataResponse = await fetch(`${import.meta.env.VITE_WISATA_API}?slug=${slug}`);
        const wisataData = await wisataResponse.json();

        if (wisataData) {
          const artikelResponse = await fetch(`${import.meta.env.VITE_WISATA_ARTIKEL_API}?wisata_id=${wisataData.id}`);
          const artikelData = await artikelResponse.json();

          if (artikelData) {
            setArtikel({
              id: artikelData.id,
              wisata_id: artikelData.wisata_id,
              konten: artikelData.konten,
              jam_operasional: artikelData.jam_operasional,
              lokasi: artikelData.lokasi,
              peta_lokasi: artikelData.peta_lokasi,
            });
          }

          setWisata({
            id: wisataData.id,
            title: wisataData.title,
            description: wisataData.description,
            imageUrl: wisataData.imageUrl,
            price: wisataData.price,
            rating: wisataData.rating,
            kategori: wisataData.kategori,
            slug: wisataData.slug,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
    else {
      console.log('slug tidak ditemukan');
    }
  }, [slug]);


  const renderKonten = (konten: string) => {
    const htmlToReactParser = new HtmlToReact.Parser();
    const reactElement = htmlToReactParser.parse(konten);
  
    return reactElement;
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-green-500 animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title="Artikel Tidak Ditemukan"
          subtitle="Maaf, artikel yang Anda cari tidak tersedia"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img 
          src="/assets/logo.png" 
          alt="Watermark"
          className="w-120 h-96 opacity-5"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white shadow-sm rounded-xl p-8">
          <div className="text-black mb-8">
            {renderKonten(artikel.konten)}
          </div>

          {/* Informasi tambahan dalam bentuk teks */}
          <div className="space-y-6">
            {/* Jam Operasional */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-700">Jam Operasional:</span>
              <span className="text-gray-600">{artikel.jam_operasional}</span>
            </div>

            {/* Lokasi */}
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold text-gray-700">Lokasi:</span>
              <span className="text-gray-600">{artikel.lokasi}</span>
            </div>

            {/* Peta Lokasi */}
            {artikel.peta_lokasi && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="font-semibold text-gray-700">Peta Lokasi:</span>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <a href={artikel.peta_lokasi} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {artikel.peta_lokasi}
                  </a>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
} 