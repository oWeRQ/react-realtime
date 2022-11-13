import RRoot from '../../components/RRoot';

export default function SpaceCode({ code }) {
  return (
    <RRoot socketUrl={'/api/socket?code=' + encodeURIComponent(code)} />
  );
}

export async function getServerSideProps({ params: { code } }) {
  return {
    props: {
      code,
    },
  }
}