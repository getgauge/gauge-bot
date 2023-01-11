import { createSupportCard } from './projects';
import { isOrgMember } from './util';

export default async (context) => {
  let isMember = await isOrgMember(context, context.payload.issue.user.login);
  if (!isMember) {
    await createSupportCard(context, context.payload.issue.number);
  }
};
