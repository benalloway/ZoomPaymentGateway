import { json, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { FormEvent } from "react";

import { Button } from "~/components/Button";
import { Divider } from "~/components/Divider";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "~/components/Fieldset";
import { Heading } from "~/components/Heading";
import { Input } from "~/components/Input";
import { Text } from "~/components/Text";
import {
  getAccessToken,
  getWebinar,
  WebinarDetail,
} from "~/services/zoom/zoomServices";

export async function loader({ params }: LoaderFunctionArgs) {
  const accessToken = await getAccessToken();
  const webinar: WebinarDetail = await getWebinar(
    accessToken,
    params.webinarId!
  );
  return json(webinar);
}

export default function Webinar() {
  const webinar: WebinarDetail = useLoaderData();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      credit_card_number: formData.get("credit_card_number") as string,
      credit_card_expiration: formData.get("credit_card_expiration") as string,
      credit_card_security_code: formData.get(
        "credit_card_security_code"
      ) as string,
    };

    console.log(data);
  };

  return (
    <div>
      <Heading>Register for webinar</Heading>
      <section className="mt-10">
        <Form action="" onSubmit={handleSubmit}>
          <Fieldset>
            <Legend>Webinar Details</Legend>
            <Text>{webinar.topic ?? "[No topic is set for this webinar]"}</Text>

            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>First Name</Label>
                  <Input
                    name="first_name"
                    autoComplete="given-name"
                    type="text"
                    required
                  />
                </Field>
                <Field>
                  <Label>Last Name</Label>
                  <Input
                    name="last_name"
                    autoComplete="family-name"
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
                    <Label>Security Code</Label>
                    <Input
                      name="credit_card_security_code"
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
