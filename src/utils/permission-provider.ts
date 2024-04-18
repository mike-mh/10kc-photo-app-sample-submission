import { ApplicationInstanceInterface, User } from "kurier";

export default async function permissionProvider(this: ApplicationInstanceInterface, user: User): Promise<string[]> {
  // Think of this as a stub to add more permissions in the future.
  const permissions = (user.attributes.verified || !!process.env.EMAIL_AUTHENTICATION_BYPASS) ? ['verified'] : [];

  return Promise.resolve(permissions);
}
