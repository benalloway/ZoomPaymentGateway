import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

import { Button } from "~/components/Button";
import { Divider } from "~/components/Divider";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "~/components/Fieldset";
import { Heading, Subheading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import {
  getAccessToken,
  getWebinar,
  WebinarDetail,
} from "~/services/zoom/zoomServices";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "~/components/DescriptionList";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const accessToken = await getAccessToken();
  const webinar: WebinarDetail = await getWebinar(
    accessToken,
    params.webinarId!
  );
  return json(webinar);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const data = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    credit_card_number: formData.get("credit_card_number") as string,
    credit_card_expiration: formData.get("credit_card_expiration") as string,
    credit_card_cvc: formData.get("credit_card_cvc") as string,
  };

  console.log(data);

  // authorize and charge card on authorizeNet

  const chargeRes = false;

  // if not successfully charged, display error returned from authorizeNet
  // - return json({errorMessage})
  if (!chargeRes) return json({ errorMessage: "unable to charge card" });

  // if successfully charged, register for zoom webinar
  // return redirect("/webinars/registration-confirmation", {
  //     headers: {
  //         ""
  //     }
  // })

  // If cannot successfully register, display "we successfully charged your card, please reach out for us to register you for event"
  // - return json({errorMessage})

  // if successfully registered, redirect to confirmation page and display results of registration (webinar date, join url, add-to-calendar, etc.)
  // - make sure to retry a few times

  return null;
};

export default function Webinar() {
  const webinar: WebinarDetail = useLoaderData();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Subheading level={2}>Register for webinar</Subheading>
      <DescriptionList>
        <DescriptionTerm>Topic</DescriptionTerm>
        <DescriptionDetails>
          {webinar.topic ?? "[No topic set for this webinar]"}
        </DescriptionDetails>

        <DescriptionTerm>Agenda</DescriptionTerm>
        <DescriptionDetails>
          {webinar.agenda.trim()
            ? webinar.agenda
            : "[No agenda set for this webinar]"}
        </DescriptionDetails>

        <DescriptionTerm>Agenda</DescriptionTerm>
        <DescriptionDetails>
          {webinar.duration
            ? webinar.duration + " minutes"
            : "[No agenda set for this webinar]"}
        </DescriptionDetails>

        <DescriptionTerm>Price</DescriptionTerm>
        <DescriptionDetails>$14.99</DescriptionDetails>
      </DescriptionList>
      <section className="mt-10">
        <Form method="post">
          <Fieldset>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>First Name</Label>
                  <Input
                    name="first_name"
                    autoComplete="given-name"
                    autoCapitalize="words"
                    type="text"
                    required
                  />
                </Field>
                <Field>
                  <Label>Last Name</Label>
                  <Input
                    name="last_name"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    type="text"
                    required
                  />
                </Field>
              </div>
              <Field>
                <Label>Email</Label>
                <Input
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
                <Field className="col-span-2">
                  <Label>Credit Card Number</Label>
                  <Input
                    name="credit_card_number"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    pattern="[0-9 ]+"
                    type="number"
                    minLength={15}
                    maxLength={16}
                    required
                  />
                </Field>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                  <Field>
                    <Label>Expiration</Label>
                    <Input
                      name="credit_card_expiration"
                      autoComplete="cc-exp"
                      type="month"
                      required
                    />
                  </Field>
                  <Field>
                    <Label>CVC</Label>
                    <Input
                      className="max-w-[6rem]"
                      name="credit_card_cvc"
                      autoComplete="cc-csc"
                      type="number"
                      pattern="\d{3,4}"
                      minLength={3}
                      maxLength={4}
                      required
                    />
                  </Field>
                </div>
              </div>
              <Divider />

              {actionData?.errorMessage?.trim() && (
                <div className="flex flex-row space-x-4 border-l-4 border-red-500 bg-red-100 h-16 items-center rounded-sm">
                  {/* <ExclamationCircleIcon className="text-red-600 ml-2" height={48} /> */}
                  <Text className="ml-4 !text-red-600 text-center">
                    {actionData.errorMessage}
                  </Text>
                </div>
              )}

              <Button type="submit" className="w-full">
                Register
              </Button>
            </FieldGroup>
          </Fieldset>
        </Form>
      </section>
    </div>
  );
}
