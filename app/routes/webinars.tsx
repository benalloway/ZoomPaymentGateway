import React from "react";

import { Link } from "~/components/Link";
import { Divider } from "~/components/Divider";
import { Heading } from "~/components/Heading";

export default function Webinars() {
  const [webinars, setWebinars] = React.useState([
    {
      agenda: "This is the agenda",
      duration: 60,
      id: 123,
      topic: "This is the topic",
      timezone: "est",
      start_time: "2022-01-01T00:00:00Z",
    },
  ]);
  return (
    <div>
      <Heading>Webinars</Heading>
      <ul className="mt-10">
        {webinars.map((webinar) => {
          return (
            <Link key={webinar.id} href={`/webinars/${webinar.id}`}>
              <li>
                <Divider />
                <div className="space-y-1.5">
                  <div className="text-base/6 font-semibold">
                    <a data-headlessui-state="" href="/events/1000">
                      {webinar.topic}
                    </a>
                  </div>
                  <div className="text-xs/6 text-zinc-500"></div>
                  <div className="text-xs/6 text-zinc-500">
                    {webinar.agenda}
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
