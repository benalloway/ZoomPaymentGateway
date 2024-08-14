import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Zoom Payment Gateway" },
    {
      name: "description",
      content: "Welcome to the Zoom Payment Gateway",
    },
  ];
};

export default function Index() {
  return (
    <div>
      <h1>Zoom Payment Gateway</h1>
      <p>
        Welcome to the Zoom Payment Gateway. This is a demo app to show how to
        integrate with the Zoom Payment Gateway.
      </p>
    </div>
  );
}
