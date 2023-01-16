import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { UserPanel } from "~/components/UserPanel";
import { requireUserId } from "~/utils/auth.server";
import { getFilteredKudos } from "~/utils/kudo.server";
import { getOtherUsers } from "~/utils/user.server";
import { Kudo as IKudo, Profile } from "@prisma/client";
import { Kudo } from "~/components/Kudo";
import { SearchBar } from "~/components/SearchBar";

interface kudoWithProfile extends IKudo {
  author: {
    profile: Profile;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const kudos = await getFilteredKudos(userId, {}, {});
  return json({ users, kudos });
};

export default function Home() {
  const { users, kudos } = useLoaderData();
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <SearchBar />
          <div className="flex-1 flex">
            <div className="w-full p-10 flex flex-col gap-y-4">
              {kudos.map((kudo: kudoWithProfile) => (
                <Kudo key={kudo.id} profile={kudo.author.profile} kudo={kudo} />
              ))}
            </div>
            {/* Recent Kudos Goes Here */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
