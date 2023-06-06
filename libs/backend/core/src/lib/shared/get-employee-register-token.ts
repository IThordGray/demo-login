import { Member } from '../members/abstractions/member.model';

export function getEmployeeRegisterToken(member: Partial<Member>): string {
  const registerToken = {
    // firstName: member. employee.userInfo.firstName,
    // lastName: member. employee.userInfo.lastName,
    // email: member. employee.contactInfo.email
  };

  return Buffer.from(JSON.stringify(registerToken)).toString('base64');
}
