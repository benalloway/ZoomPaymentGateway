import { useSearchParams } from "@remix-run/react";
import { Heading } from "~/components/Heading";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "~/components/DescriptionList";
import { Button } from "~/components/Button";
import { Code, Text } from "~/components/Text";
import { Link } from "~/components/Link";

export default function RegistrationConfirmation() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get("topic") as string;
  const startTime = searchParams.get("start_time") as string;
  const registrantId = searchParams.get("registrant_id") as string;
  const webinarId = searchParams.get("webinar_id") as string;
  const joinUrl = searchParams.get("join_url") as string;

  return (
    <div>
      <Heading>Successfully Registered!</Heading>

      <DescriptionList>
        <DescriptionTerm>Webinar Id</DescriptionTerm>
        <DescriptionDetails>{webinarId}</DescriptionDetails>
        <DescriptionTerm>Topic</DescriptionTerm>
        <DescriptionDetails>
          {topic ?? "[No topic set for this webinar]"}
        </DescriptionDetails>
        <DescriptionTerm>Start Time</DescriptionTerm>
        <DescriptionDetails>{startTime}</DescriptionDetails>
        <DescriptionTerm>Your Id</DescriptionTerm>
        <DescriptionDetails>{registrantId}</DescriptionDetails>
      </DescriptionList>

      <div className="my-10 w-6/12">
        <Text>Join Url:</Text>
        <Link className="break-words" href={joinUrl}>
          {joinUrl}
        </Link>
      </div>
      <Button href={joinUrl}>Join Meeting</Button>
    </div>
  );
}
