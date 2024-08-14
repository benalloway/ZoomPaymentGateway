import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Divider } from "~/components/Divider";
import { Field, FieldGroup, Fieldset, Label } from "~/components/Fieldset";
import { Subheading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import {
  addWebinarRegistrant,
  getAccessToken,
  getWebinar,
  WebinarDetail,
} from "~/services/zoomServices";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "~/components/DescriptionList";
import { captureAndCharge } from "~/services/authorizeNetServices";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const zoomApiClientId = context.cloudflare.env.ZoomApiClientId;
  const zoomApiClientSecret = context.cloudflare.env.ZoomApiClientSecret;
  const zoomApiAccountId = context.cloudflare.env.ZoomApiAccountId;

  const accessToken = await getAccessToken({
    zoomApiClientId,
    zoomApiClientSecret,
    zoomApiAccountId,
  });

  const webinar: WebinarDetail = await getWebinar(
    accessToken,
    params.webinarId!
  );

  return json(webinar);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const authorizeNetApiLoginId = context.cloudflare.env.AuthorizeNetApiLoginId;
  const authorizeNetApiTransactionKey =
    context.cloudflare.env.AuthorizeNetApiTransactionKey;

  const zoomApiClientId = context.cloudflare.env.ZoomApiClientId;
  const zoomApiClientSecret = context.cloudflare.env.ZoomApiClientSecret;
  const zoomApiAccountId = context.cloudflare.env.ZoomApiAccountId;

  const formData = await request.formData();

  const data = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    credit_card_number: formData.get("credit_card_number") as string,
    credit_card_expiration: formData.get("credit_card_expiration") as string,
    credit_card_cvc: formData.get("credit_card_cvc") as string,
    webinar_price: formData.get("webinar_price") as string,
    webinar_id: formData.get("webinar_id") as string,
  };

  // console.log(data);

  // authorize and charge card on authorizeNet
  const captureResponse = await captureAndCharge({
    authorizeNetApiLoginId,
    authorizeNetApiTransactionKey,
    amount: data.webinar_price,
    cardCode: data.credit_card_cvc,
    cardNumber: data.credit_card_number,
    expDate: data.credit_card_expiration,
  });

  if (captureResponse?.transactionResponse?.responseCode !== "1") {
    // if not successfully charged, display error returned from authorizeNet
    // - return json({errorMessage})
    console.log(captureResponse?.messages?.message);
    return json({ errorMessage: "Unable to charge card" });
  }

  // if successfully charged, register for zoom webinar

  const accessToken = await getAccessToken({
    zoomApiClientId,
    zoomApiClientSecret,
    zoomApiAccountId,
  });

  if (!accessToken?.trim())
    return json({ errorMessage: "Unable to get accessToken" });

  const registrationResponse = await addWebinarRegistrant({
    accessToken,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    webinarId: data.webinar_id,
  });

  // if successfully registered, redirect to confirmation page and display results of registration (webinar date, join url, add-to-calendar, etc.)
  // - make sure to retry a few times

  if (registrationResponse !== null) {
    return redirect(
      `/webinars/registration-confirmation?webinar_id=${registrationResponse.id}&join_url=${registrationResponse.join_url}&start_time=${registrationResponse.start_time}&topic=${registrationResponse.topic}&registrant_id=${registrationResponse.registrant_id}`
    );
  }

  // console.log(registrationResponse);

  return json({ errorMessage: "Unable to register for webinar" });
};

export default function Webinar() {
  const webinar: WebinarDetail = useLoaderData();
  const actionData = useActionData<typeof action>();

  console.log(actionData);

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
          <input name="webinar_id" value={webinar.id} readOnly hidden />
          <input name="webinar_price" value={14.99} readOnly hidden />
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
