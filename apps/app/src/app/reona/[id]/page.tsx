import ReonaExample from './ReonaExample';

const ID_TO_TRACK: Record<string, string> = {
  '1': '01-state',
  '2': '02-component',
  '3': '03-nested_component',
  '4': '04-life-cycle',
};

export function generateStaticParams() {
  return Object.keys(ID_TO_TRACK).map((id) => ({ id }));
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trackName = ID_TO_TRACK[id];

  return <ReonaExample trackName={trackName} />;
}
