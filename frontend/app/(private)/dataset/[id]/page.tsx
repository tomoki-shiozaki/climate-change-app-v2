type Props = {
  params: { id: string }; // URLパラメータがここに入る
};

export default function Page({ params }: Props) {
  const { id } = params;
  return <div>Dataset ID: {id}</div>;
}
