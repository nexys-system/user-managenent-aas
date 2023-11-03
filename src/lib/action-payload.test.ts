import {
  twoFaPayload,
  createActionPayload,
  decryptPayload,
} from "./action-payload";
import { generateSecretKey } from "./utils";
import { Action, AuthenticationOut, Locale, Permission, Profile } from "./type";

describe("Encryption and Decryption Services", () => {
  const secretKey = generateSecretKey(); // Generate a secret key for testing
  const uuid = "123e4567-e89b-12d3-a456-426614174000";
  const profile: Profile = {
    id: "sd",
    firstName: "John",
    lastName: "Doe",
    email: "jphn@doe.com",
    instance: { uuid: "s" },
  };
  const permissions: Permission[] = [Permission.app];
  const locale: Locale = { lang: "fr", country: "CH" };
  const action: Action = "CHANGE_EMAIL";

  test("2FA payload encryption and decryption", () => {
    const data: Pick<
      AuthenticationOut,
      "profile" | "permissions" | "locale"
    > & {
      auth: {
        uuid: string;
        value: string;
      };
    } = {
      profile,
      permissions,
      locale,
      auth: {
        uuid,
        value: "secretValue",
      },
    };

    const encrypted = twoFaPayload(data, secretKey);
    const decrypted = decryptPayload(encrypted, secretKey);

    expect(decrypted).toMatchObject(data);
    expect(decrypted.action).toBe("2FA");
  });

  test("Action payload encryption and decryption", () => {
    const instance = { uuid };
    const encrypted = createActionPayload(uuid, instance, action, secretKey);
    const decrypted = decryptPayload(encrypted, secretKey, action);

    expect(decrypted.id).toBe(uuid);
    expect(decrypted.instance).toMatchObject(instance);
    expect(decrypted.action).toBe(action);
  });
});
