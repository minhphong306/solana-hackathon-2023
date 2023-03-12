import { NextSeo } from 'next-seo';
import Head from 'next/head';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps) => {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href={`/BOT_ICON.png`} key="apple" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/BOT_ICON.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/BOT_ICON.png`}
          key="icon16"
        />
        <link rel="icon" href={`/BOT_ICON.png`} key="favicon" />
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: process.env.NEXT_PUBLIC_LOCALE,
          site_name: process.env.NEXT_PUBLIC_SITE_NAME,
          type: 'website',
          images: [
            {
              url: 'https://starbots.net/assets/images/banner/ido.png',
              width: 800,
              height: 600,
              alt: 'Banner Starbots',
            },
          ],
        }}
      />
    </>
  );
};

export default Meta;
