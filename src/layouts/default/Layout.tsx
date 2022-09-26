import Head from 'next/head';
import { useRouter } from 'next/router';

import { site } from '@/lib/site';
import Navbar from '@/layouts/default/Navbar';

type TLayout = {
  children: JSX.Element;
};

const Layout = (props: TLayout) => {
  const router = useRouter();

  const { children, ...customMeta } = props;

  const meta = {
    mainTitle: 'Rendi Riz Dictionary',
    title: null,
    description: 'New Word Order',
    image: 'https://placehold.co/1820x904',
    date: null,
    ...customMeta,
  };

  let metaTitle = meta.mainTitle;
  if (meta.title) {
    metaTitle = `${meta.title} — ${meta.mainTitle}`;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href={site.favicon} />
        <link rel="canonical" href={`${site.url}${router.asPath}`} />
        <title>{metaTitle}</title>
        <meta name="application-name" content={site.name} />
        <meta name="description" content={meta.description} />
        <meta name="robots" content="follow, index" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={site.nameMobile} />
        <meta property="og:url" content={`${site.url}${router.asPath}`} />
        <meta property="og:type" content={site.type} />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={site.twitter} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#292524" />
        <link rel="apple-touch-icon" href="/touch-icon-iphone.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
