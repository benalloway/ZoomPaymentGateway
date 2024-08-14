import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  return json({ webinarId: params.webinarId });
}

export default function Webinar() {
    const { webinarId } = useLoaderData() as { webinarId: string };
  return (
    <div>
      <h1>Webinar</h1>
        <p>Webinar ID: {webinarId}</p>
    </div>
  );
}
