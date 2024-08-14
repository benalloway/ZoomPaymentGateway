import type { MetaFunction } from "@remix-run/cloudflare";
import { Heading } from "~/components/Heading";
import { Link } from "~/components/Link";

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
      <Heading>Welcome to the Zoom Payment Gateway</Heading>
      <Link href="/webinars">Webinars</Link>
    </div>
  );
}
