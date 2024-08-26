import { db } from "@/server/db";
import { faker } from "@faker-js/faker";

const testOrgId = "cluei1du1009fajms4owxwe11";

// const submissions = new Array(4000)
//   .fill({
//     formId: "65fa4b6d18fe124790c35222",
//     orgId: testOrgId,
//   })
//   .map((form) => ({
//     answers: [
//       { label: "name", value: faker.person.fullName() },
//       { label: "email", value: faker.internet.email() },
//       { label: "message", value: faker.lorem.paragraph({ max: 5, min: 2 }) },
//     ],
//     isSpam: false,
//     formId: form.formId,
//   }));

// let forms = [];

export async function POST(_request: Request) {
  // const formsToSubmit = new Array(100)
  //   .fill({
  //     orgId: testOrgId,
  //   })
  //   .map((form) => ({
  //     name: `${faker.company.name()} form`,
  //     orgId: form.orgId,
  //   }));

  try {
    // const domain = await db.domain.create({
    //   data: {
    //     name: "relance.com",
    //     domainId: "pkdncwkdnvkwdpvkn",
    //     orgId: testOrgId,
    //     records: JSON.stringify({ dkim: "record" }),
    //     status: "not_started",
    //   },
    // });
    // await db.form.deleteMany({
    //   where: { orgId: testOrgId },
    // });
    // await db.submission.createMany({ data: submissions });
    // await db.form.createMany({ data: formsToSubmit });
    // const form = await db.form.findUnique({
    //   where: { id: "clubgvpbs00smwl8anm3s7jji" },
    // });
    // forms = await db.form.findMany({
    //   where: { orgId: testOrgId },
    //   select: {
    //     id: true,
    //     orgId: true,
    //     name: true,
    //     isClosed: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     _count: {
    //       select: { submissions: true },
    //     },
    //   },
    //   take: 10,
    // });
    // await db.form.deleteMany({ where: { orgId: testOrg2Id } });
    return Response.json({ sucess: true }, { status: 200 });
  } catch (error) {
    console.log("ERROR: ", error);
    return Response.json({ error }, { status: 500 });
  }
}
