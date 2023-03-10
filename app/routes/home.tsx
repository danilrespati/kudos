import { json, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";
import { UserPanel } from "~/components/UserPanel";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getFilteredKudos, getRecentKudos } from "~/utils/kudo.server";
import { getOtherUsers } from "~/utils/user.server";
import { Kudo as IKudo, Prisma, Profile } from "@prisma/client";
import { Kudo } from "~/components/Kudo";
import { SearchBar } from "~/components/SearchBar";
import { RecentBar } from "~/components/RecentBar";

interface kudoWithProfile extends IKudo {
  author: {
    profile: Profile;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);

  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");

  let sortOptions: Prisma.KudoOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "date") {
      sortOptions = { createdAt: "desc" };
    }
    if (sort === "sender") {
      sortOptions = { author: { profile: { firstName: "asc" } } };
    }
    if (sort === "emoji") {
      sortOptions = { style: { emoji: "asc" } };
    }
  }

  let textFilter: Prisma.KudoWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { message: { mode: "insensitive", contains: filter } },
        {
          author: {
            OR: [
              {
                profile: {
                  is: { firstName: { mode: "insensitive", contains: filter } },
                },
              },
              {
                profile: {
                  is: { lastName: { mode: "insensitive", contains: filter } },
                },
              },
            ],
          },
        },
      ],
    };
  }
  const kudos = await getFilteredKudos(userId, sortOptions, textFilter);

  const recentKudos = await getRecentKudos(userId);

  const currentUser = await getUser(request);

  return json({ users, kudos, recentKudos, currentUser });
};

export default function Home() {
  const { users, kudos, recentKudos, currentUser } = useLoaderData();
  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <SearchBar profile={currentUser.profile} />
          <div className="flex-1 flex overflow-hidden">
            <div className="h-full w-full p-10 flex flex-col gap-y-4 overflow-auto scrollbar-hide">
              {kudos.map((kudo: kudoWithProfile) => (
                <Kudo key={kudo.id} profile={kudo.author.profile} kudo={kudo} />
              ))}
            </div>
            <RecentBar kudos={recentKudos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
