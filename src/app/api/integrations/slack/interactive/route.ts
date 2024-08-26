export async function POST(_request: Request) {
  // Do some analytics here.
  return Response.json(
    { message: "Slack interaction payload received" },
    { status: 200 },
  );
}
