import "server-only";

import { requireUser } from "@/app/session.server";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // auth
  const user = await requireUser();
  //
  return (
    <div>
      <h1>Protected Layout</h1>
      <div>
        <p>Hello {user.email}</p>
      </div>
      <div>{children}</div>
      <div>
        <p>Footer</p>
      </div>
    </div>
  );
}
