import axios from "axios";

import { Link } from "~/components/Link";
import { Divider } from "~/components/Divider";
import { Heading } from "~/components/Heading";
import { json, useLoaderData } from "@remix-run/react";
import { getWebinars } from "~/services/zoom/zoomServices";

export async function loader() {
  // move this to one place and leverage session storage server side to store the token?
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
  const webinars = await getWebinars(accessToken);
  return json(webinars);
}

export default function Webinars() {
  const webinars = useLoaderData<typeof loader>();

  return (
    <div>
      <Heading>Webinars</Heading>
      <ul className="mt-10">
        {webinars.map((webinar) => {
          return (
            <Link key={webinar.id} href={`/webinars/${webinar.id}`}>
              <li key={webinar.id}>
                <Divider />
                <div className="space-y-1.5">
                  <div className="text-base/6 font-semibold">
                    <a data-headlessui-state="" href="/events/1000">
                      {webinar.topic}
                    </a>
                  </div>
                  <div className="text-xs/6 text-zinc-500"></div>
                  <div className="text-xs/6 text-zinc-500">
                    {webinar.start_time} <span aria-hidden="true">·</span>{" "}
                    {webinar.timezone}
                  </div>
                  <div className="text-xs/6 text-zinc-600">
                    {webinar.duration} minutes
                  </div>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
