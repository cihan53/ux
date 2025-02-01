
import { faker } from '@faker-js/faker';
const generateUsers = () => {
  const positions = ['Executive', 'Manager', 'Specialist', 'Analyst', 'Director'];
  const companyRoles = ['TEAM_LEAD', 'MANAGER', 'DEVELOPER', 'TESTER', 'ANALYST'];
  const userTypes = ['DB', 'LDAP', 'SSO'];
  const roles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_DEVELOPER', 'ROLE_TESTER'];

  return Array.from({ length: 100 }, (_, i) => {
    const position = faker.helpers.arrayElement(positions);
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const username = `${position.toLowerCase()}.${surname.toLowerCase()}`;
    
    return {
      id: faker.string.uuid(),
      name: position,
      surname: surname,
      username: username,
      email: `${username}@chy.com.tr`,
      shortName: position.slice(0, 2).toUpperCase(),
      enabled: faker.datatype.boolean(0.8),
      developer: faker.datatype.boolean(0.7),
      userType: faker.helpers.arrayElement(userTypes),
      roles: [
        `ROLE_${position.toUpperCase()}_GROUP`,
        faker.helpers.arrayElement(roles)
      ],
      developerId: faker.string.uuid(),
      companyRole: faker.helpers.arrayElement(companyRoles),
      locked: faker.datatype.boolean(0.1),
      userAnalyticsDetail: {
        lastLoginDate: faker.date.recent({ days: 180 }).toISOString(),
        lastAccessDate: faker.date.recent({ days: 30 }).toISOString(),
        sessionDuration: `${faker.number.int({ min: 1, max: 20 })}w ${faker.number.int({ min: 1, max: 6 })}d`
      },
      deletable: faker.datatype.boolean(0.9),
      fullName: `${position} ${surname}`
    };
  });
};

// Kullanım
const fakeUseData = generateUsers();
 export default fakeUseData;