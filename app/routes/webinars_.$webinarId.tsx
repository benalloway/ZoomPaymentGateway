import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";
import { Heading } from "~/components/Heading";
import { Text } from "~/components/Text";
import { getWebinar, WebinarDetail } from "~/services/zoom/zoomServices";

export async function loader({ params }: LoaderFunctionArgs) {
  const tokenResponse = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZoomApiAccountId,
    },
    auth: {
      username: process.env.ZoomApiClientId!,
      password: process.env.ZoomApiClientSecret!,
    },
    timeout: 3000,
  });

  const accessToken = tokenResponse.data.access_token;
  const webinar: WebinarDetail = await getWebinar(accessToken, params.webinarId!);
  return json(webinar);
}

export default function Webinar() {
    const webinar: WebinarDetail = useLoaderData();
  return (
    <div>
        <Heading>{webinar.topic} <span className="text-xs text-gray-400">{webinar.duration} minutes</span></Heading>
        <Text>{webinar.agenda}</Text>
    </div>
  );
}
