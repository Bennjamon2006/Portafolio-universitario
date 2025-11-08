type Params = {
  project: string;
};

export async function generateStaticParams() {
  return [
    { project: "Project1" },
    { project: "Project2" },
    { project: "Project3" },
  ];
}

type Props = {
  id: string;
  name: string;
};

export async function getServerProps(params: Params): Promise<Props> {
  return {
    name: params.project,
    id: params.project.match(/\d+$/)![0],
  };
}

export default function ProjectDetail(props: Props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <p>#{props.id}</p>
    </div>
  );
}
