import shortId from '../functions/shortId';

export default function Home() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/space/' + shortId(),
      permanent: false,
    },
  }
}