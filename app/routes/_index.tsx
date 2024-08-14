import type { MetaFunction } from "@remix-run/cloudflare";
import { Heading } from "~/components/Heading";

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
  return <Heading>welcome to the Zoom Payment Gateway</Heading>;
}
